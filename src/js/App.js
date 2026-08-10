import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import '../styles/App.css';

// Components
import Header from './Header';
import Footer from './Footer';

// Student Pages
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import AboutPage from './AboutPage';
import AssignmentsPage from './AssignmentsPage';
import ProfilePage from './ProfilePage';
import JobRecommenderPage from './JobRecommenderPage';

// Teacher Pages
import TeacherDashboard from './TeacherDashboard';
import TeacherProfile from './TeacherProfile';
import TeacherAttendance from './TeacherAttendance';
import TeacherAssignments from './TeacherAssignments';
import TeacherMarks from './TeacherMarks';
import TeacherReports from './TeacherReports';
import TeacherStudentManagement from './TeacherStudentManagement';
import TeacherNotices from './TeacherNotices';
import TeacherNotes from './TeacherNotes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Login Route as Entry Point - No Header/Footer */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Redirect root to login initially */}
              <Route path="/" element={<LoginPage />} />

              {/* Student Routes */}
              <Route
                path="/home/*"
                element={
                  <>
                    <Header />
                    <main className="min-h-screen">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/assignments" element={<AssignmentsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/jobs" element={<JobRecommenderPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Teacher Routes */}
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher-profile" element={<TeacherProfile />} />
              <Route path="/teacher-attendance" element={<TeacherAttendance />} />
              <Route path="/teacher-assignments" element={<TeacherAssignments />} />
              <Route path="/teacher-marks" element={<TeacherMarks />} />
              <Route path="/teacher-reports" element={<TeacherReports />} />
              <Route path="/teacher-students" element={<TeacherStudentManagement />} />
              <Route path="/teacher-notices" element={<TeacherNotices />} />
              <Route path="/teacher-notes" element={<TeacherNotes />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

