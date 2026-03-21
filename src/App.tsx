import { useState, useEffect } from 'react';
import { Check, Star, Volume2, Battery, Bluetooth, Moon, Clock, ShieldCheck, ChevronDown, Mail, Lock, CreditCard, Truck, X, Phone, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import CheckoutModal from './components/CheckoutModal';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });
  const [stockLeft, setStockLeft] = useState(47);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);

  const purchaseNotifications = [
    { name: "Priya S.", location: "Mumbai", time: "2 minutes ago" },
    { name: "Rahul K.", location: "Delhi", time: "5 minutes ago" },
    { name: "Ananya M.", location: "Bangalore", time: "8 minutes ago" },
    { name: "Amit P.", location: "Pune", time: "12 minutes ago" },
    { name: "Neha R.", location: "Hyderabad", time: "15 minutes ago" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowStickyButton(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const purchaseTimer = setInterval(() => {
      setCurrentPurchaseIndex((prev) => (prev + 1) % purchaseNotifications.length);
    }, 8000);
    return () => clearInterval(purchaseTimer);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitModal(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const openCheckout = () => {
    setShowCheckoutModal(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Social Proof Notification */}
      <div className="fixed bottom-6 left-6 z-50 bg-white shadow-2xl rounded-lg p-4 max-w-sm border-2 border-green-200 animate-slide-in">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {purchaseNotifications[currentPurchaseIndex].name} from {purchaseNotifications[currentPurchaseIndex].location}
            </p>
            <p className="text-gray-600 text-xs">Just purchased SleepWave™</p>
            <p className="text-gray-400 text-xs">{purchaseNotifications[currentPurchaseIndex].time}</p>
          </div>
        </div>
      </div>

      {/* Sticky Buy Button */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-blue-200 z-40 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-lg">SleepWave™ Pillow Speaker</p>
              <p className="text-sm text-gray-600">Limited Stock: Only {stockLeft} left!</p>
            </div>
            <button
              onClick={openCheckout}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Order Now - $49.99
            </button>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Moon className={`w-7 h-7 ${isScrolled ? 'text-blue-600' : 'text-white'}`} />
            <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>SleepWave™</span>
          </div>
          <button
            onClick={openCheckout}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Order Now
          </button>
        </div>
      </header>

      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/SleepWave_Restful_Nights_(2).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Sleep Peacefully Without<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Uncomfortable Earbuds</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tired of earbuds that don't stay in or feel uncomfortable? The SleepWave™ delivers crystal-clear audio directly from under your pillow—no pressure, no discomfort, just pure relaxation.
          </p>
          <button
            onClick={openCheckout}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-110 inline-flex items-center space-x-2"
          >
            <span>Try Risk-Free for 30 Nights</span>
            <Check className="w-6 h-6" />
          </button>
          <p className="text-gray-300 mt-4 text-sm">Free shipping • 30-day guarantee • Thousands of happy sleepers</p>
        </div>
      </section>

      {/* Scarcity Timer */}
      <section className="py-8 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 animate-pulse" />
              <div>
                <p className="font-bold text-lg">Flash Sale Ends In:</p>
                <p className="text-sm text-red-100">Don't miss this limited-time offer!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
                <p className="text-xs uppercase">Hours</p>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="text-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
                <p className="text-xs uppercase">Minutes</p>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="text-center bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</p>
                <p className="text-xs uppercase">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Indicator */}
      <section className="py-6 bg-yellow-50 border-b-2 border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span>Only {stockLeft} units left in stock!</span>
            </p>
            <p className="text-sm text-gray-600">Hurry, selling fast!</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(stockLeft / 100) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Over 53 units sold in the last 24 hours</p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Why You Can't Sleep Peacefully</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Millions struggle with poor sleep quality every single night. Sound familiar?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Night Overthinking</h3>
              <p className="text-gray-600">Racing thoughts keep you awake for hours, unable to quiet your mind.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">😣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Frequent Waking</h3>
              <p className="text-gray-600">Waking up multiple times disrupts deep sleep cycles and leaves you exhausted.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">😴</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Morning Tiredness</h3>
              <p className="text-gray-600">No matter how long you sleep, you wake up feeling drained and unrefreshed.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">😰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Low Focus & Stress</h3>
              <p className="text-gray-600">Poor sleep affects concentration, mood, and increases daily stress levels.</p>
            </div>
          </div>

          <div className="text-center bg-red-50 p-8 rounded-2xl border-2 border-red-200">
            <p className="text-xl font-semibold text-gray-900 mb-2">The Old Solution: Uncomfortable Earbuds</p>
            <p className="text-gray-600">Earbuds can press against your ears during sleep, causing discomfort and often fall out—especially problematic for side sleepers.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Introducing SleepWave™</h2>
              <p className="text-xl mb-4 text-blue-50">
                The natural, drug-free solution to better sleep. No pills, no side effects—just pure, restful nights.
              </p>
              <p className="text-lg mb-8 text-blue-100">
                Simply slip it under your pillow and enjoy private, pain-free listening all night long.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">100% Natural & Safe</h4>
                    <p className="text-blue-50">No medications, no chemicals—just soothing audio to calm your mind naturally</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Zero Side Effects</h4>
                    <p className="text-blue-50">Unlike sleeping pills, wake up refreshed without grogginess or dependency</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Ultra-Thin & Pain-Free</h4>
                    <p className="text-blue-50">Completely undetectable under your pillow—no pressure on ears</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Reduce Stress & Anxiety</h4>
                    <p className="text-blue-50">Calming sounds help quiet racing thoughts and melt away daily stress</p>
                  </div>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Yours Now
              </button>
            </div>

            <div className="relative">
              <img
                src="/1.webp"
                alt="SleepWave Pillow Speaker"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Why Choose SleepWave™?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Volume2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Crystal-Clear Audio</h3>
              <p className="text-gray-600">Premium speaker technology delivers rich, immersive sound quality for the ultimate sleep experience.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Bluetooth className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wireless Freedom</h3>
              <p className="text-gray-600">Bluetooth 5.0 connectivity means no tangled cords, just seamless connection to any device.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Battery className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">All-Night Battery</h3>
              <p className="text-gray-600">10+ hours of continuous playback on a single charge. Fall asleep without worry.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Sleep Timer</h3>
              <p className="text-gray-600">Gentle fade-out feature gradually reduces volume, helping you drift into deep sleep.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Moon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perfect for Side Sleepers</h3>
              <p className="text-gray-600">Ultra-slim profile means zero pressure points, even when sleeping on your side.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Partner-Approved</h3>
              <p className="text-gray-600">Directional audio keeps your meditation, music, or podcasts private without disturbing anyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">Perfect For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Sleep Meditation', 'Audiobooks', 'White Noise', 'Calming Music', 'Podcasts', 'ASMR', 'Drown Out Snoring', 'Ambient Sounds'].map((use) => (
              <div key={use} className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100 text-center hover:border-blue-400 transition-colors">
                <Check className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900">{use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Visual */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">The Transformation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold mb-4">BEFORE SleepWave</div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Tossing & Turning</p>
                    <p className="text-gray-600 text-sm">Racing thoughts keep you awake for hours</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Uncomfortable Earbuds</p>
                    <p className="text-gray-600 text-sm">Pressure on ears, constantly falling out</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Morning Exhaustion</p>
                    <p className="text-gray-600 text-sm">Wake up tired, unfocused, irritable</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Partner Disturbance</p>
                    <p className="text-gray-600 text-sm">Can't listen to relaxing sounds without bothering them</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold mb-4">AFTER SleepWave</div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Fall Asleep in 15 Minutes</p>
                    <p className="text-gray-600 text-sm">Calming audio quiets racing thoughts naturally</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Zero Discomfort</p>
                    <p className="text-gray-600 text-sm">Ultra-thin, undetectable under your pillow</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Wake Up Refreshed</p>
                    <p className="text-gray-600 text-sm">Deep sleep leaves you energized and focused</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Private & Partner-Friendly</p>
                    <p className="text-gray-600 text-sm">Directional audio only you can hear</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">What Customers Are Saying</h2>
            <p className="text-xl text-gray-600">Join over 1,000+ happy sleepers transforming their nights</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-800 leading-relaxed mb-6 italic">
                "I used to fall asleep wearing earbuds, but they would always fall out or feel uncomfortable. SleepWave is magic—I slip it under my pillow, play my meditation, and my husband doesn't hear a thing!"
              </p>
              <div>
                <p className="font-bold text-gray-900">Emily R.</p>
                <p className="text-gray-600 text-sm">Verified Buyer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-800 leading-relaxed mb-6 italic">
                "My overthinking used to keep me awake for hours. Now with calming sounds through SleepWave, I fall asleep within 15 minutes. Game changer for my anxiety!"
              </p>
              <div>
                <p className="font-bold text-gray-900">Michael T.</p>
                <p className="text-gray-600 text-sm">Verified Buyer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-800 leading-relaxed mb-6 italic">
                "As a side sleeper, regular earbuds were torture. SleepWave is completely flat—I don't even feel it under my pillow. Best purchase for my sleep routine!"
              </p>
              <div>
                <p className="font-bold text-gray-900">Sarah K.</p>
                <p className="text-gray-600 text-sm">Verified Buyer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-800 leading-relaxed mb-6 italic">
                "My wife snores loudly. I use SleepWave with white noise and sleep like a baby now. The battery lasts all night, every night. Highly recommend!"
              </p>
              <div>
                <p className="font-bold text-gray-900">David L.</p>
                <p className="text-gray-600 text-sm">Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-lg text-gray-800 leading-relaxed mb-6 italic">
              "After just one week, I noticed a huge difference. I wake up feeling refreshed instead of groggy. My focus at work improved dramatically. Worth every penny!"
            </p>
            <div>
              <p className="font-bold text-gray-900">Jessica M.</p>
              <p className="text-gray-600 text-sm">Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Technical Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Connectivity</h4>
              <p className="text-gray-300">Bluetooth 5.0</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Battery Life</h4>
              <p className="text-gray-300">10+ hours continuous playback</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Design</h4>
              <p className="text-gray-300">Ultra-slim profile, fits under any pillow</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Charging</h4>
              <p className="text-gray-300">Rechargeable via USB</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Compatibility</h4>
              <p className="text-gray-300">All Bluetooth devices</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-blue-400">Features</h4>
              <p className="text-gray-300">Auto-off timer with gradual fade</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-16 text-center">Your New Bedtime Ritual</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Place Under Pillow</h3>
              <p className="text-gray-600 text-lg">Simply slide the SleepWave under your pillowcase for invisible comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect via Bluetooth</h3>
              <p className="text-gray-600 text-lg">Pair with your phone, tablet, or any Bluetooth device in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Drift Off to Sleep</h3>
              <p className="text-gray-600 text-lg">Enjoy immersive audio as you fall into deep, restful sleep—pain-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Expert Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Trusted by Experts & Users Worldwide</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl font-bold text-blue-600 mb-2">1,000+</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">Happy Users</p>
              <p className="text-gray-600">Transforming their sleep every night</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl font-bold text-blue-600 mb-2">1 Week</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">See Results</p>
              <p className="text-gray-600">Most users notice better sleep within 7 days</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl font-bold text-blue-600 mb-2">4.9/5</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">Average Rating</p>
              <p className="text-gray-600">Based on verified customer reviews</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sleep Specialist Recommended</h3>
                  <p className="text-gray-700 italic mb-3">"Audio therapy is a proven, non-pharmaceutical approach to improving sleep quality. SleepWave makes this accessible and comfortable for everyone."</p>
                  <p className="font-semibold text-gray-900">Dr. James Peterson</p>
                  <p className="text-sm text-gray-600">Sleep Medicine Specialist</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎵</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Music Therapist Approved</h3>
                  <p className="text-gray-700 italic mb-3">"Sound therapy has incredible benefits for relaxation and stress reduction. SleepWave delivers therapeutic audio in the most comfortable way possible."</p>
                  <p className="font-semibold text-gray-900">Lisa Chen, MT-BC</p>
                  <p className="text-sm text-gray-600">Certified Music Therapist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">30-Night Better Sleep Guarantee</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Try SleepWave risk-free! If you don't experience the best sleep of your life within 30 nights, return it for a full refund. No questions asked.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-700">
            <div className="flex items-center space-x-2">
              <Check className="w-6 h-6 text-green-600" />
              <span className="font-semibold">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-6 h-6 text-green-600" />
              <span className="font-semibold">30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-6 h-6 text-green-600" />
              <span className="font-semibold">1-Year Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">Compare Your Options</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-left text-gray-600 font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="font-bold text-xl text-blue-600">SleepWave™</div>
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-semibold">Earbuds</th>
                  <th className="py-4 px-6 text-center text-gray-600 font-semibold">Sleep Pills</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Comfortable for Side Sleepers</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center text-gray-400">N/A</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">No Side Effects</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Non-Habit Forming</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Private Audio (Partner Friendly)</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center text-gray-400">N/A</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">All Night Battery</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center text-gray-400">N/A</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">No Morning Grogginess</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">One-Time Purchase</td>
                  <td className="py-4 px-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How does SleepWave work?",
                answer: "Simply place the ultra-thin speaker under your pillowcase, connect via Bluetooth to your phone or device, and play your favorite sleep sounds, meditation, audiobooks, or music. The speaker delivers clear audio without any pressure on your ears."
              },
              {
                question: "Will my partner hear the audio?",
                answer: "No! The directional speaker technology focuses sound toward your ears only. Your partner won't be disturbed, making it perfect for couples with different sleep preferences."
              },
              {
                question: "How long does the battery last?",
                answer: "SleepWave provides 10+ hours of continuous playback on a single charge—more than enough for a full night's sleep. It charges via USB and takes about 2 hours to fully charge."
              },
              {
                question: "Is it comfortable for side sleepers?",
                answer: "Absolutely! The ultra-slim design (thinner than a smartphone) means you won't even notice it's there. Unlike earbuds that press into your ears, SleepWave is completely flat under your pillow."
              },
              {
                question: "What if I don't like it?",
                answer: "We offer a 30-night money-back guarantee. If you're not completely satisfied, return it for a full refund—no questions asked. We also include a 1-year warranty for manufacturing defects."
              },
              {
                question: "How do I connect it to my device?",
                answer: "SleepWave uses standard Bluetooth 5.0 connectivity. Simply turn it on, go to your device's Bluetooth settings, and select 'SleepWave' from the list. It works with all smartphones, tablets, and Bluetooth-enabled devices."
              },
              {
                question: "Can I use it with any pillow?",
                answer: "Yes! SleepWave works with any pillow type—memory foam, down, standard, firm, or soft. Just slip it under your pillowcase and you're ready to go."
              },
              {
                question: "How long does shipping take?",
                answer: "We offer free shipping on all orders. Most orders ship within 24 hours and arrive within 5-7 business days. You'll receive tracking information via email once your order ships."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Secure Checkout</p>
              <p className="text-sm text-gray-600">SSL Encrypted</p>
            </div>
            <div className="text-center">
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Free Shipping</p>
              <p className="text-sm text-gray-600">On All Orders</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">30-Day Guarantee</p>
              <p className="text-sm text-gray-600">Risk-Free Trial</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Secure Payments</p>
              <p className="text-sm text-gray-600">Multiple Options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">Compare the True Cost</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-4">Sleep Pills</p>
              <p className="text-gray-600 mb-4">$25/month subscription</p>
              <div className="text-4xl font-bold text-red-600 mb-4">$300/year</div>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Side effects & dependency risk</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Morning grogginess</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Recurring monthly cost</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-4">Sleep Headphones</p>
              <p className="text-gray-600 mb-4">Average quality</p>
              <div className="text-4xl font-bold text-orange-600 mb-4">$60-80</div>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Uncomfortable for side sleepers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Battery dies mid-sleep</span>
                </li>
                <li className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Bulky & noticeable</span>
                </li>
              </ul>
            </div>

            <div className="border-4 border-green-500 rounded-2xl p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">SleepWave™</p>
              <p className="text-gray-600 mb-4">One-time investment</p>
              <div className="text-4xl font-bold text-green-600 mb-4">$49.99</div>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>100% natural & safe</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Perfect for side sleepers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lasts for years</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-lg text-gray-600 mt-8">
            <span className="font-bold text-green-600">Save $250+</span> in the first year compared to sleep pills!
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section id="order" className="py-24 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6">Wake Up Refreshed, Pain-Free & Fully Recharged</h2>
          <p className="text-2xl mb-10 text-blue-50">Join thousands of happy sleepers who've transformed their nights with SleepWave™</p>

          <div className="bg-white text-gray-900 rounded-3xl p-10 shadow-2xl mb-8">
            <div className="mb-6">
              <p className="text-red-600 font-bold text-sm mb-3 bg-red-50 py-2 px-4 rounded-full inline-block">⚡ LIMITED TIME OFFER - ENDS SOON</p>
              <p className="text-gray-500 line-through text-xl mb-2">Regular Price: $79.99 USD</p>
              <p className="text-5xl font-bold text-blue-600 mb-2">$49.99 USD</p>
              <p className="text-green-600 font-semibold text-lg">Save $30 Today Only!</p>
            </div>

            <button
              onClick={openCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-12 py-6 rounded-full text-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4"
            >
              Order Your SleepWave™ Now
            </button>

            <p className="text-sm text-gray-600">Secure checkout • Ships within 24 hours • Free shipping</p>
          </div>

          <p className="text-blue-100 text-sm">30-Night Money-Back Guarantee • Over 10,000+ 5-Star Reviews</p>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Have Questions? We're Here to Help</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <Mail className="w-10 h-10 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Email Support</h3>
              <p className="text-blue-100 mb-3">Get a response within 24 hours</p>
              <a href="mailto:support@sleepwave.com" className="text-white font-semibold hover:underline">support@sleepwave.com</a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <MessageCircle className="w-10 h-10 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Live Chat</h3>
              <p className="text-blue-100 mb-3">Available Mon-Fri, 9am-6pm EST</p>
              <button className="text-white font-semibold hover:underline">Start Chat</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Moon className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">SleepWave™</span>
              </div>
              <p className="text-sm">Better sleep, guaranteed.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 SleepWave. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} />

      {/* Exit Intent Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Wait! Don't Miss Out</h3>
              <p className="text-gray-600 text-lg">Before you go, here's an exclusive offer just for you!</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 mb-6">
              <p className="text-center text-sm text-gray-600 mb-2">Extra Discount Code:</p>
              <div className="bg-white border-2 border-dashed border-green-500 rounded-lg py-3 px-4 mb-4">
                <p className="text-center text-2xl font-bold text-green-600">SAVE10</p>
              </div>
              <p className="text-center text-lg font-bold text-gray-900 mb-2">Get an Extra 10% OFF!</p>
              <p className="text-center text-sm text-gray-600">Use code at checkout - Limited to first 20 customers</p>
            </div>

            <button
              onClick={() => {
                setShowExitModal(false);
                openCheckout();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-3"
            >
              Claim My Discount Now!
            </button>

            <button
              onClick={() => setShowExitModal(false)}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
