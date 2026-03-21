import { useState } from 'react';
import { X, ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRazorpay } from '../hooks/useRazorpay';
import { usePayPal } from '../hooks/usePayPal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'razorpay' | 'paypal';

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const razorpayLoaded = useRazorpay();
  const paypalLoaded = usePayPal();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const priceInUSD = 49.99; // $49.99 USD
  const usdToInrRate = 83; // Approximate conversion rate
  const priceInINR = Math.round(priceInUSD * usdToInrRate); // ₹4149
  const totalUSD = (quantity * priceInUSD).toFixed(2);
  const totalINR = quantity * priceInINR;
  const totalAmountRazorpay = totalINR * 100; // Razorpay needs amount in paise (1 INR = 100 paise)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSuccess = async (paymentId: string, orderIdFromDb: string, method: string) => {
    try {
      const updateData: any = {
        payment_status: 'completed',
        payment_method: method,
      };

      if (method === 'razorpay') {
        updateData.razorpay_payment_id = paymentId;
      } else if (method === 'paypal') {
        updateData.paypal_order_id = paymentId;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderIdFromDb);

      if (error) throw error;

      setPaymentSuccess(true);
      setOrderId(orderIdFromDb);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Payment successful but failed to update order. Please contact support with your payment ID: ' + paymentId);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          quantity: quantity,
          total_amount: paymentMethod === 'razorpay' ? totalINR : parseFloat(totalUSD),
          payment_status: 'pending',
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (error) throw error;

      if (paymentMethod === 'razorpay') {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        if (!razorpayKey || !razorpayLoaded) {
          alert(
            'Razorpay not configured!\n\n' +
            'To enable Razorpay:\n' +
            '1. Sign up at https://razorpay.com\n' +
            '2. Get your API Key ID from Dashboard\n' +
            '3. Add VITE_RAZORPAY_KEY_ID to your .env file\n\n' +
            `Your order (${order.id}) has been saved with pending status.`
          );
          setLoading(false);
          return;
        }

        const options = {
          key: razorpayKey,
          amount: totalAmountRazorpay,
          currency: 'INR',
          name: 'SleepWave™',
          description: `SleepWave Pillow Speaker (${quantity}x)`,
          image: '/1.webp',
          handler: async function (response: any) {
            await handlePaymentSuccess(response.razorpay_payment_id, order.id, 'razorpay');
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: formData.address,
            order_id: order.id,
          },
          theme: {
            color: '#2563eb',
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else if (paymentMethod === 'paypal') {
        const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

        if (!paypalClientId || !paypalLoaded) {
          alert(
            'PayPal not configured!\n\n' +
            'To enable PayPal:\n' +
            '1. Sign up at https://developer.paypal.com\n' +
            '2. Get your Client ID from Dashboard\n' +
            '3. Add VITE_PAYPAL_CLIENT_ID to your .env file\n\n' +
            `Your order (${order.id}) has been saved with pending status.`
          );
          setLoading(false);
          return;
        }

        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `SleepWave Pillow Speaker (${quantity}x)`,
                amount: {
                  value: totalUSD,
                  currency_code: 'USD'
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture();
            await handlePaymentSuccess(details.id, order.id, 'paypal');
            setLoading(false);
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            alert('PayPal payment failed. Please try again.');
            setLoading(false);
          },
          onCancel: () => {
            setLoading(false);
          }
        }).render('#paypal-button-container');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setQuantity(1);
    setPaymentSuccess(false);
    setOrderId('');
    setLoading(false);
    setPaymentMethod('razorpay');
    onClose();
  };

  if (!isOpen) return null;

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your order. Your SleepWave™ Pillow Speaker will be shipped within 24 hours.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="font-mono text-sm font-bold text-gray-900">{orderId}</p>
              </div>
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to {formData.email}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>

        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Checkout</h2>
              </div>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="p-8">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">SleepWave™ Pillow Speaker</span>
                    <span className="font-semibold text-gray-900">${priceInUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-gray-600">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="px-4 py-2 border-2 border-blue-200 rounded-lg font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${totalUSD}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-900 mb-1">Razorpay</div>
                  <div className="text-xs text-gray-500">UPI, Cards, Net Banking</div>
                  <div className="text-sm font-semibold text-blue-600 mt-2">₹{totalINR.toLocaleString('en-IN')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-900 mb-1">PayPal</div>
                  <div className="text-xs text-gray-500">International payments</div>
                  <div className="text-sm font-semibold text-blue-600 mt-2">${totalUSD}</div>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter complete shipping address with pin code"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {paymentMethod === 'paypal' && loading ? (
                <div>
                  <div id="paypal-button-container"></div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Complete your payment using PayPal
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      Proceed to Payment - {paymentMethod === 'razorpay' ? `₹${totalINR.toLocaleString('en-IN')}` : `$${totalUSD}`}
                    </span>
                  )}
                </button>
              )}

              <p className="text-center text-sm text-gray-500">
                {paymentMethod === 'razorpay'
                  ? 'Secure checkout powered by Razorpay • All payment methods supported'
                  : 'Secure checkout powered by PayPal • Trusted worldwide'
                }
              </p>
              {paymentMethod === 'razorpay' && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Accepts:</span>
                  <span className="text-xs text-gray-500 font-semibold">UPI • Cards • Net Banking • Wallets</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
