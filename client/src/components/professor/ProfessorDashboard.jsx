import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../services/api.js';

const ProfessorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.api.get('/professor/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="dashboard-title">Professor Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.stats?.totalGroups || 0}</div>
          <div className="stat-label">Total Groups</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.stats?.pendingGroups || 0}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.stats?.approvedGroups || 0}</div>
          <div className="stat-label">Approved Groups</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.stats?.totalPublications || 0}</div>
          <div className="stat-label">Publications</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="flex gap-2">
            <button className="btn btn-primary">
              👥 Manage Groups
            </button>
            <button className="btn btn-primary">
              📚 Add Publication
            </button>
            <button className="btn btn-primary">
              📊 View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {/* Recent Groups */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Groups</h3>
          </div>
          <div className="card-body">
            {dashboardData?.recent?.groups?.map(group => (
              <div key={group._id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '500' }}>{group.groupName}</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {group.members?.length} members • {group.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Publications */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Publications</h3>
          </div>
          <div className="card-body">
            {dashboardData?.recent?.publications?.map(pub => (
              <div key={pub._id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '500' }}>{pub.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {pub.journal} • {pub.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
