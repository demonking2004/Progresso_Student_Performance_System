import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';

const JobRecommenderPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseField = (field) => {
    if (Array.isArray(field)) return field;
    try { return JSON.parse(field); } catch { return [field]; }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setJobs([]);
    try {
      const params = new URLSearchParams();
      params.append('text', text);

      const res = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: params
      });

      const data = await res.json();

      if (data.error) { setError(data.error); return; }
      if (data.jobs.length === 0) { setError('No matching jobs found for your skills.'); return; }

      setJobs(data.jobs);
    } catch (err) {
      setError('Could not connect to job recommendation service. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} min-h-screen pt-20 pb-20`}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-gray-800'}`}>
            Job Recommendations 💼
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your skills or paste your resume to get matched jobs.
          </p>
        </div>

        {/* Input Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. I have experience in Python, Machine Learning, MongoDB..."
            rows={5}
            className={`w-full p-3 rounded-lg border mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Finding Jobs...' : 'Get Recommendations'}
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        {/* Results */}
        {jobs.length > 0 && (
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {jobs.length} Jobs Found
            </h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3 className={`font-bold text-xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{job.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Type:</strong> {job.search_type}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Experience:</strong> {job.experience}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Location:</strong> {parseField(job.location).join(', ')}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Salary:</strong> {job.salary}
                    </p>
                  </div>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Skills:</strong> {parseField(job.skills).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Match: {(job.rank * 100).toFixed(1)}%
                    </span>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      View Job &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommenderPage;