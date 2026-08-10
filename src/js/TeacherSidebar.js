import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/TeacherSidebar.css';

const TeacherSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar open">
      <h2>PROGRESSO</h2>
      <nav className="sidebar-nav">
        <div className="sidebar-group">
          <NavLink to="/teacher-dashboard" className="sidebar-link">
            DASHBOARD
          </NavLink>
          <div className="sidebar-submenu">
            <NavLink to="/teacher-profile" className="sidebar-submenu-link">
              Profile
            </NavLink>
            <NavLink to="/teacher-attendance" className="sidebar-submenu-link">
              Attendance
            </NavLink>
            <NavLink to="/teacher-assignments" className="sidebar-submenu-link">
              Assignments
            </NavLink>
            <NavLink to="/teacher-students" className="sidebar-submenu-link">
              Mentee
            </NavLink>
            <NavLink to="/teacher-marks" className="sidebar-submenu-link">
              Marks
            </NavLink>
            <NavLink to="/teacher-reports" className="sidebar-submenu-link">
              Student's Report
            </NavLink>
            <NavLink to="/teacher-notes" className="sidebar-submenu-link">
              Study Notes
            </NavLink>
            <NavLink to="/teacher-notices" className="sidebar-submenu-link">
              Notice & Announcement
            </NavLink>
          </div>
        </div>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TeacherSidebar;

