import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import assignmentsData from '../data/assignments.json';
import { loadAssignments } from './assignmentStorage';
import backgroundImage from '../images/background.jpg';
import JobRecommenderPage from './JobRecommenderPage';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [assignments, setAssignments] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [gpa] = useState(3.8);
  const [coursesEnrolled] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setAssignments(loadAssignments(assignmentsData));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadStatus('Only PDF files are allowed.');
      return;
    }

    setUploadStatus('Processing your report card...');
    setTimeout(() => {
      setUploadStatus(`"${file.name}" uploaded successfully! Analyzing data...`);
    }, 2000);
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
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur"></div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-800'}`}>
            Welcome to Progresso 📚
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Your personal companion for academic success and performance tracking.
          </p>
        </div>

        {/* Upload Report Card Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Upload Your Report Card</h2>
          <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center">
            <input
              type="file"
              id="reportCardInput"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="reportCardInput" className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-blue-500">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Click to upload or drag and drop
              </p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>PDF files up to 10MB</p>
            </label>
          </div>
          {uploadStatus && (
            <p className={`mt-4 text-center ${uploadStatus.includes('successfully') ? 'text-green-600' : 'text-blue-600'}`}>
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Academic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
            <h3 className="text-xl font-bold mb-4">Current GPA</h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">{gpa}</p>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 transition-all duration-500"
                style={{ width: `${(gpa / 4) * 100}%` }}
              ></div>
            </div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Out of 4.0 scale - Excellent Progress! 🎉
            </p>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
            <h3 className="text-xl font-bold mb-4">Courses Enrolled</h3>
            <p className="text-4xl font-bold text-green-600 mb-2">{coursesEnrolled}</p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active courses this semester
            </p>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h3 className="text-2xl font-bold mb-6">Recent Assignments</h3>
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.slice(0, 4).map(assignment => (
                <div
                  key={assignment.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                  } border-l-4 ${
                    assignment.status === 'due' ? 'border-red-500' : 'border-blue-500'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{assignment.title}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      assignment.status === 'due'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading assignments...</p>
          )}
        </div>

        {/* Job Recommendations */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-gray-800'}`}>
            Job Recommendations 💼
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get job recommendations based on your skills.
          </p>
          <button
            onClick={() => navigate('/home/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
          Find Jobs &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;

