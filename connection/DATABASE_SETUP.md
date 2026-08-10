# Database Setup Guide - React SPS

This guide documents the complete database setup for the Student Performance System with Attendance, Marks, Mentees, and Reports management.

## Database Tables

### 1. **Attendance Table**
Manages attendance records for students.

```sql
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100),
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'leave') DEFAULT 'absent',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (student_id, teacher_id, attendance_date)
);
```

**Endpoints:**
- **GET** `/attendance.php?teacher_id={id}&action=all` - Get all attendance records
- **GET** `/attendance.php?teacher_id={id}&action=date&date={YYYY-MM-DD}` - Get attendance for specific date
- **GET** `/attendance.php?teacher_id={id}&action=student&student_id={id}` - Get attendance for specific student
- **GET** `/attendance.php?teacher_id={id}&action=summary` - Get attendance summary with percentages
- **POST** `/attendance.php?teacher_id={id}` - Record new attendance
- **PUT** `/attendance.php?teacher_id={id}` - Update attendance record

---

### 2. **Marks Table**
Stores student marks and grades.

```sql
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    total_marks DECIMAL(5, 2) DEFAULT 100,
    percentage DECIMAL(5, 2),
    grade CHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Grade Calculation:**
- O (Outstanding): >= 90%
- A (Excellent): >= 80%
- B (Good): >= 70%
- C (Satisfactory): >= 60%
- D (Pass): >= 50%
- F (Fail): < 50%

**Endpoints:**
- **GET** `/marks.php?teacher_id={id}&action=all` - Get all marks entered by teacher
- **GET** `/marks.php?teacher_id={id}&action=student&student_id={id}` - Get marks for specific student
- **POST** `/marks.php?teacher_id={id}` - Add new marks
- **PUT** `/marks.php?teacher_id={id}` - Update marks
- **DELETE** `/marks.php?teacher_id={id}` - Delete marks record

---

### 3. **Mentee Assignments Table**
Links teachers with their assigned mentee students.

```sql
CREATE TABLE mentee_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT UNSIGNED NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (teacher_id, student_id)
);
```

**Endpoints:**
- **GET** `/mentees.php?teacher_id={id}&action=all` - Get all mentees assigned to teacher
- **GET** `/mentees.php?teacher_id={id}&action=profile&student_id={id}` - Get detailed mentee profile
- **POST** `/mentees.php?teacher_id={id}` - Assign new mentee
- **DELETE** `/mentees.php?teacher_id={id}` - Remove mentee assignment

---

### 4. **Student Reports Table**
Stores performance and behavioral reports for students.

```sql
CREATE TABLE student_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    report_content TEXT NOT NULL,
    overall_performance VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Report Types:**
- Performance
- Behavioral
- Progress
- Other

**Overall Performance Levels:**
- Excellent
- Good
- Satisfactory
- Needs Improvement

**Endpoints:**
- **GET** `/reports.php?teacher_id={id}&action=attendance` - Get attendance report for all mentees
- **GET** `/reports.php?teacher_id={id}&action=marks` - Get marks report for all mentees
- **GET** `/reports.php?teacher_id={id}&action=student&student_id={id}` - Get specific student report
- **POST** `/reports.php?teacher_id={id}` - Create/update student report

---

## API Request/Response Format

### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

### Response Format (Success)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [ /* ... */ ]
}
```

### Response Format (Error)
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Example API Calls

### 1. Record Attendance
**Request:**
```bash
curl -X POST http://localhost/react-sps/connection/attendance.php?teacher_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 5,
    "date": "2025-05-09",
    "subject": "Data Structures",
    "status": "present",
    "remarks": "On time"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "id": 123
}
```

### 2. Add Marks
**Request:**
```bash
curl -X POST http://localhost/react-sps/connection/marks.php?teacher_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 5,
    "subject": "Data Structures",
    "examType": "Midterm",
    "marksObtained": 92,
    "totalMarks": 100
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Marks added successfully",
  "id": 45,
  "data": {
    "percentage": 92.00,
    "grade": "O"
  }
}
```

### 3. Get All Mentees
**Request:**
```bash
curl -X GET "http://localhost/react-sps/connection/mentees.php?teacher_id=1&action=all" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": 5,
      "name": "John Doe",
      "studentId": "CS-2021-001",
      "department": "Computer Science",
      "semester": "4",
      "sectionName": "A",
      "phone": "9876543210",
      "educationLevel": "B.Tech",
      "averageMarks": 85.5
    }
  ]
}
```

### 4. Create Student Report
**Request:**
```bash
curl -X POST http://localhost/react-sps/connection/reports.php?teacher_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 5,
    "reportType": "performance",
    "content": "Student shows excellent performance in practical exams...",
    "overallPerformance": "excellent"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Report created successfully",
  "id": 12
}
```

---

## React Component Integration

### TeacherAttendance.js
- Fetches attendance data from database
- Allows marking attendance for current date
- Shows attendance summary with percentages
- Export attendance to CSV

### TeacherMarks.js
- Displays marks entered by teacher
- Add/update/delete marks
- Automatic grade calculation
- Filter by student

### TeacherStudentManagement.js
- View all assigned mentees
- Assign new mentees
- Remove mentees
- View detailed student profiles
- Search functionality

### TeacherReports.js
- View attendance report
- View marks report
- Create/update student reports
- View individual student reports

---

## Database Setup Instructions

1. **Run the schema file:**
```bash
mysql -u root -p < connection/schema.sql
```

2. **Verify tables are created:**
```bash
mysql -u root -p student_performance_system
SHOW TABLES;
```

3. **Check table structure:**
```sql
DESC attendance;
DESC marks;
DESC mentee_assignments;
DESC student_reports;
```

---

## Important Notes

1. **Teacher ID**: Must be passed in all API requests via `teacher_id` query parameter
2. **Authorization**: Only teachers can access their own data and mentees' data
3. **Unique Constraints**: 
   - One attendance record per student per teacher per date
   - One mentee assignment per teacher-student pair
4. **Automatic Calculations**:
   - Grade is calculated automatically based on percentage
   - Percentage is calculated from marks_obtained and total_marks
5. **Timestamps**: All tables have `created_at` and most have `updated_at` for tracking changes
6. **CORS Support**: Database connection file includes CORS headers for cross-origin requests

---

## Troubleshooting

### Issue: "Teacher ID is required"
- Ensure `teacher_id` is passed in the query string or localStorage

### Issue: "Mentee not found"
- Ensure the mentee is assigned to this teacher first
- Use mentees.php to assign mentees

### Issue: "Not authorized"
- Verify teacher_id in request matches authenticated teacher
- Ensure mentee is assigned to this teacher

### Issue: Database connection failed
- Check DB_HOST, DB_USER, DB_PASS, DB_NAME environment variables
- Verify MySQL server is running
- Check database exists: `CREATE DATABASE student_performance_system;`
