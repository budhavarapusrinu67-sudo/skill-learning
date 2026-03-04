import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CoursesListing from './pages/CoursesListing'
import CourseDetails from './pages/CourseDetails'
import Enrollment from './pages/Enrollment'
import Payment from './pages/Payment'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CoursePlayer from './pages/CoursePlayer'
import InstructorDashboard from './pages/InstructorDashboard'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { auth } from './firebase'

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Verification that Firebase handles are present
  if (!auth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-900 text-white text-center">
        <h1 className="text-4xl font-black mb-4">Configuration Error</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Firebase configuration is missing or invalid.
          Please check your .env file and console logs.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesListing />} />
            <Route path="/course/:id" element={<CourseDetails />} />

            {/* Protected Routes */}
            <Route path="/enroll/:id" element={user ? <Enrollment /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
            <Route path="/payment" element={user ? <Payment /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/learn/:id" element={user ? <CoursePlayer /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
            <Route path="/instructor" element={user ? <InstructorDashboard /> : <Navigate to="/login" />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
