import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../data/coursesData'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, CreditCard, ShoppingBag,
  CheckCircle2, Users, Receipt, Calendar,
  ChevronRight, BadgeInfo, ShieldCheck
} from 'lucide-react'

export default function Enrollment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const course = courses.find(c => c.id === parseInt(id))

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    seats: 1
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!course) return <div className="pt-32 p-8 text-center text-slate-500 font-bold min-h-screen">Course not found</div>

  const totalPrice = (course.price * formData.seats).toFixed(2);
  const tax = (totalPrice * 0.05).toFixed(2);
  const finalTotal = (parseFloat(totalPrice) + parseFloat(tax)).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pre-save booking info to session/local storage for payment page
    const booking = {
      courseId: course.id,
      courseName: course.name,
      courseImage: course.image,
      seats: formData.seats,
      totalAmount: finalTotal,
      userName: formData.name,
      userPhone: formData.phone,
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem('pending_booking', JSON.stringify(booking));
    navigate('/payment');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 min-h-screen pt-32 pb-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-indigo-600 font-bold mb-12 hover:translate-x-[-4px] transition-transform text-xs uppercase tracking-widest bg-white pr-6 py-2 rounded-full border border-slate-100 shadow-sm"
          >
            <div className="bg-indigo-50 p-2 rounded-full"><ArrowLeft size={16} /></div>
            Back to course
          </button>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Checkout & <span className="text-indigo-600">Secure</span> Enrollment
            </h1>
            <div className="h-[2px] grow bg-indigo-100 rounded-full" />
          </div>
          <p className="text-slate-500 mb-12 font-medium">Complete your details to start your journey with {course.name}.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left: Summary */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/5 border border-slate-100 sticky top-24">
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-indigo-900/10" />
                </div>

                <div className="p-8 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full self-start">
                      Selected Course
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {course.name}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4 border-y border-slate-50 py-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold flex items-center gap-2"><CreditCard size={16} /> Price per seat</span>
                      <span className="text-slate-900 font-black">${course.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold flex items-center gap-2"><Users size={16} /> Quantity</span>
                      <span className="text-slate-900 font-black">× {formData.seats}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold flex items-center gap-2"><Receipt size={16} /> Subtotal</span>
                      <span className="text-slate-900 font-black">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold flex items-center gap-2"><BadgeInfo size={16} /> Service tax (5%)</span>
                      <span className="text-slate-900 font-black">${tax}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total amount</span>
                      <span className="text-3xl font-black text-indigo-600">${finalTotal}</span>
                    </div>
                    <ShoppingBag size={40} className="text-slate-100" />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                      Your courses are backed by a 30-day money-back guarantee. Secure payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                  <div className="flex flex-col gap-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                      Personal <span className="text-indigo-600">Information</span>
                      <div className="h-[2px] grow bg-slate-100 rounded-full" />
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3 group">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: John Doe"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold text-slate-700"
                        />
                      </div>
                      <div className="flex flex-col gap-3 group">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Ex: +1 (234) 567 890"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all duration-300 font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                      Enrollment <span className="text-indigo-600">Seat(s)</span>
                      <div className="h-[2px] grow bg-slate-100 rounded-full" />
                    </h3>

                    <div className="flex items-center gap-6">
                      <label className="text-sm font-bold text-slate-500">Buying for multiple people?</label>
                      <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, seats: Math.max(1, formData.seats - 1) })}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-indigo-600 font-black transition-all"
                        > - </button>
                        <span className="w-12 text-center font-black text-lg text-slate-900">{formData.seats}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, seats: Math.min(10, formData.seats + 1) })}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-indigo-600 font-black transition-all"
                        > + </button>
                      </div>
                      <span className="text-xs font-bold text-indigo-400">(Max 10 seats)</span>
                    </div>
                  </div>

                  <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-50">
                    <div className="flex items-start gap-4 max-w-sm">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <ShieldCheck size={20} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        By clicking the button below, you agree to our terms of service and standard course policies.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="btn-primary w-full md:w-auto px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
                    >
                      Confirm Enrollment <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Secure checkout assurance */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full" />
                <div className="flex flex-col gap-2 relative z-10 text-center md:text-left">
                  <h4 className="text-xl font-black">Why learn with SkillRise?</h4>
                  <p className="text-slate-400 text-sm font-medium">Join 5M+ students already learning on our platform.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:ml-auto">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Calendar size={18} /></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Lifetime Access</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><CheckCircle2 size={18} /></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Certified Courses</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Users size={18} /></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Expert Tutors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
