import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherMarks.css';
import backgroundImage from '../images/background.jpg';

const TeacherMarks = () => {
  const { isDarkMode } = useTheme();
  const [marks, setMarks] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    examType: '',
    marksObtained: '',
    totalMarks: '100'
  });

  // Get teacher ID from localStorage
  const teacherId = localStorage.getItem('teacherId') || localStorage.getItem('userId');

  // Fetch marks data
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost/react-sps/connection/marks.php?teacher_id=${teacherId}&action=all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setMarks(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch marks data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchMarks();
    }
  }, [teacherId]);

  // Fetch mentees for the dropdown
  useEffect(() => {
    const fetchMentees = async () => {
      try {
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
          setMentees(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch mentees:', err);
      }
    };

    if (teacherId) {
      fetchMentees();
    }
  }, [teacherId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMarks = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.subject || !formData.examType || !formData.marksObtained) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/marks.php?teacher_id=${teacherId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: parseInt(formData.studentId),
            subject: formData.subject,
            examType: formData.examType,
            marksObtained: parseFloat(formData.marksObtained),
            totalMarks: parseFloat(formData.totalMarks)
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Marks saved successfully!');
        setFormData({
          studentId: '',
          subject: '',
          examType: '',
          marksObtained: '',
          totalMarks: '100'
        });
        
        // Refresh marks list
        const refreshResponse = await fetch(
          `http://localhost/react-sps/connection/marks.php?teacher_id=${teacherId}&action=all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setMarks(refreshData.data);
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to save marks: ' + err.message);
    }
  };

  const handleDeleteMark = async (markId) => {
    if (!window.confirm('Are you sure you want to delete this mark?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/react-sps/connection/marks.php?teacher_id=${teacherId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: markId
          })
        }
      );
      const data = await response.json();
      
      if (data.success) {
        alert('Mark deleted successfully!');
        setMarks(marks.filter(m => m.id !== markId));
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to delete mark: ' + err.message);
    }
  };

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Marks & Assessment</h2>
        </div>

        <div className="marks-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="card">
            <h3>Enter / Update Marks</h3>
            <form onSubmit={handleAddMarks}>
              <div className="form-group">
                <label>Student *</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a student</option>
                  {mentees.map(mentee => (
                    <option key={mentee.userId} value={mentee.userId}>
                      {mentee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject name"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Test / Exam *</label>
                <input
                  type="text"
                  name="examType"
                  placeholder="Midterm / Final / Test"
                  value={formData.examType}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Marks Obtained *</label>
                <input
                  type="number"
                  name="marksObtained"
                  placeholder="Enter marks"
                  step="0.01"
                  value={formData.marksObtained}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  placeholder="Enter total marks"
                  step="0.01"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="btn-save">Save Marks</button>
            </form>
          </div>

          <div className="card">
            <h3>Student Performance</h3>
            {loading ? (
              <p>Loading...</p>
            ) : marks.length === 0 ? (
              <p>No marks recorded yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Subject</th>
                      <th>Exam</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map(mark => (
                      <tr key={mark.id}>
                        <td>{mark.studentName}</td>
                        <td>{mark.subject}</td>
                        <td>{mark.examType}</td>
                        <td>{mark.marksObtained}/{mark.totalMarks}</td>
                        <td>{mark.percentage ? mark.percentage.toFixed(2) : 0}%</td>
                        <td className={`grade-${mark.grade}`}>{mark.grade}</td>
                        <td>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeleteMark(mark.id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMarks;


