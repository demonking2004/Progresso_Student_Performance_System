# Quick Start Guide - Database Setup

## ⚡ Quick Setup (5 minutes)

### Step 1: Import Database Schema
```bash
# Open terminal and navigate to your mysql
mysql -u root -p

# Create and use database (if not exists)
CREATE DATABASE IF NOT EXISTS student_performance_system;
USE student_performance_system;

# Import schema from file
SOURCE C:/xampp/htdocs/react-sps/connection/schema.sql;
```

Or through phpMyAdmin:
1. Go to `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Select `connection/schema.sql`
4. Click "Go"

### Step 2: Verify Tables Created
```sql
SHOW TABLES;
-- Should show: users, student_profiles, teacher_profiles, assignments, 
-- submissions, attendance, marks, mentee_assignments, student_reports
```

---

## 🎯 Testing the Features

### Test 1: Attendance Management
1. Open app and login as teacher
2. Go to **Attendance Management** tab
3. Select a date, choose a mentee, mark status (Present/Absent/Leave)
4. Click "Record Attendance"
5. ✅ Should appear in the table below

### Test 2: Marks Management
1. Go to **Marks & Assessment** tab
2. Click "Assign Mentee" if you haven't already
3. Select student, subject, exam type, marks
4. Click "Save Marks"
5. ✅ Grade should auto-calculate based on percentage

### Test 3: Mentee Management
1. Go to **Student Management** tab
2. Enter student ID and click "Assign Mentee"
3. Click "View" to see student profile
4. ✅ Should show detailed student information

### Test 4: Reports
1. Go to **Reports** tab
2. View attendance report (shows present/absent/% for all mentees)
3. View marks report (shows all marks with grades)
4. Click "Create/Update Student Report" to create custom reports
5. ✅ All data should display correctly

---

## 🔧 API Endpoints Reference

### Attendance
```
GET  /attendance.php?teacher_id=1&action=all
GET  /attendance.php?teacher_id=1&action=date&date=2025-05-09
GET  /attendance.php?teacher_id=1&action=summary
POST /attendance.php?teacher_id=1
PUT  /attendance.php?teacher_id=1
```

### Marks
```
GET  /marks.php?teacher_id=1&action=all
GET  /marks.php?teacher_id=1&action=student&student_id=5
POST /marks.php?teacher_id=1
PUT  /marks.php?teacher_id=1
DELETE /marks.php?teacher_id=1
```

### Mentees
```
GET  /mentees.php?teacher_id=1&action=all
GET  /mentees.php?teacher_id=1&action=profile&student_id=5
POST /mentees.php?teacher_id=1
DELETE /mentees.php?teacher_id=1
```

### Reports
```
GET  /reports.php?teacher_id=1&action=attendance
GET  /reports.php?teacher_id=1&action=marks
GET  /reports.php?teacher_id=1&action=student&student_id=5
POST /reports.php?teacher_id=1
```

---

## 📊 Database Tables at a Glance

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `attendance` | Track attendance | student_id, date, status, remarks |
| `marks` | Store marks | student_id, subject, exam_type, grade |
| `mentee_assignments` | Link teacher-student | teacher_id, student_id |
| `student_reports` | Performance reports | student_id, report_type, content |

---

## ⚠️ Important Setup Notes

1. **Teacher ID Required**: All endpoints need `teacher_id` parameter
   - Get from: `localStorage.getItem('teacherId')`
   - Or: `localStorage.getItem('userId')` if teacherId not set

2. **Mentee Assignment First**: Assign mentees before marking attendance/marks

3. **Grade Auto-Calculation**: Happens automatically when marks are added

4. **Unique Constraints**: 
   - One attendance record per student per teacher per date
   - One mentee assignment per teacher-student pair

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Teacher ID is required" | Login again, check localStorage |
| No data appears | Verify mentees are assigned to this teacher |
| Wrong grades showing | Check marks and percentage calculation |
| API 404 error | Ensure files are in `connection/` folder |
| CORS errors | Check `db.php` CORS headers are enabled |

---

## 📝 Sample Test Data

### Add Test Teacher and Students
```sql
-- Create test teacher
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Mr. John', 'john@school.com', 'hashed_password', 'teacher');
-- Get the inserted user_id (e.g., 1)

INSERT INTO teacher_profiles (user_id, employee_id, department) 
VALUES (1, 'EMP001', 'CSE');

-- Create test students
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Alice', 'alice@student.com', 'hashed_password', 'student');
-- Get the inserted user_id (e.g., 2)

INSERT INTO student_profiles (user_id, student_id, department, semester) 
VALUES (2, 'CS-2021-001', 'CSE', '4');

-- Assign as mentee
INSERT INTO mentee_assignments (teacher_id, student_id) 
VALUES (1, 2);

-- Record attendance
INSERT INTO attendance (student_id, teacher_id, attendance_date, status, subject)
VALUES (2, 1, '2025-05-09', 'present', 'Data Structures');

-- Add marks
INSERT INTO marks (student_id, teacher_id, subject, exam_type, marks_obtained, total_marks, percentage, grade)
VALUES (2, 1, 'Data Structures', 'Midterm', 92, 100, 92, 'O');
```

---

## ✅ Verification Checklist

- [ ] Database created: `student_performance_system`
- [ ] All 8 tables created successfully
- [ ] Test user data inserted
- [ ] Teacher ID stored in localStorage after login
- [ ] Can access attendance.php endpoint
- [ ] Can access marks.php endpoint
- [ ] Can access mentees.php endpoint
- [ ] Can access reports.php endpoint
- [ ] Attendance data displays in UI
- [ ] Marks calculate correctly with grades
- [ ] Reports show aggregated data

---

## 📚 Full Documentation

For complete API documentation, see:
- `connection/DATABASE_SETUP.md` - Detailed API reference
- `CONNECTION_SETUP_COMPLETE.md` - Complete setup guide

---

**Setup Status: ✅ Ready to Use!**

All database connections are configured and ready for production use.
