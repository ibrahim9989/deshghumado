import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getRazorpayInstance } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    const razorpay = getRazorpayInstance();

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured' },
        { status: 400 }
      );
    }

    // Update booking with payment information
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
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        deposit_paid_inr: newDepositPaid,
        balance_due_inr: newBalanceDue,
        payment_status: paymentStatus,
        status: bookingStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus,
      bookingStatus,
      amountPaid,
      balanceDue: newBalanceDue,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

