import React, { useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import '../styles/TeacherNotices.css';
import backgroundImage from '../images/background.jpg';

const TeacherNotices = () => {
  const { isDarkMode } = useTheme();
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Midterm Examination Schedule',
      audience: 'All Students',
      content: 'Midterm examinations will be conducted from September 20-25, 2025. Students must report 15 minutes before the exam starts.',
      date: '2025-09-10',
      priority: 'Important'
    },
    {
      id: 2,
      title: 'Assignment Deadline Extended',
      audience: 'CSE Department',
      content: 'The deadline for the Database Design project has been extended to September 30, 2025.',
      date: '2025-09-08',
      priority: 'Normal'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    audience: 'All',
    content: '',
    priority: 'Normal',
    attachments: []
  });

  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAudience, setFilterAudience] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const attachments = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    setFormData(prev => ({
      ...prev,
      attachments
    }));
  };

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      const newNotice = {
        id: notices.length + 1,
        title: formData.title,
        audience: formData.audience,
        content: formData.content,
        priority: formData.priority,
        attachments: formData.attachments,
        date: new Date().toISOString().split('T')[0]
      };
      setNotices([newNotice, ...notices]);
      setFormData({ title: '', audience: 'All', content: '', priority: 'Normal', attachments: [] });
      setFileInputKey(Date.now());
      alert('Notice posted successfully!');
    }
  };

  const handleDeleteNotice = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const noticeToDelete = notices.find(notice => notice.id === id);
      if (noticeToDelete?.attachments) {
        noticeToDelete.attachments.forEach((attachment) => {
          URL.revokeObjectURL(attachment.url);
        });
      }
      setNotices(notices.filter(notice => notice.id !== id));
      alert('Notice deleted successfully!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterAudience = (e) => {
    setFilterAudience(e.target.value);
  };

  const handleFilterPriority = (e) => {
    setFilterPriority(e.target.value);
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAudience =
      filterAudience === 'All' || notice.audience === filterAudience;
    const matchesPriority =
      filterPriority === 'All' || notice.priority === filterPriority;
    return matchesSearch && matchesAudience && matchesPriority;
  });

  const importantCount = notices.filter((notice) => notice.priority === 'Important').length;

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>Notices & Announcements</h2>
        </div>

        <div className="notice-summary">
          <div>
            <strong>{notices.length}</strong> total notices
          </div>
          <div>
            <strong>{importantCount}</strong> important notice{importantCount !== 1 ? 's' : ''}
          </div>
          <div>
            <strong>{filteredNotices.length}</strong> shown
          </div>
        </div>

        <div className="notice-filters">
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={filterAudience} onChange={handleFilterAudience}>
            <option value="All">All Audiences</option>
            <option value="All Students">All Students</option>
            <option value="CSE Department">CSE Department</option>
            <option value="IT Department">IT Department</option>
            <option value="ECE Department">ECE Department</option>
          </select>
          <select value={filterPriority} onChange={handleFilterPriority}>
            <option value="All">All Priorities</option>
            <option value="Important">Important</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div className="notices-container">
          <div className="card">
            <h3>Post New Notice</h3>
            <form onSubmit={handleAddNotice}>
              <div className="form-group">
                <label>Notice Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Audience</label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                >
                  <option value="All">All Students</option>
                  <option value="CSE Department">CSE Department</option>
                  <option value="IT Department">IT Department</option>
                  <option value="ECE Department">ECE Department</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                </select>
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  placeholder="Enter notice content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Media & Document Attachments</label>
                <input
                  type="file"
                  name="attachments"
                  key={fileInputKey}
                  accept="image/*,audio/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.txt"
                  multiple
                  onChange={handleFileChange}
                />
                {formData.attachments.length > 0 && (
                  <div className="attachment-summary">
                    <p>{formData.attachments.length} file(s) selected:</p>
                    <ul>
                      {formData.attachments.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-post">Post Notice</button>
            </form>
          </div>

          <div className="card">
            <h3>Recent Notices & Announcements</h3>
            <div className="notices-list">
              {filteredNotices.length > 0 ? (
                filteredNotices.map(notice => (
                  <div key={notice.id} className={`notice-item ${notice.priority === 'Important' ? 'important-item' : ''}`}>
                    <div className="notice-header">
                      <h4>{notice.title}</h4>
                      <div className="notice-meta">
                        <span className="badge">{notice.priority}</span>
                        <span className="notice-date">{notice.date}</span>
                      </div>
                    </div>
                    <p className="notice-audience">
                      <strong>Audience:</strong> {notice.audience}
                    </p>
                    <p className="notice-content">{notice.content}</p>
                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="notice-attachments">
                        {notice.attachments.map((attachment, index) => (
                          <div key={index} className="notice-attachment">
                            {attachment.type.startsWith('image/') && (
                              <img src={attachment.url} alt={attachment.name} />
                            )}
                            {attachment.type.startsWith('audio/') && (
                              <audio controls src={attachment.url} />
                            )}
                            {attachment.type.startsWith('video/') && (
                              <video controls src={attachment.url} />
                            )}
                            {!attachment.type.startsWith('image/') && !attachment.type.startsWith('audio/') && !attachment.type.startsWith('video/') && (
                              <a href={attachment.url} target="_blank" rel="noreferrer">{attachment.name}</a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteNotice(notice.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-notices">No notices match the current filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherNotices;


