import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import backgroundImage from '../images/background.jpg';

const emptyProfile = {
  name: '',
  email: '',
  student_id: '',
  department: '',
  semester: '',
  section_name: '',
  education_level: '',
  phone: '',
  guardian_name: '',
  guardian_phone: '',
  bio: ''
};

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated, getProfile, updateProfile } = useAuth();

  const [profile, setProfile] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !user?.id || user.role !== 'student') {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        const merged = { ...emptyProfile, ...data };
        setProfile(merged);
        setFormData(merged);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [getProfile, isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    setIsError(false);

    try {
      await updateProfile({
        name: formData.name,
        student_id: formData.student_id,
        department: formData.department,
        semester: formData.semester,
        section_name: formData.section_name,
        education_level: formData.education_level,
        phone: formData.phone,
        guardian_name: formData.guardian_name,
        guardian_phone: formData.guardian_phone,
        bio: formData.bio
      });

      setProfile(formData);
      setIsEditing(false);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const valueOrDash = (value) => value || '-';
  const inputClass = `w-full px-4 py-2 rounded-lg border ${
    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
  } focus:ring-2 focus:ring-blue-500`;

  if (isLoading) {
    return <div className={`min-h-screen pt-24 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Loading profile...</div>;
  }

  if (!isAuthenticated || !user || user.role !== 'student') {
    return <div className={`min-h-screen pt-24 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Please login as a student to view this page.</div>;
  }

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
        {message && (
          <div className={`mb-4 rounded-lg p-3 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 mb-8`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold">
              {(profile.name || 'S').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{valueOrDash(profile.name)}</h1>
              <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {valueOrDash(profile.department)} | {valueOrDash(profile.semester)}
              </p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{valueOrDash(profile.bio)}</p>
              <button
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setFormData(profile);
                  setMessage('');
                }}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
                  isEditing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h2 className="text-2xl font-bold mb-6">Student Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['student_id', 'Student ID'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['department', 'Department'],
              ['semester', 'Semester / Year'],
              ['section_name', 'Section'],
              ['education_level', 'Education Level'],
              ['guardian_name', 'Guardian Name'],
              ['guardian_phone', 'Guardian Phone']
            ].map(([key, label]) => (
              <div key={key}>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
                {isEditing && key !== 'email' ? (
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                ) : (
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{valueOrDash(profile[key])}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
            {isEditing ? (
              <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" className={inputClass} />
            ) : (
              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{valueOrDash(profile.bio)}</p>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
