import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherAttendance.css';
import backgroundImage from '../images/background.jpg';

const TeacherAttendance = () => {
  const { isDarkMode } = useTheme();
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAttendance, setNewAttendance] = useState({
    studentId: '',
    subject: '',
    status: 'present',
    remarks: ''
  });

  // Get teacher ID from localStorage (set during login)
  const teacherId = localStorage.getItem('teacherId') || localStorage.getItem('userId');

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost/react-sps/connection/attendance.php?teacher_id=${teacherId}&action=date&date=${selectedDate}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setAttendanceData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch attendance data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchAttendance();
    }
  }, [teacherId, selectedDate]);

  // Fetch attendance summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `http://localhost/react-sps/connection/attendance.php?teacher_id=${teacherId}&action=summary`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setAttendanceSummary(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch attendance summary:', err);
      }
    };

    if (teacherId) {
      fetchSummary();
    }
  }, [teacherId]);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    
    if (!newAttendance.studentId) {
      alert('Please select a student');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/attendance.php?teacher_id=${teacherId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: parseInt(newAttendance.studentId),
            date: selectedDate,
            subject: newAttendance.subject,
            status: newAttendance.status,
            remarks: newAttendance.remarks
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Attendance recorded successfully');
        setNewAttendance({
          studentId: '',
          subject: '',
          status: 'present',
          remarks: ''
        });
        // Refresh the attendance list
        const refreshResponse = await fetch(
          `http://localhost/react-sps/connection/attendance.php?teacher_id=${teacherId}&action=date&date=${selectedDate}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setAttendanceData(refreshData.data);
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to record attendance: ' + err.message);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const csvContent = [
        ['Date', 'Name', 'Student ID', 'Subject', 'Status', 'Remarks'],
        ...attendanceData.map(record => [
          record.date,
          record.studentName,
          record.studentNo,
          record.subject,
          record.status,
          record.remarks || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      element.setAttribute('download', `attendance_${selectedDate}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    }
  };

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Attendance Management</h2>
        </div>

        <div className="attendance-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="card">
            <h3>Mark Attendance</h3>
            <form onSubmit={handleMarkAttendance}>
              <div className="form-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Student:</label>
                <select 
                  value={newAttendance.studentId}
                  onChange={(e) => setNewAttendance({...newAttendance, studentId: e.target.value})}
                >
                  <option value="">Select a student</option>
                  {attendanceSummary.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input 
                  type="text" 
                  value={newAttendance.subject}
                  onChange={(e) => setNewAttendance({...newAttendance, subject: e.target.value})}
                  placeholder="Subject name"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select 
                  value={newAttendance.status}
                  onChange={(e) => setNewAttendance({...newAttendance, status: e.target.value})}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label>Remarks:</label>
                <textarea 
                  value={newAttendance.remarks}
                  onChange={(e) => setNewAttendance({...newAttendance, remarks: e.target.value})}
                  placeholder="Additional remarks"
                />
              </div>
              <button type="submit" className="btn-submit">Record Attendance</button>
            </form>
          </div>

          <div className="card">
            <h3>Attendance History for {selectedDate}</h3>
            {loading ? (
              <p>Loading...</p>
            ) : attendanceData.length === 0 ? (
              <p>No attendance records for this date.</p>
            ) : (
              <div className="table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record, index) => (
                      <tr key={index}>
                        <td>{record.date}</td>
                        <td>{record.studentName}</td>
                        <td>{record.studentNo}</td>
                        <td>{record.subject}</td>
                        <td className={`status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </td>
                        <td>{record.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Attendance Summary for All Students</h3>
            {attendanceSummary.length === 0 ? (
              <p>No mentees assigned.</p>
            ) : (
              <div className="table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Total Classes</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Leave</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceSummary.map((record, index) => (
                      <tr key={index}>
                        <td>{record.name}</td>
                        <td>{record.totalClasses}</td>
                        <td>{record.present}</td>
                        <td>{record.absent}</td>
                        <td>{record.leave}</td>
                        <td className={record.percentage >= 75 ? 'status-present' : 'status-absent'}>
                          {record.percentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Download Report</h3>
            <p>Download attendance report for the selected date in CSV format.</p>
            <button className="btn-download" onClick={handleDownloadReport}>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
