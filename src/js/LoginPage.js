import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/background.jpg';
import logoImage from '../images/logo 2.jpg';

const getInitialSignupForm = () => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  student_id: '',
  semester: '',
  section_name: '',
  guardian_name: '',
  guardian_phone: '',
  education_level: '',
  employee_id: '',
  designation: '',
  subject_specialization: '',
  years_of_experience: '',
  highest_qualification: '',
  department: '',
  bio: '',
  professional_bio: ''
});

const LoginPage = () => {
  const { isDarkMode } = useTheme();
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('role');
  const [authMode, setAuthMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupForm, setSignupForm] = useState(getInitialSignupForm());
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetMessages = () => {
    setMessage('');
    setIsError(false);
  };

  const clearAll = () => {
    setEmail('');
    setPassword('');
    setSignupForm(getInitialSignupForm());
    resetMessages();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('auth');
    setAuthMode('login');
    clearAll();
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!selectedRole) {
      setIsError(true);
      setMessage('Please select a role first.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        if (signupForm.password !== signupForm.confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        if (selectedRole === 'student' && !signupForm.student_id.trim()) {
          throw new Error('Student ID is required.');
        }

        if (selectedRole === 'teacher' && !signupForm.employee_id.trim()) {
          throw new Error('Employee ID is required.');
        }

        const payload = {
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          role: selectedRole,
          phone: signupForm.phone,
          department: signupForm.department
        };

        if (selectedRole === 'student') {
          Object.assign(payload, {
            student_id: signupForm.student_id,
            semester: signupForm.semester,
            section_name: signupForm.section_name,
            guardian_name: signupForm.guardian_name,
            guardian_phone: signupForm.guardian_phone,
            education_level: signupForm.education_level,
            bio: signupForm.bio
          });
        }

        if (selectedRole === 'teacher') {
          Object.assign(payload, {
            employee_id: signupForm.employee_id,
            designation: signupForm.designation,
            subject_specialization: signupForm.subject_specialization,
            years_of_experience: Number(signupForm.years_of_experience || 0),
            highest_qualification: signupForm.highest_qualification,
            professional_bio: signupForm.professional_bio
          });
        }

        const result = await signup(payload);
        setMessage(result.message || 'Signup successful. Please login.');
        setIsError(false);
        setAuthMode('login');
        setEmail(signupForm.email);
        setPassword('');
        setSignupForm(getInitialSignupForm());
      } else {
        await login(email, password, selectedRole);
        navigate(selectedRole === 'teacher' ? '/teacher-dashboard' : '/home');
      }
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  if (step === 'role') {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600 to-blue-800'} flex items-center justify-center pt-20`}
        style={{
          backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center">
          <img src={logoImage} alt="Progresso Logo" className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-lg" />
          <h1 className="text-4xl font-bold mb-2 text-white progresso-title">Progresso</h1>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-blue-100'}`}>
            Where Every Student's Progress Matters
          </p>

          <div className="mb-8">
            <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-200' : 'text-white'}`}>Continue as:</p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <button
                onClick={() => handleRoleSelect('student')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-100 transition shadow-lg"
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSelect('teacher')}
                className="bg-yellow-300 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-200 transition shadow-lg"
              >
                Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center pt-20 pb-10`}
      style={{
        backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 w-full max-w-2xl`}>
        <h2 className="text-3xl font-bold mb-2 text-center">
          {selectedRole === 'teacher' ? 'Teacher' : 'Student'} {authMode === 'login' ? 'Login' : 'Signup'}
        </h2>
        <p className={`text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {authMode === 'login' ? 'Enter your credentials to continue' : 'Create your detailed account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'login' ? (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="your@email.com" required />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Password" required />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                  <input type="text" name="name" value={signupForm.name} onChange={handleSignupChange} className={inputClass} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" name="email" value={signupForm.email} onChange={handleSignupChange} className={inputClass} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                  <input type="password" name="password" value={signupForm.password} onChange={handleSignupChange} className={inputClass} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={signupForm.confirmPassword} onChange={handleSignupChange} className={inputClass} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="text" name="phone" value={signupForm.phone} onChange={handleSignupChange} className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>
                  <input type="text" name="department" value={signupForm.department} onChange={handleSignupChange} className={inputClass} />
                </div>

                {selectedRole === 'student' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Student ID</label>
                      <input type="text" name="student_id" value={signupForm.student_id} onChange={handleSignupChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Semester / Year</label>
                      <input type="text" name="semester" value={signupForm.semester} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Section</label>
                      <input type="text" name="section_name" value={signupForm.section_name} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Education Level</label>
                      <input type="text" name="education_level" value={signupForm.education_level} onChange={handleSignupChange} className={inputClass} placeholder="B.Tech / M.Tech etc." />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guardian Name</label>
                      <input type="text" name="guardian_name" value={signupForm.guardian_name} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guardian Phone</label>
                      <input type="text" name="guardian_phone" value={signupForm.guardian_phone} onChange={handleSignupChange} className={inputClass} />
                    </div>
                  </>
                )}

                {selectedRole === 'teacher' && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Employee ID</label>
                      <input type="text" name="employee_id" value={signupForm.employee_id} onChange={handleSignupChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Designation</label>
                      <input type="text" name="designation" value={signupForm.designation} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject Specialization</label>
                      <input type="text" name="subject_specialization" value={signupForm.subject_specialization} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Years of Experience</label>
                      <input type="number" min="0" name="years_of_experience" value={signupForm.years_of_experience} onChange={handleSignupChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Highest Qualification</label>
                      <input type="text" name="highest_qualification" value={signupForm.highest_qualification} onChange={handleSignupChange} className={inputClass} />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedRole === 'teacher' ? 'Professional Bio' : 'Bio'}
                </label>
                <textarea
                  name={selectedRole === 'teacher' ? 'professional_bio' : 'bio'}
                  value={selectedRole === 'teacher' ? signupForm.professional_bio : signupForm.bio}
                  onChange={handleSignupChange}
                  rows="3"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {message && (
            <div className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
            {isLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>

        <div className={`mt-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              resetMessages();
            }}
            className="text-blue-600 hover:underline"
          >
            {authMode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </div>

        <button
          onClick={() => {
            setStep('role');
            setSelectedRole(null);
            setAuthMode('login');
            clearAll();
          }}
          className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold ${
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
