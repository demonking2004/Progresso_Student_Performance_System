import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherStudentManagement.css';
import backgroundImage from '../images/background.jpg';

const TeacherStudentManagement = () => {
  const { isDarkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentId, setNewStudentId] = useState('');
  const [allAvailableStudents, setAllAvailableStudents] = useState([]);

  // Get teacher ID from localStorage
  const teacherId = localStorage.getItem('teacherId') || localStorage.getItem('userId');

  // Fetch mentees
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost/react-sps/connection/mentees.php?teacher_id=${teacherId}&action=all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setStudents(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch mentees: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchMentees();
    }
  }, [teacherId]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toString().includes(searchTerm))
  );

  const handleViewProfile = async (student) => {
    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/mentees.php?teacher_id=${teacherId}&action=profile&student_id=${student.userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setSelectedStudent(data.data);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to fetch profile: ' + err.message);
    }
  };

  const handleRemoveMentee = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this mentee?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/mentees.php?teacher_id=${teacherId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: studentId
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Mentee removed successfully!');
        setStudents(students.filter(s => s.userId !== studentId));
        setSelectedStudent(null);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to remove mentee: ' + err.message);
    }
  };

  const handleAddMentee = async (e) => {
    e.preventDefault();
    
    if (!newStudentId) {
      alert('Please enter a student ID');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/mentees.php?teacher_id=${teacherId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: parseInt(newStudentId)
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Mentee assigned successfully!');
        setNewStudentId('');
        
        // Refresh mentees list
        const refreshResponse = await fetch(
          `http://localhost/react-sps/connection/mentees.php?teacher_id=${teacherId}&action=all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setStudents(refreshData.data);
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to assign mentee: ' + err.message);
    }
  };

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Student Management (Mentee)</h2>
        </div>

        <div className="student-management-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="card">
            <h3>Add New Mentee</h3>
            <form onSubmit={handleAddMentee}>
              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="number"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="Enter student user ID"
                  required
                />
              </div>
              <button type="submit" className="btn-add">Assign Mentee</button>
            </form>
          </div>

          <div className="card">
            <h3>Search Students</h3>
            <input
              type="text"
              placeholder="Search by name or student ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="card">
            <h3>Mentee List</h3>
            {loading ? (
              <p>Loading...</p>
            ) : filteredStudents.length === 0 ? (
              <p>No mentees assigned.</p>
            ) : (
              <div className="table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Phone</th>
                      <th>Avg Marks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.userId}>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.semester}</td>
                        <td>{student.phone}</td>
                        <td>{student.averageMarks ? student.averageMarks.toFixed(2) : 'N/A'}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() => handleViewProfile(student)}
                          >
                            View
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleRemoveMentee(student.userId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedStudent && (
            <div className="card profile-card">
              <h3>Student Profile</h3>
              <div className="profile-details">
                <div className="detail-item">
                  <strong>Name:</strong> <span>{selectedStudent.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> <span>{selectedStudent.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Student ID:</strong> <span>{selectedStudent.studentId}</span>
                </div>
                <div className="detail-item">
                  <strong>Department:</strong> <span>{selectedStudent.department}</span>
                </div>
                <div className="detail-item">
                  <strong>Semester:</strong> <span>{selectedStudent.semester}</span>
                </div>
                <div className="detail-item">
                  <strong>Section:</strong> <span>{selectedStudent.sectionName}</span>
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong> <span>{selectedStudent.phone}</span>
                </div>
                <div className="detail-item">
                  <strong>Guardian Name:</strong> <span>{selectedStudent.guardianName}</span>
                </div>
                <div className="detail-item">
                  <strong>Guardian Phone:</strong> <span>{selectedStudent.guardianPhone}</span>
                </div>
                <div className="detail-item">
                  <strong>Education Level:</strong> <span>{selectedStudent.educationLevel}</span>
                </div>
                <div className="detail-item">
                  <strong>Bio:</strong> <span>{selectedStudent.bio}</span>
                </div>
              </div>
              <button
                className="btn-close"
                onClick={() => setSelectedStudent(null)}
              >
                Close Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentManagement;


