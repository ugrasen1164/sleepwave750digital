/*
  # Fix RLS Performance and Security Issues

  1. Performance Improvements
    - Replace auth function calls with subqueries in RLS policies to prevent re-evaluation per row
    - This significantly improves query performance at scale

  2. Security Improvements
    - Fix function search_path to be immutable for check_order_rate_limit
    - Add SET search_path to prevent search_path injection attacks

  3. Changes
    - Drop and recreate all policies that depend on check_order_rate_limit
    - Recreate check_order_rate_limit function with proper security settings
    - Optimize "Authenticated users can read own orders" policy with subquery
*/

-- Drop policies that depend on the function
DROP POLICY IF EXISTS "Allow order creation with rate limit" ON orders;
DROP POLICY IF EXISTS "Authenticated users can read own orders" ON orders;

-- Drop and recreate the function with immutable search_path
DROP FUNCTION IF EXISTS check_order_rate_limit(text);

CREATE OR REPLACE FUNCTION check_order_rate_limit(email_input text)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM orders 
    WHERE customer_email = email_input 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) < 10;
END;
$$;

-- Recreate the insert policy
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

-- Recreate the select policy with optimized auth check using subquery
CREATE POLICY "Authenticated users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_email = (
      SELECT (current_setting('request.jwt.claims', true)::json->>'email')
    )
  );
