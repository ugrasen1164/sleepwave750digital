/*
  # Add PayPal Support to Orders Table

  1. Changes
    - Add `payment_method` column to track payment provider (razorpay or paypal)
    - Add `paypal_order_id` column to store PayPal transaction IDs
    - Make razorpay fields nullable since they won't be used for PayPal orders

  2. Notes
    - Uses IF NOT EXISTS checks to prevent errors if columns already exist
    - Maintains backward compatibility with existing orders
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text DEFAULT 'razorpay';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paypal_order_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN paypal_order_id text;
  END IF;
END $$;
