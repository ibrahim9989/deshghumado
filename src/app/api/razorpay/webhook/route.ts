import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

// Disable body parsing for webhook
export const runtime = 'nodejs';

// Verify webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const supabase = createSupabaseServer();

    // Handle different event types
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const bookingId = payment.notes?.booking_id;

      if (!bookingId) {
        console.error('Booking ID not found in payment notes');
        return NextResponse.json({ error: 'Booking ID missing' }, { status: 400 });
      }

      // Update booking with payment information
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (booking) {
        const amountPaid = payment.amount / 100; // Convert from paise to rupees
        const newDepositPaid = (booking.deposit_paid_inr || 0) + amountPaid;
        const newBalanceDue = booking.total_amount_inr - newDepositPaid;

        // Determine payment status
        let paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' = 'partial';
        let bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' = 'pending';

        if (newBalanceDue <= 0) {
          paymentStatus = 'paid';
          bookingStatus = 'confirmed';
        } else if (newDepositPaid >= booking.total_amount_inr * 0.3) {
          // At least 30% deposit paid
          bookingStatus = 'confirmed';
        }

        // Update booking
        await supabase
          .from('bookings')
          .update({
            deposit_paid_inr: newDepositPaid,
            balance_due_inr: newBalanceDue,
            payment_status: paymentStatus,
            status: bookingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        // Create payment record (if you have a payments table)
        // You might want to create a payments table to track all payment transactions
        console.log(`Payment captured for booking ${bookingId}: ₹${amountPaid}`);
      }
    } else if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const bookingId = payment.notes?.booking_id;

      if (bookingId) {
        console.log(`Payment failed for booking ${bookingId}`);
        // You might want to update booking status or send notification
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

