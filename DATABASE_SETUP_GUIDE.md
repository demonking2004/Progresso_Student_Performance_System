# Database Setup and API Integration Guide

## Overview
This guide explains how to set up the MySQL database and integrate it with the Teacher Portal for managing marks, mentees, and reports.

## Database Tables Created

### 1. **marks** table
Stores all marks/grades entered by teachers.

```sql
- id: Primary key
- student_id: Foreign key to users table
- teacher_id: Foreign key to users table
- subject: Subject name
- exam_type: Type of exam (Midterm, Final, Test, etc.)
- marks_obtained: Actual marks obtained by student
- total_marks: Total marks for the exam
- percentage: Calculated percentage
- grade: Calculated grade (O, A, B, C, D, F)
- created_at: Timestamp
- updated_at: Timestamp
```

### 2. **mentee_assignments** table
Links teachers with their mentee students.

```sql
- id: Primary key
- teacher_id: Foreign key to users table
- student_id: Foreign key to users table
- assigned_at: Timestamp
- UNIQUE constraint on (teacher_id, student_id)
```

### 3. **attendance** table
Stores attendance records.

```sql
- id: Primary key
- student_id: Foreign key to users table
- teacher_id: Foreign key to users table
- subject: Subject name
- attendance_date: Date of attendance
- status: ENUM ('present', 'absent', 'leave')
- created_at: Timestamp
```

### 4. **student_reports** table
Stores detailed reports for students.

```sql
- id: Primary key
- student_id: Foreign key to users table
- teacher_id: Foreign key to users table
- report_type: Type of report (Overall, Performance, etc.)
- report_content: Detailed report text
- overall_performance: Performance summary
- created_at: Timestamp
- updated_at: Timestamp
```

## Setup Instructions

### Step 1: Import the Updated Schema
Run the updated schema.sql file to create all tables:

```bash
mysql -u root -p student_performance_system < connection/schema.sql
```

Or manually run the SQL commands in your MySQL client.

### Step 2: Verify Database Connection
Test your database connection by visiting:
```
http://localhost/react-sps/connection/db.php
```

The PHP should establish a connection successfully.

## API Endpoints

### Marks API (`connection/marks.php`)

#### Get All Marks
```http
GET /marks.php?action=all&teacher_id=1
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 2,
      "studentName": "John Doe",
      "subject": "Database Design",
      "examType": "Midterm",
      "marksObtained": 85,
      "totalMarks": 100,
      "percentage": 85,
      "grade": "O",
      "createdAt": "2024-01-15 10:30:00"
    }
  ]
}
```

#### Get Marks for Specific Student
```http
GET /marks.php?action=student&teacher_id=1&student_id=2
```

#### Add New Marks
```http
POST /marks.php?teacher_id=1
Content-Type: application/json

{
  "studentId": 2,
  "subject": "Database Design",
  "examType": "Midterm",
  "marksObtained": 85,
  "totalMarks": 100
}
```

#### Update Marks
```http
PUT /marks.php?teacher_id=1
Content-Type: application/json

{
  "id": 1,
  "marksObtained": 88,
  "totalMarks": 100
}
```

#### Delete Marks
```http
DELETE /marks.php?teacher_id=1
Content-Type: application/json

{
  "id": 1
}
```

### Mentees API (`connection/mentees.php`)

#### Get All Mentees for Teacher
```http
GET /mentees.php?action=all&teacher_id=1
```

#### Get Specific Mentee Profile
```http
GET /mentees.php?action=profile&teacher_id=1&student_id=2
```

#### Assign a Mentee
```http
POST /mentees.php?teacher_id=1
Content-Type: application/json

{
  "studentId": 2
}
```

#### Remove a Mentee
```http
DELETE /mentees.php?teacher_id=1
Content-Type: application/json

{
  "studentId": 2
}
```

### Reports API (`connection/reports.php`)

#### Get Attendance Report
```http
GET /reports.php?action=attendance&teacher_id=1
```

#### Get Marks Report
```http
GET /reports.php?action=marks&teacher_id=1
```

#### Get Student-Specific Report
```http
GET /reports.php?action=student&teacher_id=1&student_id=2
```

#### Create/Update Student Report
```http
POST /reports.php?teacher_id=1
Content-Type: application/json

{
  "studentId": 2,
  "reportType": "Overall Performance",
  "content": "Student is performing well in assignments...",
  "overallPerformance": "Excellent"
}
```

## React Component Integration

### TeacherMarks.js
The component now:
- Fetches mentees assigned to the teacher
- Loads marks from database on mount
- Allows teachers to add/update/delete marks
- Displays success/error messages

**Key Features:**
- Select mentee from dropdown
- Enter subject, exam type, marks
- Auto-calculation of percentage and grade
- Real-time data synchronization

### TeacherStudentManagement.js (Mentee Page)
The component now:
- Fetches all mentees assigned to the teacher
- Shows detailed mentee profile
- Allows removing mentees
- Search functionality

**Key Features:**
- View mentee information
- See average marks for each mentee
- Remove mentee relationship
- Search by name or student ID

### TeacherReports.js
The component now:
- Fetches attendance report from database
- Fetches marks report from database
- Displays comprehensive reports

**Key Features:**
- Attendance percentage color coding
- Grade-based styling
- N/A handling for missing data

## Important: Getting teacher_id from localStorage

The React components expect `teacher_id` to be stored in `localStorage` after login. Make sure your login process sets this:

```javascript
// In your login.php or after successful authentication
localStorage.setItem('teacher_id', teacherId);
```

If teacher_id is not set, the components will show an error message.

## Testing the Integration

### 1. Insert Test Data

First, create a teacher and student:

```sql
-- Insert a teacher
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Dr. Smith', 'smith@school.com', SHA2('password123', 256), 'teacher');

-- Insert students
INSERT INTO users (name, email, password_hash, role) 
VALUES ('John Doe', 'john@school.com', SHA2('password123', 256), 'student');

INSERT INTO users (name, email, password_hash, role) 
VALUES ('Jane Smith', 'jane@school.com', SHA2('password123', 256), 'student');

-- Assign mentees to teacher (teacher_id=1, student_ids=2,3)
INSERT INTO mentee_assignments (teacher_id, student_id) 
VALUES (1, 2), (1, 3);

-- Add marks
INSERT INTO marks (student_id, teacher_id, subject, exam_type, marks_obtained, total_marks, percentage, grade)
VALUES (2, 1, 'Database Design', 'Midterm', 85, 100, 85, 'O');
```

### 2. Test API Endpoints

Use Postman or cURL to test:

```bash
# Get all marks for teacher 1
curl "http://localhost/react-sps/connection/marks.php?action=all&teacher_id=1"

# Get all mentees for teacher 1
curl "http://localhost/react-sps/connection/mentees.php?action=all&teacher_id=1"

# Get attendance report
curl "http://localhost/react-sps/connection/reports.php?action=attendance&teacher_id=1"
```

### 3. Test in Browser

1. Set teacher_id in localStorage:
   ```javascript
   localStorage.setItem('teacher_id', '1');
   ```

2. Navigate to Teacher Portal pages:
   - Marks & Assessment
   - Student Management (Mentee)
   - Reports

3. Verify data loads and operations work correctly

## Troubleshooting

### Issue: "Teacher ID not found" error
**Solution:** Make sure `teacher_id` is set in localStorage after login

### Issue: No data displays
**Solution:** 
- Verify teacher_id exists in your database
- Check that mentee assignments are created
- Use browser DevTools to check API responses

### Issue: CORS errors
**Solution:** The PHP files already include CORS headers for localhost. Make sure you're accessing from localhost.

### Issue: Database connection fails
**Solution:**
- Verify MySQL is running
- Check database credentials in db.php
- Ensure database name is correct

## Database Relationships

```
users (teacher) ──1─────N── mentee_assignments ──N─────1── users (student)
     ↓                                                          ↓
     └─────────────────────── marks ──────────────────────────┘
     
     └─────────────────────── attendance ───────────────────────┘
     
     └─────────────────────── student_reports ────────────────┘
```

## Security Notes

1. Always validate teacher_id matches current logged-in user
2. Use prepared statements (already implemented)
3. Sanitize all input
4. Implement proper authentication before accessing APIs
5. Consider adding rate limiting for production

## Future Enhancements

1. Add more detailed error handling
2. Implement batch operations
3. Add export to CSV/Excel functionality
4. Add attendance entry forms
5. Add report generation/printing
6. Add student performance analytics

## Support

For issues or questions, refer to the API responses which include detailed error messages.
