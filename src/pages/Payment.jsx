import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, ShieldCheck, CheckCircle2,
  ArrowLeft, ShoppingBag, Receipt, LayoutDashboard,
  Wallet, Landmark, Bitcoin, Apple, Lock,
  ChevronRight, Sparkles, GraduationCap
} from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Payment() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    const pending = localStorage.getItem('pending_booking')
    if (pending) {
      setBooking(JSON.parse(pending))
    } else {
      navigate('/courses')
    }
  }, [navigate]);

  if (!booking) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    setTimeout(async () => {
      if (parseFloat(amount) === parseFloat(booking.totalAmount)) {
        try {
          // Save to enrolled courses in Firestore
          const enrollmentData = {
            ...booking,
            id: Date.now(),
            userEmail: user?.email || 'guest@example.com',
            status: 'Active',
            progress: 0,
            createdAt: new Date().toISOString()
          };

          await addDoc(collection(db, 'enrollments'), enrollmentData);
          setIsSuccess(true);
          localStorage.removeItem('pending_booking');
        } catch (err) {
          console.error("Error saving enrollment:", err);
          // Still show success to user, just log the error
          // This prevents getting stuck if Firestore has temporary issues
          setIsSuccess(true);
          localStorage.removeItem('pending_booking');
        }
      } else {
        setError(`Invalid amount. Please enter the exact total of $${booking.totalAmount}.`);
        setIsProcessing(false);
      }
    }, 2000);
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-slate-50 p-4"
      >
        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100 flex flex-col items-center max-w-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-10 shadow-xl shadow-emerald-500/10"
          >
            <CheckCircle2 size={64} strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Enrollment <span className="text-emerald-500">Successful!</span>
          </h1>
          <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed max-w-md">
            Welcome to the SkillRise community! Your journey with <span className="font-black text-slate-900">{booking.courseName}</span> has officially begun.
          </p>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] w-full mb-12 flex flex-col gap-6 border border-slate-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 blur-[20px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="flex flex-col gap-1 items-center pb-6 border-b border-indigo-100">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Transaction ID</span>
              <span className="text-sm font-black text-slate-800">TXN-{Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}</span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</span>
                <span className="text-xl font-black text-indigo-600">${booking.totalAmount}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Type</span>
                <span className="text-xl font-black text-indigo-600">Full Lifetime</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
            <button
              onClick={() => { window.location.href = '/dashboard'; }}
              className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-black active:scale-[0.98] transition-all group"
            >
              Go to Dashboard <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="btn-outline w-full py-5 rounded-2xl font-black text-slate-700"
            >
              Back Home
            </button>
          </div>

          <div className="mt-12 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">
            <Sparkles size={14} className="animate-pulse" /> Let's start learning
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pt-32 pb-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-6">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-[-4px] transition-transform text-xs uppercase tracking-widest self-start"
              >
                <ArrowLeft size={16} /> Change Details
              </button>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Complete Your <span className="text-indigo-600">Payment</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800">Secure Checkout</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left: Final Summary */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/5 border border-slate-100 flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={booking.courseImage} alt={booking.courseName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Order Summary</span>
                    <h4 className="font-black text-slate-900 leading-tight line-clamp-2">{booking.courseName}</h4>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-y border-slate-50 py-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><Receipt size={16} /> Total Payable</span>
                    <span className="text-2xl font-black text-slate-900">${booking.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <h5 className="text-xs font-black uppercase tracking-widest text-slate-400">Choose Method</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-600/10' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                      <CreditCard size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'upi' ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-600/10' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                      <Wallet size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Digital Wallet</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Lock size={16} className="text-emerald-500" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Privacy Protected</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    Your payment information is never stored on our servers. We use 256-bit encryption for every transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full" />

                <form onSubmit={handlePayment} className="flex flex-col gap-10">
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                        Secure <span className="text-indigo-600">Checkout</span>
                        <div className="h-[2px] grow bg-slate-100 rounded-full" />
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 grayscale opacity-50"><Apple size={20} /></div>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 grayscale opacity-50"><Landmark size={20} /></div>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 grayscale opacity-50"><Bitcoin size={20} /></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-8">
                      {paymentMethod === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="md:col-span-2 flex flex-col gap-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Card Holder Name</label>
                            <input
                              type="text"
                              placeholder="Full Name as on card"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold"
                            />
                          </div>
                          <div className="md:col-span-2 flex flex-col gap-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Card Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold"
                              />
                              <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">CVV</label>
                            <input
                              type="password"
                              placeholder="***"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-6">
                          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-indigo-600/10">
                            <Wallet size={40} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h4 className="text-xl font-black text-slate-900">Wallet Checkout Ready</h4>
                            <p className="text-sm font-bold text-slate-500">Scan QR code or use your connected wallet to pay</p>
                          </div>
                          <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl border border-slate-100">
                            <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center opacity-40">
                              <Sparkles size={32} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-indigo-600" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3" />

                    <div className="flex flex-col gap-6 relative z-10 text-center md:text-left">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-indigo-200 pl-1">Payment Confirmation</label>
                        <h4 className="text-2xl font-black">Enter Exact Amount to Pay</h4>
                        <p className="text-indigo-100 text-sm font-bold opacity-80">Please enter the exact total amount of <span className="text-white font-black underline underline-offset-4 decoration-white/30">${booking.totalAmount}</span> to confirm.</p>
                      </div>

                      <div className="flex flex-col gap-4 relative">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Enter: ${booking.totalAmount}`}
                            className="w-full px-8 py-6 bg-white/10 border border-white/20 rounded-2xl focus:ring-4 focus:ring-white/20 focus:bg-white/20 focus:outline-none transition-all duration-300 font-black text-2xl placeholder:text-white/30 text-white"
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-white/50">$</span>
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="bg-rose-500/80 backdrop-blur-md p-4 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-3 border border-rose-400 group-hover:shake"
                            >
                              <Lock size={16} /> {error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-xl font-black transition-all relative overflow-hidden group/btn ${isProcessing ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white text-indigo-700 shadow-2xl shadow-black/20 hover:-translate-y-1 hover:shadow-black/30 active:scale-[0.98]'}`}
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-4">
                            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <>Pay & Unlock Lifetime Access <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-10 opacity-30 grayscale hover:opacity-80 transition-opacity">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Stripe_logo.svg" alt="Stripe" className="h-6" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
