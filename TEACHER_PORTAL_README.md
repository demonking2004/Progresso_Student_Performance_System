# Progresso - Student Performance System with Teacher Portal

## Overview
Progresso is a comprehensive education management system that now includes both student and teacher portals. Users can login as either a student or teacher and access role-specific features.

## Features

### For Students
- Dashboard with quick stats and notices
- Assignment tracking and submission
- Attendance records
- Performance metrics
- Personal profile management
- Dark mode support

### For Teachers
- **Dashboard**: Overview of total classes, students, and pending work
- **Profile Management**: Edit personal information and change password
- **Attendance Tracking**: View and manage student attendance records
- **Assignment Management**: Upload assignments and track submissions
- **Marks & Assessment**: Enter and manage student marks with automatic grade calculation
- **Reports**: View attendance and performance reports
- **Student Management (Mentee)**: Manage and view mentee information
- **Notices & Announcements**: Post notices and announcements to students

## Getting Started

### Installation
```bash
cd react-sps
npm install
npm start
```

### Demo Credentials
You can test with any email and password combination. Just select the role (Student/Teacher) during login.

## Project Structure

```
react-sps/
├── src/
│   ├── components/
│   │   ├── Header.js (Student Navigation)
│   │   ├── Footer.js
│   │   └── teacher/
│   │       ├── TeacherSidebar.js (Teacher Navigation)
│   │       ├── TeacherLayout.js (Teacher Wrapper)
│   │       └── index.js
│   ├── contexts/
│   │   ├── ThemeContext.js (Dark Mode)
│   │   ├── AuthContext.js (NEW - Authentication & Role Management)
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js (UPDATED - with role selection)
│   │   ├── AboutPage.js
│   │   ├── AssignmentsPage.js
│   │   ├── ProfilePage.js
│   │   └── teacher/
│   │       ├── TeacherDashboard.js
│   │       ├── TeacherProfile.js
│   │       ├── TeacherAttendance.js
│   │       ├── TeacherAssignments.js
│   │       ├── TeacherMarks.js
│   │       ├── TeacherReports.js
│   │       ├── TeacherStudentManagement.js
│   │       ├── TeacherNotices.js
│   │       └── index.js
│   ├── App.js (UPDATED - with teacher routes and role-based routing)
│   └── index.js
```

## Login Flow

1. **Landing Page**: Click "Get Started"
2. **Role Selection**: Choose "Login as Student" or "Login as Teacher"
3. **Login Form**: Enter email and password
4. **Routing**:
   - Students → Home Page
   - Teachers → Teacher Dashboard

## Authentication System

### AuthContext
Manages:
- User information
- User role (student/teacher)
- Authentication status
- Login/Logout functions

### How It Works
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, userRole, isAuthenticated, login, logout } = useAuth();

// Login
login(email, password, 'teacher'); // or 'student'

// Logout
logout();
```

## Teacher Portal Routes

- `/teacher-dashboard` - Dashboard with statistics
- `/teacher-profile` - Profile management
- `/teacher-attendance` - Student attendance tracking
- `/teacher-assignments` - Assignment management
- `/teacher-marks` - Marks and assessment
- `/teacher-reports` - Performance reports
- `/teacher-students` - Student/mentee management
- `/teacher-notices` - Post and manage notices

## Student Portal Routes

- `/` - Home
- `/about` - About page
- `/assignments` - Assignment page
- `/profile` - Student profile
- `/login` - Login page

## Features Implemented

### 1. Role-Based Login
- User can select Student or Teacher role before login
- Different dashboards for different roles
- Automatic redirect based on role

### 2. Teacher Sidebar Navigation
- Fixed sidebar with 8 main sections
- Active route highlighting
- Logout button
- Smooth transitions

### 3. Teacher Dashboard
- Visual statistics cards with gradient backgrounds
- Quick notices section
- Date display
- Responsive grid layout

### 4. Teacher Profile
- Profile display with avatar
- Edit profile information
- Password change functionality

### 5. Attendance Management
- Detailed attendance table
- Color-coded status (Present/Absent)
- Date-based records

### 6. Assignments
- Upload new assignments
- Assignment list with deadlines
- Submission tracking
- Marks and feedback management

### 7. Marks Management
- Enter student marks
- Automatic percentage calculation
- Grade assignment (A+, A, B+, B, C, F)
- Student performance table

### 8. Reports
- Attendance analysis reports
- Performance summaries
- Statistical overviews

### 9. Student Management
- Search functionality for students
- Student list with basic info
- Profile view modal
- SGPA tracking

### 10. Notices System
- Post new notices
- Category selection (Exam, Assignment, Fee, General)
- Color-coded categories
- Date tracking

## Styling

All components use:
- **Tailwind CSS** for responsive styling
- **Dark Mode Support** via ThemeContext
- **Consistent Color Scheme**:
  - Student UI: Blue gradient
  - Teacher UI: Blue/Purple gradients
  - Status Colors: Green (Present), Red (Absent)
  - Grade Colors: Green (A/A+), Blue (B+/B), Yellow (C), Red (F)

## Dark Mode

Toggle dark mode using the theme button in the header. Settings persist across student routes while teachers maintain their own theme preference.

## Future Enhancements

1. Backend API integration
2. Real student/teacher databases
3. File upload functionality
4. Email notifications
5. Advanced reporting and analytics
6. Mobile app
7. Parent portal
8. Real-time updates with WebSockets

## Components Converted from HTML to React

The following teacher portal modules were converted:
- teachers-portal/dashboard.html → TeacherDashboard.js
- teachers-profile/profile.html → TeacherProfile.js
- attendance(T)/attendance.html → TeacherAttendance.js
- assignment(T)/assign.html → TeacherAssignments.js
- assessment(T)/assess.html → TeacherMarks.js
- report(T)/report.html → TeacherReports.js
- student-manage(T)/stuman.html → TeacherStudentManagement.js
- Notice(T)/notice.html → TeacherNotices.js

## File Locations

All new files are located in:
- Auth Context: `src/contexts/AuthContext.js`
- Teacher Components: `src/components/teacher/`
- Teacher Pages: `src/pages/teacher/`
- Updated Files: `src/App.js`, `src/pages/LoginPage.js`, `src/components/Header.js`

## Support

For issues or questions about the teacher portal implementation, check the component documentation inline or refer to the React and Tailwind CSS documentation.

---

**Version**: 2.0 (with Teacher Portal)
**Last Updated**: March 2, 2026
