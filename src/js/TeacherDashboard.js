import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherDashboard.css';
import backgroundImage from '../images/background.jpg';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [date, setDate] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavClick = (index, to) => {
    if (isNavigating) return;
    setActiveIndex(index);
    setIsNavigating(true);
    setTimeout(() => navigate(to), 700);
  };

  useEffect(() => {
    const today = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setDate(today.toLocaleDateString('en-IN', options));
  }, []);

  const navItems = [
    { to: '/teacher-profile', label: 'Profile' },
    { to: '/teacher-attendance', label: 'Attendance' },
    { to: '/teacher-assignments', label: 'Assignments' },
    { to: '/teacher-students', label: 'Mentee' },
    { to: '/teacher-marks', label: 'Marks' },
    { to: '/teacher-reports', label: 'Reports' },
    { to: '/teacher-notes', label: 'Notes' },
    { to: '/teacher-notices', label: 'Notices' }
  ];

  const dashboardCards = [
    { title: 'Total Classes', value: '6', color: 'card-1' },
    { title: 'Total Students', value: '150', color: 'card-2' },
    { title: 'Today Lectures', value: '3', color: 'card-3' },
    { title: 'Pending Work', value: '2', color: 'card-4' }
  ];

  const notices = [
    'Submit internal marks by Friday',
    'Staff meeting at 2 PM',
    'Assignment evaluation pending'
  ];

  return (
    <div className={`teacher-layout dashboard ${isDarkMode ? 'dark' : ''}`}>
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Dashboard</h2>
          <span className="header-date">{date}</span>
        </div>


        <div className="cards-grid">
          {dashboardCards.map((card, index) => (
            <div key={index} className={`card ${card.color}`}>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="notice-section">
          <h3>Quick Notices</h3>
          <ul>
            {notices.map((notice, index) => (
              <li key={index}>{notice}</li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3>Quick Access</h3>
          <div className="nav-grid">
            {navItems.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`nav-square ${activeIndex === index ? 'active' : ''}`}
                onMouseDown={() => setActiveIndex(index)}
                onClick={() => handleNavClick(index, item.to)}
                disabled={isNavigating}
              >
                <div className="nav-label">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
