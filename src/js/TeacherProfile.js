import React, { useEffect, useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import '../styles/TeacherProfile.css';
import backgroundImage from '../images/background.jpg';
import teacherProfileImage from '../images/dnn.jpg';

const emptyTeacherProfile = {
  name: '',
  email: '',
  employee_id: '',
  department: '',
  designation: '',
  subject_specialization: '',
  years_of_experience: 0,
  highest_qualification: '',
  phone: '',
  professional_bio: ''
};

const TeacherProfile = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated, getProfile, updateProfile } = useAuth();

  const [profile, setProfile] = useState(emptyTeacherProfile);
  const [formData, setFormData] = useState(emptyTeacherProfile);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !user?.id || user.role !== 'teacher') {
        return;
      }

      try {
        const result = await getProfile();
        const merged = { ...emptyTeacherProfile, ...result };
        setProfile(merged);
        setFormData(merged);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || 'Failed to load profile.');
      }
    };

    loadProfile();
  }, [getProfile, isAuthenticated, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      await updateProfile({
        name: formData.name,
        employee_id: formData.employee_id,
        department: formData.department,
        designation: formData.designation,
        subject_specialization: formData.subject_specialization,
        years_of_experience: Number(formData.years_of_experience || 0),
        highest_qualification: formData.highest_qualification,
        phone: formData.phone,
        professional_bio: formData.professional_bio
      });

      setProfile(formData);
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Failed to update profile.');
    }
  };

  const valueOrDash = (v) => (v || v === 0 ? v : '-');

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div
        className="teacher-main"
        style={{
          backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="teacher-header">
          <h2>Teacher Profile</h2>
        </div>

        {message && <div className="message-alert" style={{ background: isError ? '#ffdede' : '#def7de', color: isError ? '#b30000' : '#106b10' }}>{message}</div>}

        <div className="profile-container">
          <div className="card center-card">
            <img src={teacherProfileImage} alt="Profile" className="avatar" />
            <h3>{valueOrDash(profile.name)}</h3>
            <p>{valueOrDash(profile.designation)} | {valueOrDash(profile.department)}</p>
            <p>{valueOrDash(profile.email)}</p>
          </div>

          <div className="card">
            <h3>Professional Information</h3>
            {!editMode ? (
              <div className="profile-info">
                <p><strong>Employee ID:</strong> {valueOrDash(profile.employee_id)}</p>
                <p><strong>Subject Specialization:</strong> {valueOrDash(profile.subject_specialization)}</p>
                <p><strong>Experience:</strong> {valueOrDash(profile.years_of_experience)} years</p>
                <p><strong>Qualification:</strong> {valueOrDash(profile.highest_qualification)}</p>
                <p><strong>Phone:</strong> {valueOrDash(profile.phone)}</p>
                <p><strong>Bio:</strong> {valueOrDash(profile.professional_bio)}</p>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditMode(true);
                    setFormData(profile);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <input type="text" name="name" placeholder="Teacher Name" value={formData.name} onChange={handleProfileChange} required />
                <input type="text" name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleProfileChange} required />
                <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleProfileChange} />
                <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleProfileChange} />
                <input type="text" name="subject_specialization" placeholder="Subject Specialization" value={formData.subject_specialization} onChange={handleProfileChange} />
                <input type="number" min="0" name="years_of_experience" placeholder="Years of Experience" value={formData.years_of_experience} onChange={handleProfileChange} />
                <input type="text" name="highest_qualification" placeholder="Highest Qualification" value={formData.highest_qualification} onChange={handleProfileChange} />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleProfileChange} />
                <textarea name="professional_bio" placeholder="Professional Bio" value={formData.professional_bio} onChange={handleProfileChange} rows="3" />
                <div className="button-group">
                  <button type="submit" className="btn-save">Save Changes</button>
                  <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
