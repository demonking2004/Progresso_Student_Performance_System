import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherReports.css';
import backgroundImage from '../images/background.jpg';

const TeacherReports = () => {
  const { isDarkMode } = useTheme();
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [marksReport, setMarksReport] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingMarks, setLoadingMarks] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [newReport, setNewReport] = useState({
    studentId: '',
    reportType: 'performance',
    content: '',
    overallPerformance: 'satisfactory'
  });

  // Get teacher ID from localStorage
  const teacherId = localStorage.getItem('teacherId') || localStorage.getItem('userId');

  // Fetch attendance report
  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        setLoadingAttendance(true);
        const response = await fetch(
          `http://localhost/react-sps/connection/reports.php?teacher_id=${teacherId}&action=attendance`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setAttendanceReport(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch attendance report: ' + err.message);
      } finally {
        setLoadingAttendance(false);
      }
    };

    if (teacherId) {
      fetchAttendanceReport();
    }
  }, [teacherId]);

  // Fetch marks report
  useEffect(() => {
    const fetchMarksReport = async () => {
      try {
        setLoadingMarks(true);
        const response = await fetch(
          `http://localhost/react-sps/connection/reports.php?teacher_id=${teacherId}&action=marks`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setMarksReport(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch marks report: ' + err.message);
      } finally {
        setLoadingMarks(false);
      }
    };

    if (teacherId) {
      fetchMarksReport();
    }
  }, [teacherId]);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'good';
    if (percentage >= 75) return 'avg';
    return 'bad';
  };

  const getGradeColor = (grade) => {
    return `grade-${grade}`;
  };

  const handleViewStudentReport = async (studentId) => {
    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/reports.php?teacher_id=${teacherId}&action=student&student_id=${studentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setStudentReport(data.data);
        setSelectedStudent(studentId);
      } else {
        alert('No report found for this student or error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to fetch student report: ' + err.message);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    
    if (!newReport.studentId || !newReport.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/reports.php?teacher_id=${teacherId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: parseInt(newReport.studentId),
            reportType: newReport.reportType,
            content: newReport.content,
            overallPerformance: newReport.overallPerformance
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Report created/updated successfully!');
        setNewReport({
          studentId: '',
          reportType: 'performance',
          content: '',
          overallPerformance: 'satisfactory'
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to create report: ' + err.message);
    }
  };

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Reports</h2>
        </div>

        <div className="reports-container">
          {error && <div className="error-message">{error}</div>}

          <div className="card">
            <h3>Create/Update Student Report</h3>
            <form onSubmit={handleCreateReport}>
              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="number"
                  value={newReport.studentId}
                  onChange={(e) => setNewReport({...newReport, studentId: e.target.value})}
                  placeholder="Enter student user ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Report Type *</label>
                <select 
                  value={newReport.reportType}
                  onChange={(e) => setNewReport({...newReport, reportType: e.target.value})}
                >
                  <option value="performance">Performance</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="progress">Progress</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Overall Performance</label>
                <select 
                  value={newReport.overallPerformance}
                  onChange={(e) => setNewReport({...newReport, overallPerformance: e.target.value})}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="satisfactory">Satisfactory</option>
                  <option value="needs_improvement">Needs Improvement</option>
                </select>
              </div>
              <div className="form-group">
                <label>Report Content *</label>
                <textarea
                  value={newReport.content}
                  onChange={(e) => setNewReport({...newReport, content: e.target.value})}
                  placeholder="Write detailed report here..."
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="btn-save">Create/Update Report</button>
            </form>
          </div>

          <div className="card">
            <h3>Attendance Report</h3>
            {loadingAttendance ? (
              <p>Loading...</p>
            ) : attendanceReport.length === 0 ? (
              <p>No attendance data available.</p>
            ) : (
              <div className="table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Total Classes</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Leave</th>
                      <th>Attendance %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceReport.map((report, index) => (
                      <tr key={index}>
                        <td>{report.name}</td>
                        <td>{report.totalClasses}</td>
                        <td>{report.present}</td>
                        <td>{report.absent}</td>
                        <td>{report.leave}</td>
                        <td className={`percentage-${getAttendanceColor(report.percentage)}`}>
                          {report.percentage}%
                        </td>
                        <td>
                          <button 
                            className="btn-view"
                            onClick={() => handleViewStudentReport(report.studentId)}
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Marks Report</h3>
            {loadingMarks ? (
              <p>Loading...</p>
            ) : marksReport.length === 0 ? (
              <p>No marks data available.</p>
            ) : (
              <div className="table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Subject</th>
                      <th>Exam Type</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksReport.map((report, index) => (
                      <tr key={index}>
                        <td>{report.name}</td>
                        <td>{report.subject}</td>
                        <td>{report.examType}</td>
                        <td>{report.marksObtained}/{report.totalMarks}</td>
                        <td>{report.percentage ? report.percentage.toFixed(2) : 'N/A'}%</td>
                        <td className={getGradeColor(report.grade)}>
                          {report.grade}
                        </td>
                        <td>{report.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {studentReport && (
            <div className="card profile-card">
              <h3>Student Report - {selectedStudent}</h3>
              <div className="report-details">
                <div className="detail-item">
                  <strong>Report Type:</strong> <span>{studentReport.reportType}</span>
                </div>
                <div className="detail-item">
                  <strong>Overall Performance:</strong> <span>{studentReport.overallPerformance}</span>
                </div>
                <div className="detail-item">
                  <strong>Content:</strong>
                  <p>{studentReport.content}</p>
                </div>
                <div className="detail-item">
                  <strong>Created At:</strong> <span>{studentReport.createdAt}</span>
                </div>
                <div className="detail-item">
                  <strong>Updated At:</strong> <span>{studentReport.updatedAt}</span>
                </div>
              </div>
              <button
                className="btn-close"
                onClick={() => setStudentReport(null)}
              >
                Close Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;


