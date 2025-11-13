import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getRazorpayInstance } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    console.log('[Razorpay Create Order] ===== START =====');
    
    // Check environment variables
    const hasKeyId = !!process.env.RAZORPAY_KEY_ID;
    const hasKeySecret = !!process.env.RAZORPAY_KEY_SECRET;
    console.log('[Razorpay Create Order] Environment check:', { hasKeyId, hasKeySecret });
    
    if (!hasKeyId || !hasKeySecret) {
      console.error('[Razorpay Create Order] Missing Razorpay credentials');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { bookingId, amount, currency = 'INR' } = body;

    console.log('[Razorpay Create Order] Request body:', { bookingId, amount, currency });

    if (!bookingId || !amount) {
      console.error('[Razorpay Create Order] Missing parameters');
      return NextResponse.json(
        { error: 'Missing bookingId or amount' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('[Razorpay Create Order] Auth error:', authError);
    }

    if (!user) {
      console.error('[Razorpay Create Order] Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Razorpay Create Order] User authenticated:', user.id);

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (bookingError) {
      console.error('[Razorpay Create Order] Booking query error:', bookingError);
    }

    if (bookingError || !booking) {
      console.error('[Razorpay Create Order] Booking not found:', { bookingId, userId: user.id });
      return NextResponse.json(
        { error: 'Booking not found', details: bookingError?.message },
        { status: 404 }
      );
    }

    console.log('[Razorpay Create Order] Booking found:', booking.id);

    // Initialize Razorpay
    console.log('[Razorpay Create Order] Initializing Razorpay instance...');
    let razorpay;
    try {
      razorpay = getRazorpayInstance();
      console.log('[Razorpay Create Order] Razorpay instance created');
    } catch (razorpayError: any) {
      console.error('[Razorpay Create Order] Failed to initialize Razorpay:', razorpayError);
      return NextResponse.json(
        { error: 'Payment gateway initialization failed', details: razorpayError.message },
        { status: 500 }
      );
    }

    // Create Razorpay order
    // Receipt must be max 40 characters - use booking reference or shortened ID
    const receipt = booking.booking_reference 
      ? booking.booking_reference.substring(0, 40)
      : `DG${bookingId.substring(0, 8)}${Date.now().toString().slice(-8)}`.substring(0, 40);
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: receipt,
      notes: {
        booking_id: bookingId,
        user_id: user.id,
        tour_id: booking.tour_id,
      },
    };

    console.log('[Razorpay Create Order] Creating order with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    });

    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log('[Razorpay Create Order] Order created successfully:', order.id);
    } catch (orderError: any) {
      console.error('[Razorpay Create Order] Razorpay API error:', orderError);
      console.error('[Razorpay Create Order] Error details:', {
        message: orderError.message,
        statusCode: orderError.statusCode,
        error: orderError.error,
        description: orderError.description,
      });
      throw orderError;
    }

    // Store Razorpay order ID in booking (you might want to add a razorpay_order_id column)
    await supabase
      .from('bookings')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    const response = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    };
    
    console.log('[Razorpay Create Order] ===== SUCCESS =====');
    console.log('[Razorpay Create Order] Response:', { orderId: response.orderId, amount: response.amount });
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[Razorpay] Error creating order:', error);
    console.error('[Razorpay] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      description: error.description,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create order',
        details: error.description || error.error?.description,
      },
      { status: 500 }
    );
  }
}

