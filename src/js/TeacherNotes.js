import React, { useState } from 'react';
import TeacherSidebar from './TeacherSidebar';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import '../styles/TeacherNotes.css';
import backgroundImage from '../images/background.jpg';

const TeacherNotes = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // Sample teacher data - In real app, this would come from auth context
  const teacherSubject = 'Mathematics';

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      batch: 'Class 10 - A',
      uploadDate: '2025-08-24',
      documentType: 'PDF',
      fileName: 'Algebra_Fundamentals.pdf',
      description: 'Complete guide to algebraic equations and expressions'
    },
    {
      id: 2,
      title: 'Geometry Concepts',
      subject: 'Mathematics',
      batch: 'Class 10 - B',
      uploadDate: '2025-08-20',
      documentType: 'DOCX',
      fileName: 'Geometry_Concepts.docx',
      description: 'Introduction to geometric shapes and theorems'
    },
    {
      id: 3,
      title: 'Calculus Module',
      subject: 'Mathematics',
      batch: 'Class 11 - A',
      uploadDate: '2025-08-18',
      documentType: 'Folder',
      fileName: '3 documents',
      description: 'Comprehensive calculus notes with examples'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    batch: '',
    documentType: 'single', // single, multiple, folder
    description: '',
    files: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  const batches = ['All', 'Class 10 - A', 'Class 10 - B', 'Class 11 - A', 'Class 11 - B', 'Class 12 - A'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: selectedFiles
    }));
  };

  const handleAddNotes = (e) => {
    e.preventDefault();

    if (formData.title && formData.batch && formData.files.length > 0) {
      const fileNames = formData.files.length > 1 
        ? `${formData.files.length} documents`
        : formData.files[0].name;

      const getFileType = () => {
        if (formData.files.length > 1) return 'Folder';
        const ext = formData.files[0].name.split('.').pop().toUpperCase();
        return ext === 'PDF' ? 'PDF' : ext === 'DOCX' ? 'DOCX' : 'DOC';
      };

      const newNote = {
        id: notes.length + 1,
        title: formData.title,
        subject: teacherSubject,
        batch: formData.batch,
        uploadDate: new Date().toISOString().split('T')[0],
        documentType: getFileType(),
        fileName: fileNames,
        description: formData.description
      };

      setNotes([newNote, ...notes]);
      setFormData({
        title: '',
        batch: '',
        documentType: 'single',
        description: '',
        files: []
      });
      alert('Notes uploaded successfully!');
    } else {
      alert('Please fill all required fields and select at least one file.');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesBatch = selectedBatch === 'All' || note.batch === selectedBatch;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleDownloadNote = (fileName) => {
    // In a real application, this would trigger an actual download
    alert(`Downloading ${fileName}...`);
  };

  return (
    <div className={`teacher-layout ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="teacher-main" style={{backgroundImage: isDarkMode ? 'none' : `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="teacher-header">
          <h2>📚 Study Notes</h2>
          <p className="subject-info">Subject: <strong>{teacherSubject}</strong></p>
        </div>

        <div className="notes-container">
          {/* Upload Notes Card */}
          <div className="card">
            <h3>📤 Upload Notes</h3>
            <form onSubmit={handleAddNotes}>
              <div className="form-row">
                <div className="form-group">
                  <label>Notes Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Calculus Fundamentals"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Batch/Audience *</label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Batch/Class</option>
                    <option value="Class 10 - A">Class 10 - A</option>
                    <option value="Class 10 - B">Class 10 - B</option>
                    <option value="Class 11 - A">Class 11 - A</option>
                    <option value="Class 11 - B">Class 11 - B</option>
                    <option value="Class 12 - A">Class 12 - A</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Add a brief description about these notes..."
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Upload Document(s) *</label>
                <p className="file-help-text">
                  Supported formats: PDF, DOCX, DOC. You can upload single or multiple files.
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                  required
                />
                {formData.files.length > 0 && (
                  <div className="files-preview">
                    <p className="files-count">{formData.files.length} file(s) selected:</p>
                    <ul>
                      {Array.from(formData.files).map((file, index) => (
                        <li key={index}>📄 {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-upload">📤 Upload Notes</button>
            </form>
          </div>

          {/* Notes List Card */}
          <div className="card">
            <h3>📖 All Notes</h3>

            <div className="notes-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search notes by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="batch-filter">
                <label>Filter by Batch:</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="batch-select"
                >
                  {batches.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="notes-grid">
                {filteredNotes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <h4>{note.title}</h4>
                      <span className={`badge badge-${note.documentType.toLowerCase()}`}>
                        {note.documentType}
                      </span>
                    </div>

                    <div className="note-meta">
                      <div className="meta-item">
                        <span className="meta-label">Batch:</span>
                        <span className="meta-value">{note.batch}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Date:</span>
                        <span className="meta-value">{note.uploadDate}</span>
                      </div>
                    </div>

                    {note.description && (
                      <p className="note-description">{note.description}</p>
                    )}

                    <div className="note-file-info">
                      <span className="file-icon">📎</span>
                      <span className="file-name">{note.fileName}</span>
                    </div>

                    <div className="note-actions">
                      <button 
                        className="btn-action btn-download"
                        onClick={() => handleDownloadNote(note.fileName)}
                      >
                        ⬇️ Download
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-notes">
                <p>📭 No notes found. Create your first note to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherNotes;


