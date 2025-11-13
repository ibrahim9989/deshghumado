# Razorpay Payment Integration Setup

This guide explains how to set up and use Razorpay payment integration in the DeshGhumado application.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
RAZORPAY_KEY_SECRET=R4krUJxoL2RsBVyUAqnkOu8l
RAZORPAY_WEBHOOK_SECRET=bEgz_vpPSs9x3th

# Public Razorpay Key (for client-side)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_ReRt29vMOOk9Wj
```

## How It Works

### 1. Booking Flow
1. User fills out booking form on `/book/[slug]`
2. Booking is created in Supabase with status `pending`
3. Razorpay order is created for the deposit amount (30% of total)
4. Razorpay checkout modal opens
5. User completes payment
6. Payment is verified on the server
7. Booking status is updated based on payment

### 2. Payment Verification
- **Client-side**: Payment signature is verified immediately after payment
- **Server-side**: Payment is verified via API route `/api/razorpay/verify-payment`
- **Webhook**: Razorpay sends webhook events to `/api/razorpay/webhook` for additional verification

### 3. Booking Status Updates
- **Pending**: Initial booking created, no payment
- **Confirmed**: At least 30% deposit paid
- **Paid**: Full amount paid
- **Partial**: Some payment received but not full amount

## Webhook Configuration

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** > **Webhooks**
3. Add a new webhook with the following URL:
   ```
   https://yourdomain.com/api/razorpay/webhook
   ```
4. Select the following events:
   - `payment.captured`
   - `payment.failed`
5. Save the webhook secret (already provided: `bEgz_vpPSs9x3th`)

## API Routes

### `/api/razorpay/create-order`
Creates a Razorpay order for a booking deposit.

**Request:**
```json
{
  "bookingId": "booking-uuid",
  "amount": 50000,
  "currency": "INR"
}
```

**Response:**
```json
{
  "orderId": "order_xxx",
  "amount": 5000000,
  "currency": "INR",
  "key": "rzp_live_ReRt29vMOOk9Wj"
}
```

### `/api/razorpay/verify-payment`
Verifies payment signature and updates booking status.

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "bookingId": "booking-uuid"
}
```

### `/api/razorpay/webhook`
Handles Razorpay webhook events (payment.captured, payment.failed).

## Payment Pages

### `/payment/success`
Shown after successful payment with booking confirmation.

### `/payment/failure`
Shown if payment fails or verification fails.

## Testing

### Test Mode
For testing, you can use Razorpay test keys:
- Test Key ID: `rzp_test_...`
- Test Key Secret: `rzp_test_...`

### Test Cards
Use these test card numbers:
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

## Security Notes

1. **Never expose** `RAZORPAY_KEY_SECRET` or `RAZORPAY_WEBHOOK_SECRET` in client-side code
2. Always verify payment signatures on the server
3. Use webhooks as a backup verification method
4. Store payment records for audit purposes

## Troubleshooting

### Payment not processing
- Check that Razorpay script is loading correctly
- Verify environment variables are set
- Check browser console for errors

### Webhook not receiving events
- Verify webhook URL is publicly accessible
- Check webhook secret matches
- Ensure webhook events are enabled in Razorpay dashboard

### Payment verification failing
- Check that signature verification is working
- Verify booking belongs to the authenticated user
- Check server logs for detailed error messages

