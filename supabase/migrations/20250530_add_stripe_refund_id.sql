
-- Add stripe_refund_id column to bookings table to track refunds
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS stripe_refund_id TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_refund_id 
ON public.bookings(stripe_refund_id);

-- Add comment to document the column
COMMENT ON COLUMN public.bookings.stripe_refund_id IS 'Stripe refund ID when booking is cancelled and refunded';
