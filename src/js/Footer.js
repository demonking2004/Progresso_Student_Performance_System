import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-800 text-white'} py-12 mt-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Progresso</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
              Your companion for academic success and student performance tracking.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
              <li><Link to="/home" className="hover:text-white">Home</Link></li>
              <li><Link to="/home/about" className="hover:text-white">About</Link></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
              Email: info@progresso.edu<br/>
              Phone: 9126575975<br/>
              Location: Education Hub, Tech City
            </p>
          </div>
        </div>

        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-700'} pt-8`}>
          <p className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2025 Progresso. All rights reserved. | Designed by the Progresso Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
