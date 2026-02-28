import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Activity } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#16213e] border-b border-[#6C63FF]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="text-[#6C63FF]" size={28} />
            <span className="text-xl font-bold text-white">
              Habit<span className="text-[#6C63FF]">Flow</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-[#6C63FF] transition">Dashboard</Link>
                <Link to="/habits" className="text-gray-300 hover:text-[#6C63FF] transition">My Habits</Link>
                <Link to="/progress" className="text-gray-300 hover:text-[#6C63FF] transition">Progress</Link>
                <button onClick={handleLogout}
                  className="bg-[#F72585] text-white px-4 py-2 rounded-lg hover:bg-[#F72585]/80 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-[#6C63FF] transition">Login</Link>
                <Link to="/signup"
                  className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg hover:bg-[#6C63FF]/80 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-gray-300 py-2 hover:text-[#6C63FF]">Dashboard</Link>
                <Link to="/habits" onClick={() => setIsOpen(false)} className="block text-gray-300 py-2 hover:text-[#6C63FF]">My Habits</Link>
                <Link to="/progress" onClick={() => setIsOpen(false)} className="block text-gray-300 py-2 hover:text-[#6C63FF]">Progress</Link>
                <button onClick={handleLogout} className="w-full text-left bg-[#F72585] text-white px-4 py-2 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-gray-300 py-2">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block bg-[#6C63FF] text-white px-4 py-2 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
