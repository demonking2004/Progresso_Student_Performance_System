import React, { useEffect, useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherAssignments.css';
import backgroundImage from '../images/background.jpg';

const API_BASE_URL =
  process.env.REACT_APP_ASSIGNMENTS_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost/react-sps/connection';

const TeacherAssignments = () => {
  const { isDarkMode } = useTheme();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    file: null
  });

  // Fetch assignments from database
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/assignments.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments || []);
      } else {
        console.error('Assignments fetch error:', data);
        setError(data.message || 'Failed to fetch assignments');
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(`Error connecting to server at ${API_BASE_URL}. Is the backend running?`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions from database
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(`Error connecting to server at ${API_BASE_URL}`);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/assignments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          description: formData.description.trim() || 'Assignment details will be shared in class.',
          dueDate: formData.dueDate
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Assignment uploaded successfully!');
        setFormData({ title: '', subject: '', description: '', dueDate: '', file: null });
        await fetchAssignments();
        setError('');
      } else {
        setError(data.message || 'Failed to upload assignment');
      }
    } catch (err) {
      console.error('Error uploading assignment:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionCount = (assignmentId) =>
    submissions.filter(submission => submission.assignment_id === assignmentId).length;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : '-';

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Assignments</h2>
        </div>

        <div className="assignments-container">
          <div className="card">
            <h3>Upload Assignment</h3>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={handleAddAssignment}>
              <div className="form-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
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
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Add a short description (optional)"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn-upload" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Assignment'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Assignments & Submissions</h3>
            <div className="table-wrapper">
              <table className="assignments-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Deadline</th>
                    <th>Submission</th>
                    <th>Submissions</th>
                    <th>Marks</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => {
                    const submissionCount = getSubmissionCount(assignment.id);
                    const isSubmitted = submissionCount > 0;
                    return (
                      <tr key={assignment.id}>
                        <td>{assignment.title}</td>
                        <td>{assignment.subject || 'General'}</td>
                        <td>{formatDate(assignment.due_date)}</td>
                        <td>
                          <span className={`status-${assignment.status}`}>
                            {assignment.status ? assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1) : 'Pending'}
                          </span>
                        </td>
                        <td>{submissionCount}</td>
                        <td>{assignment.marks || '-'}</td>
                        <td>{assignment.feedback || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Student Submissions</h3>
            {submissions.length > 0 ? (
              <div className="table-wrapper">
                <table className="assignments-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Submitted On</th>
                      <th>File</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(submission => (
                      <tr key={submission.id}>
                        <td>{submission.student_name || 'Student'}</td>
                        <td>{submission.assignment_title}</td>
                        <td>{formatDate(submission.submitted_at)}</td>
                        <td>{submission.file_name || '-'}</td>
                        <td>{submission.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No submissions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;
