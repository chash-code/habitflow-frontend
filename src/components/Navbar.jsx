import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Activity, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, darkMode, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300
      ${darkMode
        ? 'bg-[#16213e] border-[#6C63FF]/30'
        : 'bg-white border-[#6C63FF]/20 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="text-[#6C63FF]" size={28} />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#1a1a2e]'}`}>
              Habit<span className="text-[#6C63FF]">Flow</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className={`hover:text-[#6C63FF] transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard</Link>
                <Link to="/habits" className={`hover:text-[#6C63FF] transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>My Habits</Link>
                <Link to="/progress" className={`hover:text-[#6C63FF] transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Progress</Link>
                <button onClick={handleLogout}
                  className="bg-[#F72585] text-white px-4 py-2 rounded-lg hover:bg-[#F72585]/80 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`hover:text-[#6C63FF] transition ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Login</Link>
                <Link to="/signup"
                  className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg hover:bg-[#6C63FF]/80 transition">
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className={`p-2 rounded-full transition ${darkMode ? 'bg-[#0f0e17] text-yellow-400 hover:bg-[#6C63FF]/20' : 'bg-gray-100 text-[#6C63FF] hover:bg-[#6C63FF]/10'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'bg-[#0f0e17] text-yellow-400' : 'bg-gray-100 text-[#6C63FF]'}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={darkMode ? 'text-white' : 'text-[#1a1a2e]'}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${darkMode ? '' : 'bg-white'}`}>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`block py-2 hover:text-[#6C63FF] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard</Link>
                <Link to="/habits" onClick={() => setIsOpen(false)} className={`block py-2 hover:text-[#6C63FF] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>My Habits</Link>
                <Link to="/progress" onClick={() => setIsOpen(false)} className={`block py-2 hover:text-[#6C63FF] ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Progress</Link>
                <button onClick={handleLogout} className="w-full text-left bg-[#F72585] text-white px-4 py-2 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className={`block py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Login</Link>
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
