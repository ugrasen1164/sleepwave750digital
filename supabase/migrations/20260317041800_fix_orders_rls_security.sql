/*
  # Fix Orders RLS Security

  1. Changes
    - Drop existing insecure policies on orders table
    - Add rate limiting using PostgreSQL functions
    - Add secure policy with email validation
    - Add policy to prevent abuse (max 10 orders per email per hour)

  2. Security Improvements
    - Validate email format before allowing insert
    - Rate limit orders to prevent spam
    - Only allow reading orders with matching email
    - Proper WITH CHECK clauses
*/

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can read their own orders by email" ON orders;

-- Create a function to check rate limiting (max 10 orders per email per hour)
CREATE OR REPLACE FUNCTION check_order_rate_limit(email_input text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM orders 
    WHERE customer_email = email_input 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) < 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure policy for inserting orders with rate limiting and email validation
CREATE POLICY "Allow order creation with rate limit"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (
    customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND check_order_rate_limit(customer_email)
    AND quantity > 0 
    AND quantity <= 100
    AND total_amount > 0
  );

-- Secure policy for reading orders - users can only see their own orders
CREATE POLICY "Users can read own orders by email"
  ON orders
  FOR SELECT
  TO anon
  USING (false);

-- For authenticated users in future (if you add auth)
CREATE POLICY "Authenticated users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');
