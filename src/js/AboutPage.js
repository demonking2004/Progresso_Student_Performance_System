import React from 'react';
import { useTheme } from './ThemeContext';
import backgroundImage from '../images/background.jpg';
import soumiImage from '../images/soumi.png';
import majuImage from '../images/maju.png';
import shubhashishImage from '../images/shubhashish.png';
import ankitaImage from '../images/ankita.png';
import saggyImage from '../images/saggy.png';
import neelImage from '../images/neel.png';

const AboutPage = () => {
  const { isDarkMode } = useTheme();

  const teamMembers = [
    { name: 'Soumi Bachar', role: 'Project Lead', department: 'FrontEnd Developer', image: soumiImage },
    { name: 'Soumojit Majumder', role: 'Frontend Developer', department: 'Frontend Developer', image: majuImage },
    { name: 'Shubhashish Senapati', role: 'Frontend Developer', department: 'Frontend Developer', image: shubhashishImage },
    { name: 'Ankita Ghosh', role: 'Web Designer', department: 'Web Designer', image: ankitaImage },
    { name: 'Sagnik Dhar', role: 'Data Analyst', department: 'Data Analyst', image: saggyImage },
    { name: 'Debneel Roy', role: 'Backend Developer', department: 'Backend Developer', image: neelImage }
  ];

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
        {/* About Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h1 className="text-4xl font-bold mb-6">About Progresso 📚</h1>

          <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Welcome to Progresso, your personal companion for academic success! We understand that staying on top of your studies can be challenging, which is why we've created a system designed to give you clear, actionable insights into your academic journey.
          </p>

          {/* Our Mission */}
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Our Mission
          </h2>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Our mission is to empower students like you with the data you need to thrive. By centralizing your academic information, we help you identify strengths, pinpoint areas for improvement, and track your progress towards your goals. We believe that when you have a clear picture of your performance, you can make more informed decisions and achieve greater success.
          </p>

          {/* How It Helps */}
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-3">📊</span>
            How It Helps You
          </h2>
          <ul className={`list-disc list-inside space-y-3 mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li><strong>Track Progress:</strong> Visualize your academic journey with clear graphs and summaries of your grades and performance over time.</li>
            <li><strong>Identify Trends:</strong> See which subjects you excel in and where you might need extra focus.</li>
            <li><strong>Stay Organized:</strong> Keep all your important academic data, including deadlines, in one accessible place.</li>
            <li><strong>Set Goals:</strong> Define your academic aspirations and monitor your progress towards achieving them.</li>
            <li><strong>Secure & Private:</strong> Your academic data is handled with the utmost care, ensuring your privacy and security.</li>
          </ul>

          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Progresso is here to support you in every step of your educational path. Explore your data, gain insights, and take control of your academic future!
          </p>
        </div>

        {/* Our Team */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className="text-3xl mr-3">👥</span>
            Our Project Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-6 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } shadow-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition`}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-400"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-3xl font-bold hidden">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold mb-1 text-center">{member.name}</h3>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {member.role}
                </p>
                <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {member.department}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-600`}>
              <h3 className="text-xl font-bold mb-2">📈 Performance Analytics</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Get detailed insights into your academic performance with interactive charts and statistics.
              </p>
            </div>
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-600`}>
              <h3 className="text-xl font-bold mb-2">🎯 Goal Setting</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Set academic goals and track your progress with our intuitive goal management system.
              </p>
            </div>
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} border-l-4 border-purple-600`}>
              <h3 className="text-xl font-bold mb-2">🔒 Security First</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Your data is encrypted and protected with industry-leading security standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

