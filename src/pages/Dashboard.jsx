import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, ShieldCheck, CheckCircle2,
  ArrowLeft, ShoppingBag, Receipt, LayoutDashboard,
  Wallet, Landmark, Bitcoin, Apple, Lock,
  ChevronRight, Sparkles, GraduationCap,
  Play, Clock, Star, Users, User, LogOut,
  TrendingUp, Search, Bell, History, Settings,
  Award, BookOpen, MessageSquare, ChevronDown, PlusCircle
} from 'lucide-react'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [activeTab, setActiveTab] = useState('courses')
  const [isInjecting, setIsInjecting] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Instructor', text: 'Welcome to the course! Let me know if you have questions.', time: '2h ago', unread: true },
    { id: 2, sender: 'Support', text: 'Your transaction was successful. Happy learning!', time: '1d ago', unread: false },
  ])

  const fetchData = async () => {
    try {
      const userEmail = user?.email;
      if (!userEmail) return;

      // Fetch Enrollments
      const eq = query(collection(db, 'enrollments'), where('userEmail', '==', userEmail));
      const eSnap = await getDocs(eq);
      const enrolled = [];
      eSnap.forEach((doc) => enrolled.push({ firestoreId: doc.id, ...doc.data() }));
      setEnrolledCourses(enrolled.sort((a, b) => b.id - a.id));

      // Fetch Wishlist
      const wq = query(collection(db, 'wishlist'), where('userEmail', '==', userEmail));
      const wSnap = await getDocs(wq);
      const wish = [];
      wSnap.forEach((doc) => wish.push({ firestoreId: doc.id, ...doc.data() }));
      setWishlist(wish);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user?.email, navigate]);

  const injectSampleCourse = async () => {
    if (!user?.email) return;
    setIsInjecting(true);
    try {
      await addDoc(collection(db, 'enrollments'), {
        id: 1,
        name: "Full-Stack Web Development Mastery",
        instructor: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
        category: "Web Development",
        userEmail: user.email,
        enrolledAt: serverTimestamp(),
        progress: 0
      });
      await fetchData(); // Refresh data
      alert("Sample course added successfully!");
    } catch (err) {
      console.error("Injection Error:", err);
      alert("Failed to add sample course. Make sure Firestore is enabled!");
    } finally {
      setIsInjecting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pt-32 pb-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-12 max-w-7xl mx-auto">

          {/* Dashboard Header */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-tr from-indigo-600 to-violet-700 rounded-full flex items-center justify-center p-1 text-white shadow-xl shadow-indigo-600/30">
                <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-4xl md:text-5xl font-black border-4 border-white/20">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-2 grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  Welcome back, <span className="text-indigo-600">{user.name?.split(' ')[0]}</span>
                </h1>
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">Student Pro</span>
              </div>
              <p className="text-slate-500 font-medium">Continue your learning journey and achieve your goals today.</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-12 mt-4 pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-800 leading-none">{enrolledCourses.length}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-1">Enrolled Courses</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-800 leading-none">{wishlist.length}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-1">Wishlist Items</span>
                </div>
                <button
                  onClick={injectSampleCourse}
                  disabled={isInjecting}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isInjecting ? "Adding..." : <><PlusCircle size={18} /> Add Sample Course</>}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-outline flex items-center gap-3 px-8 py-4 rounded-3xl border-slate-200 text-slate-600 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'courses', icon: BookOpen, label: 'My Courses', count: enrolledCourses.length },
                    { id: 'wishlist', icon: Star, label: 'Wishlist', count: wishlist.length },
                    { id: 'messages', icon: MessageSquare, label: 'Messages', count: messages.filter(m => m.unread).length },
                    { id: 'certificates', icon: Award, label: 'Certificates', count: 0 },
                    { id: 'payment', icon: CreditCard, label: 'Transactions', count: null },
                    { id: 'settings', icon: Settings, label: 'Settings', count: null },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <div className="relative z-10 flex flex-col gap-4">
                  <TrendingUp size={32} className="text-indigo-200" />
                  <h4 className="text-xl font-black">Upgrade to PRO</h4>
                  <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80">Get unlimited access to 12,000+ courses and certifications.</p>
                  <button className="bg-white text-indigo-600 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 hover:bg-indigo-50 transition-all">
                    Upgrade Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 flex flex-col gap-8">
              <AnimatePresence mode="wait">
                {activeTab === 'courses' && (
                  <motion.div
                    key="courses"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-2xl font-black text-slate-900">Enrolled <span className="text-indigo-600">Courses</span></h2>
                      <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input
                            type="text"
                            placeholder="Search your courses..."
                            className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:outline-none w-64"
                          />
                        </div>
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-500 relative">
                          <Bell size={20} />
                          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                      </div>
                    </div>

                    {enrolledCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {enrolledCourses.map((course) => (
                          <motion.div
                            key={course.firestoreId}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 group flex flex-col"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent flex items-end p-6">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                  {course.category}
                                </span>
                              </div>
                              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl">
                                <Play fill="currentColor" size={24} />
                              </button>
                            </div>
                            <div className="p-8 flex flex-col gap-6">
                              <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.name}</h3>
                                <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                  <User size={14} className="text-indigo-400" /> {course.instructor}
                                </p>
                              </div>

                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                                  <span className="text-slate-400">Progress</span>
                                  <span className="text-indigo-600">{course.progress || 0}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress || 0}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-linear-to-r from-indigo-500 to-violet-600 rounded-full"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-4 text-slate-400">
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    <span className="text-xs font-bold font-mono">12/45</span>
                                  </div>
                                </div>
                                <Link
                                  to={`/learn/${course.id}`}
                                  className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group/btn"
                                >
                                  Continue <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-100 flex flex-col items-center text-center gap-8">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <ShoppingBag size={48} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-2xl font-black text-slate-900">No active courses yet</h3>
                          <p className="text-slate-400 font-medium max-w-sm">Explore our marketplace to find the perfect skill for your next career move.</p>
                        </div>
                        <Link to="/courses" className="btn-primary px-10 py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                          Browse Courses
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <h2 className="text-2xl font-black text-slate-900">My <span className="text-indigo-600">Wishlist</span></h2>
                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Wishlist items mapping would go here */}
                      </div>
                    ) : (
                      <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-100 flex flex-col items-center text-center gap-8">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Star size={48} />
                        </div>
                        <div className="flex flex-col gap-2 text-slate-400 font-medium">
                          <h3 className="text-2xl font-black text-slate-900">Wishlist empty</h3>
                          <p>Add some courses you love to track them easily.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'messages' && (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <h2 className="text-2xl font-black text-slate-900">Recent <span className="text-indigo-600">Messages</span></h2>
                      <button className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700">Mark all read</button>
                    </div>
                    <div className="flex flex-col gap-6">
                      {messages.map(msg => (
                        <div key={msg.id} className={`p-6 rounded-3xl border flex items-start gap-6 transition-all cursor-pointer ${msg.unread ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50/30 border-slate-50 opacity-70 hover:opacity-100'
                          }`}>
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-slate-100">
                            <User size={24} className="text-indigo-400" />
                          </div>
                          <div className="flex flex-col gap-1 grow">
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-bold text-slate-900">{msg.sender}</span>
                              <span className="text-[10px] font-black font-mono text-slate-400 uppercase">{msg.time}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">{msg.text}</p>
                          </div>
                          {msg.unread && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
