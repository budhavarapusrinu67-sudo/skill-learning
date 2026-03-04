import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, LogIn, LogOut, User, Menu, X, Search, BookOpen } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200 py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
            SkillRise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Courses</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About Us</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm w-48 focus:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-300 border border-transparent focus:border-indigo-500/30"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/instructor" className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full transition-colors">
                <span>Instructor Hub</span>
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline flex items-center gap-2 text-sm py-2 px-4 rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5 rounded-lg active:scale-95 transition-transform">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                <BookOpen size={18} /> Home
              </Link>
              <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                <GraduationCap size={18} /> Courses
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                <BookOpen size={18} /> About Us
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                <BookOpen size={18} /> Pricing
              </Link>
              <div className="border-t border-slate-100 my-2 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/instructor" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 font-bold rounded-lg flex items-center gap-3">
                      <BookOpen size={18} /> Instructor Hub
                    </Link>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                      <User size={18} /> Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 text-left w-full"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-indigo-600 font-medium rounded-lg flex items-center gap-3">
                      <LogIn size={18} /> Login
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary px-4 py-3 rounded-xl text-center">
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
