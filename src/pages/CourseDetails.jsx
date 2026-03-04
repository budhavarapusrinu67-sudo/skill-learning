import { useParams, Link } from 'react-router-dom'
import { courses } from '../data/coursesData'
import {
  Star, Clock, Users, Calendar, CheckCircle2,
  ArrowLeft, Share2, Heart, Award, ShieldCheck,
  Infinity, MonitorPlay, FileText, Smartphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

export default function CourseDetails() {
  const { id } = useParams()
  const course = courses.find(c => c.id === parseInt(id))
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isFixed, setIsFixed] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistStatus, setWishlistStatus] = useState(null) // 'added', 'exists', 'error'

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToWishlist = async () => {
    if (!user) {
      alert("Please login to add courses to your wishlist.");
      return;
    }

    setWishlistLoading(true);
    try {
      const wishlistRef = collection(db, 'wishlist');
      const q = query(wishlistRef, where('userEmail', '==', user.email), where('id', '==', course.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setWishlistStatus('exists');
        setTimeout(() => setWishlistStatus(null), 3000);
        return;
      }

      await addDoc(wishlistRef, {
        ...course,
        userEmail: user.email,
        addedAt: Date.now()
      });
      setWishlistStatus('added');
      setTimeout(() => setWishlistStatus(null), 3000);
    } catch (err) {
      console.error("Wishlist Error:", err);
      setWishlistStatus('error');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center pt-32 p-8 text-center flex-col gap-8 bg-slate-50">
      <div className="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center max-w-lg">
        <h1 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Oops! Course Not Found</h1>
        <p className="text-slate-500 mb-10 text-lg">
          The course you're looking for doesn't exist or may have been removed.
        </p>
        <Link to="/courses" className="btn-primary px-10 py-5 rounded-2xl flex items-center gap-3">
          <ArrowLeft size={20} /> Back to Courses
        </Link>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-slate-50 min-h-screen"
    >
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-10 hover:translate-x-[-4px] transition-transform text-sm uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Library
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="flex flex-col gap-6 max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-indigo-600/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start border border-indigo-400/20">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.15] lg:pr-10">
                {course.name}
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed lg:pr-10 font-medium">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-8 py-4 border-y border-white/5 my-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={18} fill="currentColor" />
                    <span className="font-black text-xl">{course.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-500">({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-xl">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor}`}
                      alt={course.instructor}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instructor</span>
                    <span className="text-sm font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer">{course.instructor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-32 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Navigation Tabs */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sticky top-24 z-30 overflow-x-auto no-scrollbar">
              {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 uppercase tracking-widest whitespace-nowrap ${activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[400px]">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                    What You Will <span className="text-indigo-600">Learn</span>
                    <div className="h-[2px] grow bg-slate-100 rounded-full" />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.learnings.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                        <CheckCircle2 size={24} className="text-indigo-600 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                    Course <span className="text-indigo-600">Requirements</span>
                    <div className="h-[2px] grow bg-slate-100 rounded-full" />
                  </h3>
                  <ul className="flex flex-col gap-4 pl-4 font-medium text-slate-600">
                    <li className="list-disc leading-relaxed">No prior experience in the field is necessary.</li>
                    <li className="list-disc leading-relaxed">A computer (Windows or Mac) with access to high-speed internet.</li>
                    <li className="list-disc leading-relaxed">Willingness to learn and commit at least 5 hours per week.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Purchase Sidebar */}
          <aside className="lg:col-span-1">
            <div className={`flex flex-col gap-6 sticky top-24 transition-all duration-300 ${isFixed ? 'scale-[1.02]' : ''}`}>
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                <div className="aspect-video relative group overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center p-8">
                    <button className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-white/60 transition-colors">
                      <MonitorPlay size={32} />
                    </button>
                    <span className="absolute bottom-6 text-white text-[10px] font-black uppercase tracking-widest bg-slate-900/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">Course Preview</span>
                  </div>
                </div>

                <div className="p-10 flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900">${course.price}</span>
                      <span className="text-slate-400 line-through font-bold text-lg">${(course.price * 1.5).toFixed(2)}</span>
                    </div>
                    <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full animate-bounce">
                      Limited Time
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link to={`/enroll/${course.id}`} className="btn-primary w-full py-5 rounded-2xl text-lg font-black shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition-all">
                      Enroll & Start Learning
                    </Link>
                    <button
                      onClick={handleAddToWishlist}
                      disabled={wishlistLoading || wishlistStatus === 'added'}
                      className={`btn-outline w-full py-4.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${wishlistStatus === 'added' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'text-slate-700'
                        }`}
                    >
                      <Heart
                        size={20}
                        className={wishlistStatus === 'added' ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}
                      />
                      {wishlistLoading ? 'Adding...' :
                        wishlistStatus === 'added' ? 'Added to Wishlist' :
                          wishlistStatus === 'exists' ? 'Already in Wishlist' : 'Add to wishlist'}
                    </button>
                  </div>

                  <p className="text-center text-xs font-bold text-slate-400">30-Day Money-Back Guarantee</p>

                  <div className="flex flex-col gap-4">
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">
                      This course includes:
                    </h5>
                    <ul className="flex flex-col gap-4">
                      <li className="flex items-center gap-3 text-sm font-bold text-slate-600 group">
                        <Clock size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> {course.duration} on-demand video
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-slate-600 group">
                        <FileText size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> 24 downloadable resources
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-slate-600 group">
                        <Smartphone size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> Access on mobile and TV
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-slate-600 group">
                        <Infinity size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> Full lifetime access
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-slate-600 group">
                        <Award size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> Certificate of completion
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-4">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors text-xs uppercase tracking-widest">
                      <Share2 size={16} /> Share
                    </button>
                    <div className="w-px h-4 bg-slate-200" />
                    <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors text-xs uppercase tracking-widest">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>

              {/* Secure Transaction badge */}
              <div className="bg-slate-100 p-6 rounded-3xl flex items-center gap-4 text-slate-500">
                <ShieldCheck size={32} className="text-emerald-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800">Secure Checkout</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">SSL Encrypted Transaction</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
