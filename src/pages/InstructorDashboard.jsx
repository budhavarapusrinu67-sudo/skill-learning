import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, PlusCircle, DollarSign,
  Users, TrendingUp, MoreVertical, Edit3, Trash2,
  Settings, LogOut, ChevronRight, BarChart3, Star,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react'
import { courses } from '../data/coursesData'
import { useAuth } from '../context/AuthContext'

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [instructorCourses, setInstructorCourses] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    // Mock: just take the first 3 courses as belonging to this instructor
    setInstructorCourses(courses.slice(0, 3))
  }, [user, navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  // Mock stats
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+15%', isPositive: true, icon: DollarSign },
    { label: 'Total Students', value: '1,284', change: '+8%', isPositive: true, icon: Users },
    { label: 'Course Rating', value: '4.8', change: '+0.2', isPositive: true, icon: Star },
    { label: 'Active Courses', value: '3', change: '0', isPositive: true, icon: BookOpen }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 min-h-screen pt-28 pb-24"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Instructor Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-indigo-500/5 border border-slate-100 flex flex-col gap-8 sticky top-32">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 p-1 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-white">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{user.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full inline-block mt-2">
                    Instructor Pro
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'courses', label: 'My Courses', icon: BookOpen },
                  { id: 'add', label: 'Add Course', icon: PlusCircle },
                  { id: 'earnings', label: 'Earnings', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full py-4 px-5 rounded-2xl font-bold text-sm transition-all flex items-center gap-4 ${activeTab === item.id
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                      }`}
                  >
                    <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : ''} />
                    {item.label}
                  </button>
                ))}

                <div className="h-px bg-slate-100 my-4" />

                <button onClick={handleLogout} className="w-full py-4 px-5 rounded-2xl font-bold text-sm transition-all flex items-center gap-4 text-red-500 hover:bg-red-50">
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="grow flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900">Overview</h1>
                      <p className="text-slate-500 font-medium">Welcome back, here's what's happening with your courses today.</p>
                    </div>
                    <button onClick={() => setActiveTab('add')} className="btn-primary py-3 px-6 rounded-xl hidden sm:flex items-center gap-2 text-sm">
                      <PlusCircle size={18} /> New Course
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:border-indigo-200 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-2xl ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <stat.icon size={24} />
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {stat.change}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-slate-800">{stat.value}</h4>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity / Courses */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900">Your Popular Courses</h3>
                      <button onClick={() => setActiveTab('courses')} className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400">Course</th>
                            <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400">Price</th>
                            <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400">Enrollments</th>
                            <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400">Rating</th>
                            <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {instructorCourses.map((course) => (
                            <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                              <td className="py-5">
                                <div className="flex items-center gap-4">
                                  <img src={course.image} alt={course.name} className="w-16 h-12 object-cover rounded-xl" />
                                  <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]">{course.name}</span>
                                </div>
                              </td>
                              <td className="py-5 font-bold text-slate-600">${course.price}</td>
                              <td className="py-5 font-bold text-slate-600">{course.reviews}</td>
                              <td className="py-5">
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                  <Star size={16} fill="currentColor" /> {course.rating}
                                </div>
                              </td>
                              <td className="py-5">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white shadow-sm border border-slate-100 rounded-lg"><Edit3 size={16} /></button>
                                  <button className="p-2 text-slate-400 hover:text-red-600 bg-white shadow-sm border border-slate-100 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'add' && (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col gap-10"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-slate-900">Create New Course</h2>
                    <p className="text-slate-500 font-medium">Fill in the details below to publish a new course to the marketplace.</p>
                  </div>

                  <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Course Title</label>
                      <input type="text" placeholder="e.g. Advanced React Patterns 2024" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                        <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer">
                          <option>Web Development</option>
                          <option>Design</option>
                          <option>Marketing</option>
                          <option>Data Science</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price ($)</label>
                        <input type="number" placeholder="99.99" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Course Thumbnail URL</label>
                      <input type="url" placeholder="https://unsplash.com/..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                      <textarea rows="4" placeholder="Describe what students will learn..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all resize-none"></textarea>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                      <button type="button" onClick={() => setActiveTab('overview')} className="px-8 py-4 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                      <button type="button" className="btn-primary px-10 py-4 rounded-2xl flex items-center gap-2">
                        <CheckCircle2 size={20} /> Publish Course
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab !== 'overview' && activeTab !== 'add' && (
                <motion.div
                  key="wip"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-20 rounded-[3.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-6"
                >
                  <div className="p-6 bg-slate-50 rounded-full text-slate-400">
                    <Clock size={48} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 capitalize mb-2">{activeTab} Management</h2>
                    <p className="text-slate-500 font-medium">This module is currently under development. Check back soon for updates.</p>
                  </div>
                  <button onClick={() => setActiveTab('overview')} className="btn-outline px-6 py-3 rounded-xl mt-4">Return to Overview</button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  )
}
