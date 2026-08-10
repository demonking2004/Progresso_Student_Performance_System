import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import backgroundImage from '../images/background.jpg';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost/react-sps/connection';

const AssignmentsPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

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
        setError('');
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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    if (status === 'due') return 'bg-red-100 text-red-800';
    if (status === 'assigned') return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const handleFormChange = (assignmentId, field, value) => {
    setFormState(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value
      }
    }));
  };

  const handleSubmitAssignment = async (e, assignment) => {
    e.preventDefault();
    const currentForm = formState[assignment.id] || {};
    const studentName = (currentForm.studentName || user?.name || user?.email || 'Student').trim();
    const notes = (currentForm.notes || '').trim();

    if (!studentName) {
      setError('Please enter your name before submitting');
      return;
    }

    try {
      setSubmittingId(assignment.id);
      const response = await fetch(`${API_BASE_URL}/submissions.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignment_id: assignment.id,
          student_name: studentName,
          assignment_title: assignment.title,
          file_name: currentForm.file?.name || 'No file uploaded',
          notes: notes
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Assignment submitted successfully!');
        setFormState(prev => ({
          ...prev,
          [assignment.id]: {
            studentName,
            notes: '',
            file: null,
            fileKey: (prev[assignment.id]?.fileKey || 0) + 1
          }
        }));
        setError('');
      } else {
        console.error('Submission error:', data);
        setError(data.message || 'Failed to submit assignment');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(`Error connecting to server at ${API_BASE_URL}. Is the backend running?`);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div 
      className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} min-h-screen pt-20 pb-20`}
      style={{
        backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h1 className="text-4xl font-bold mb-4">Assignments</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Track all your assignments and their status
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-8 flex gap-4 flex-wrap">
          {['all', 'assigned', 'due'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {loading ? (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Loading assignments...
              </p>
            </div>
          ) : filteredAssignments.length > 0 ? (
            filteredAssignments.map(assignment => {
              const currentForm = formState[assignment.id] || {};
              const status = assignment.status || 'assigned';
              const dueDate = assignment.due_date;
              return (
                <div
                  key={assignment.id}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 border-l-4 ${
                    status === 'due' ? 'border-red-500' : 'border-green-500'
                  } hover:shadow-xl transition`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                      {assignment.subject && (
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          {assignment.subject}
                        </p>
                      )}
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {assignment.description || 'Assignment details will be shared in class.'}
                      </p>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Due Date: {new Date(dueDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <span
                        className={`mt-4 md:mt-0 px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(status)}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <form
                    onSubmit={(event) => handleSubmitAssignment(event, assignment)}
                    className={`mt-6 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'} p-4`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className={`w-full rounded-lg border px-3 py-2 text-sm ${
                            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                          }`}
                          value={currentForm.studentName ?? user?.name ?? user?.email ?? ''}
                          onChange={(event) => handleFormChange(assignment.id, 'studentName', event.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Attach File
                        </label>
                        <input
                          key={currentForm.fileKey || 0}
                          type="file"
                          className={`w-full text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          onChange={(event) => handleFormChange(assignment.id, 'file', event.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold mb-2">
                        Notes for Teacher (optional)
                      </label>
                      <textarea
                        rows="3"
                        className={`w-full rounded-lg border px-3 py-2 text-sm ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                        }`}
                        value={currentForm.notes || ''}
                        onChange={(event) => handleFormChange(assignment.id, 'notes', event.target.value)}
                        placeholder="Add a short note"
                      />
                    </div>
                    <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Submitting stores your file name and note for the teacher.
                      </p>
                      <button
                        type="submit"
                        disabled={submittingId === assignment.id}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {submittingId === assignment.id ? 'Submitting...' : 'Submit Assignment'}
                      </button>
                    </div>
                  </form>
                </div>
              );
            })
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                No assignments found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
