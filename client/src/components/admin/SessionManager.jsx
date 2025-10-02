import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const SessionManager = ({ onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.api.get('/admin/sessions');
      setSessions(response.data.data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure? This will delete the session but NOT the user data.')) return;
    
    try {
      await api.api.delete(`/admin/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      alert('Session deleted successfully!');
    } catch (error) {
      alert('Failed to delete session: ' + error.message);
    }
  };

  const toggleSessionStatus = async (sessionId, currentStatus) => {
    try {
      await api.api.patch(`/admin/sessions/${sessionId}`, {
        isActive: !currentStatus
      });
      setSessions(sessions.map(s => 
        s._id === sessionId ? {...s, isActive: !currentStatus} : s
      ));
    } catch (error) {
      alert('Failed to update session: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📅 Session Management</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading sessions...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Session Year</th>
                  <th>Semester</th>
                  <th>Group Size</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session._id}>
                    <td style={{ fontWeight: '500' }}>{session.sessionYear}</td>
                    <td>{session.semester}</td>
                    <td>{session.minGroupSize}-{session.maxGroupSize}</td>
                    <td style={{ fontSize: '12px' }}>
                      {new Date(session.startDate).toLocaleDateString()} - 
                      {new Date(session.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: session.isActive ? '#dcfce7' : '#fee2e2',
                        color: session.isActive ? '#166534' : '#dc2626',
                        fontSize: '12px'
                      }}>
                        {session.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => toggleSessionStatus(session._id, session.isActive)}
                        >
                          {session.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => deleteSession(session._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
