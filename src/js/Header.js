import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import logoImage from '../images/logo 2.jpg';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-600 to-blue-800'} p-4 shadow-lg`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link to="/home" className={`text${isDarkMode ? '3xl' : '2xl'} font-semibold mb-4 md:mb-0 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-white'}`}>
          <img src={logoImage} alt="Progresso Logo" className="w-10 h-10 rounded-full object-cover" />
          Progresso
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8 w-full md:w-auto items-start md:items-center`}>
          <button 
            onClick={toggleDarkMode}
            className={`text-2xl ${isDarkMode ? 'text-yellow-300' : 'text-white hover:text-yellow-300'} transition`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <Link to="/home" className="text-white hover:text-yellow-300 transition duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>

          <Link to="/home/assignments" className="text-white hover:text-yellow-300 transition duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            Assignments
          </Link>

          <Link to="/home/profile" className="text-white hover:text-yellow-300 transition duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>

          {isAuthenticated && user ? (
            <>
              <span className="text-yellow-300 flex items-center gap-2">
                <span>👤</span>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-300 transition duration-300 flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-yellow-300 transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
