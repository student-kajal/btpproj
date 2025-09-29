import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../services/api.js';
import Modal from '../common/Modal.jsx';
import FileUpload from '../common/FileUpload.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const { user, logout } = useAuth();

  // Form states
  const [studentFile, setStudentFile] = useState(null);
  const [facultyFile, setFacultyFile] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    sessionYear: '2024-25',
    semester: 'odd',
    minGroupSize: 2,
    maxGroupSize: 4,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.getAdminDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

//   const handleUploadStudents = async () => {
//     if (!studentFile) {
//       alert('Please select a file first');
//       return;
//     }

//     setUploadProgress(true);
//     setUploadResults(null);

//     try {
//       const response = await api.uploadStudents(
//         studentFile, 
//         sessionForm.sessionYear, 
//         sessionForm.semester
//       );
      
//       setUploadResults(response.data);
//       loadDashboard(); // Refresh stats
//     } catch (error) {
//       setUploadResults({
//         success: 0,
//         errors: ['Upload failed: ' + (error.response?.data?.message || error.message)],
//         duplicates: 0
//       });
//     } finally {
//       setUploadProgress(false);
//     }
//   };
const handleUploadStudents = async () => {
  if (!studentFile) {
    alert('Please select a file first');
    return;
  }

  setUploadProgress(true);
  setUploadResults(null);

  try {
    const response = await api.uploadStudents(
      studentFile, 
      sessionForm.sessionYear, 
      sessionForm.semester
    );
    
    console.log('Upload response:', response); // Debug log
    setUploadResults(response.data);
    
    // Refresh dashboard stats
    loadDashboard();
    
    // Success message
    if (response.data.success > 0) {
      alert(`Successfully uploaded ${response.data.success} students!`);
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    setUploadResults({
      success: 0,
      errors: ['Upload failed: ' + (error.response?.data?.message || error.message)],
      duplicates: 0
    });
  } finally {
    setUploadProgress(false);
  }
};

  const handleUploadFaculty = async () => {
    if (!facultyFile) {
      alert('Please select a file first');
      return;
    }

    setUploadProgress(true);
    setUploadResults(null);

    try {
      const response = await api.uploadFaculty(
        facultyFile, 
        sessionForm.sessionYear, 
        sessionForm.semester
      );
      
      setUploadResults(response.data);
      loadDashboard(); // Refresh stats
    } catch (error) {
      setUploadResults({
        success: 0,
        errors: ['Upload failed: ' + (error.response?.data?.message || error.message)],
        duplicates: 0
      });
    } finally {
      setUploadProgress(false);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.startDate || !sessionForm.endDate) {
      alert('Please fill all required fields');
      return;
    }

    setUploadProgress(true);

    try {
      await api.post('/admin/sessions', sessionForm);
      alert('Session created successfully!');
      setActiveModal(null);
      setSessionForm({
        sessionYear: '2024-25',
        semester: 'odd',
        minGroupSize: 2,
        maxGroupSize: 4,
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      alert('Failed to create session: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadProgress(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setUploadResults(null);
    setStudentFile(null);
    setFacultyFile(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center" style={{ height: '200px' }}>
          <div className="spinner"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
        </div>
        <button 
          className="btn btn-danger" 
          onClick={logout}
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.totalStudents || 0}</div>
          <div className="stat-label">Students</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProfessors || 0}</div>
          <div className="stat-label">Professors</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.totalGroups || 0}</div>
          <div className="stat-label">Total Groups</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.activeGroups || 0}</div>
          <div className="stat-label">Active Groups</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProjects || 0}</div>
          <div className="stat-label">Total Projects</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={() => setActiveModal('uploadStudents')}
            >
              📚 Upload Students
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveModal('uploadFaculty')}
            >
              👨‍🏫 Upload Faculty
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveModal('createSession')}
            >
              📅 Create Session
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => alert('Analytics feature coming soon!')}
            >
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Upload Students Modal */}
      <Modal
        isOpen={activeModal === 'uploadStudents'}
        onClose={closeModal}
        title="Upload Students Data"
      >
        <div className="form-group">
          <label className="form-label">Session Year</label>
          <input
            type="text"
            className="form-input"
            value={sessionForm.sessionYear}
            onChange={(e) => setSessionForm({...sessionForm, sessionYear: e.target.value})}
            placeholder="e.g., 2024-25"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={sessionForm.semester}
            onChange={(e) => setSessionForm({...sessionForm, semester: e.target.value})}
          >
            <option value="odd">Odd Semester</option>
            <option value="even">Even Semester</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Excel File</label>
          <FileUpload
            accept=".xlsx,.xls,.csv"
            onFileSelect={setStudentFile}
          >
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {studentFile ? (
                <div>
                  <p style={{ color: '#10b981', fontWeight: '500' }}>
                    ✓ {studentFile.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>
                    📁 Drop Excel file here or click to browse
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Supports .xlsx, .xls, .csv files
                  </p>
                </div>
              )}
            </div>
          </FileUpload>
        </div>

        {uploadProgress && (
          <div className="upload-results">
            <div className="flex items-center gap-2">
              <div className="spinner"></div>
              <span>Uploading students data...</span>
            </div>
          </div>
        )}

        {uploadResults && (
          <div className="upload-results">
            {uploadResults.success > 0 && (
              <div className="upload-success">
                ✅ Successfully uploaded {uploadResults.success} students
              </div>
            )}
            
            {uploadResults.duplicates > 0 && (
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
                ⚠️ {uploadResults.duplicates} duplicate entries found (skipped)
              </div>
            )}
            
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="upload-errors">
                ❌ Errors found:
                <ul className="upload-error-list">
                  {uploadResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-success" 
            onClick={handleUploadStudents}
            disabled={uploadProgress || !studentFile}
          >
            Upload Students
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Upload Faculty Modal */}
      <Modal
        isOpen={activeModal === 'uploadFaculty'}
        onClose={closeModal}
        title="Upload Faculty Data"
      >
        <div className="form-group">
          <label className="form-label">Session Year</label>
          <input
            type="text"
            className="form-input"
            value={sessionForm.sessionYear}
            onChange={(e) => setSessionForm({...sessionForm, sessionYear: e.target.value})}
            placeholder="e.g., 2024-25"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={sessionForm.semester}
            onChange={(e) => setSessionForm({...sessionForm, semester: e.target.value})}
          >
            <option value="odd">Odd Semester</option>
            <option value="even">Even Semester</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Excel File</label>
          <FileUpload
            accept=".xlsx,.xls,.csv"
            onFileSelect={setFacultyFile}
          >
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {facultyFile ? (
                <div>
                  <p style={{ color: '#10b981', fontWeight: '500' }}>
                    ✓ {facultyFile.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>
                    📁 Drop Excel file here or click to browse
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    Supports .xlsx, .xls, .csv files
                  </p>
                </div>
              )}
            </div>
          </FileUpload>
        </div>

        {uploadProgress && (
          <div className="upload-results">
            <div className="flex items-center gap-2">
              <div className="spinner"></div>
              <span>Uploading faculty data...</span>
            </div>
          </div>
        )}

        {uploadResults && (
          <div className="upload-results">
            {uploadResults.success > 0 && (
              <div className="upload-success">
                ✅ Successfully uploaded {uploadResults.success} faculty members
              </div>
            )}
            
            {uploadResults.duplicates > 0 && (
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
                ⚠️ {uploadResults.duplicates} duplicate entries found (skipped)
              </div>
            )}
            
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="upload-errors">
                ❌ Errors found:
                <ul className="upload-error-list">
                  {uploadResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-success" 
            onClick={handleUploadFaculty}
            disabled={uploadProgress || !facultyFile}
          >
            Upload Faculty
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Create Session Modal */}
      <Modal
        isOpen={activeModal === 'createSession'}
        onClose={closeModal}
        title="Create New Session"
      >
        <div className="form-group">
          <label className="form-label">Session Year</label>
          <input
            type="text"
            className="form-input"
            value={sessionForm.sessionYear}
            onChange={(e) => setSessionForm({...sessionForm, sessionYear: e.target.value})}
            placeholder="e.g., 2024-25"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Semester</label>
          <select
            className="form-select"
            value={sessionForm.semester}
            onChange={(e) => setSessionForm({...sessionForm, semester: e.target.value})}
          >
            <option value="odd">Odd Semester</option>
            <option value="even">Even Semester</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Min Group Size</label>
            <input
              type="number"
              className="form-input"
              value={sessionForm.minGroupSize}
              onChange={(e) => setSessionForm({...sessionForm, minGroupSize: parseInt(e.target.value)})}
              min="1"
              max="10"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Max Group Size</label>
            <input
              type="number"
              className="form-input"
              value={sessionForm.maxGroupSize}
              onChange={(e) => setSessionForm({...sessionForm, maxGroupSize: parseInt(e.target.value)})}
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={sessionForm.startDate}
              onChange={(e) => setSessionForm({...sessionForm, startDate: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={sessionForm.endDate}
              onChange={(e) => setSessionForm({...sessionForm, endDate: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-success" 
            onClick={handleCreateSession}
            disabled={uploadProgress}
          >
            {uploadProgress ? 'Creating...' : 'Create Session'}
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
