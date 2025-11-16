import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfessorOverview = ({ user }) => {
  const [stats, setStats] = useState({
    totalGroups: 0,
    pendingGroups: 0,
    approvedGroups: 0,
    activeProjects: 0,
    totalStudents: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/professor/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="professor-overview">
      <h2 className="page-title">Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalGroups}</h3>
            <p>Total Groups</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingGroups}</h3>
            <p>Pending Approval</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.approvedGroups}</h3>
            <p>Approved Groups</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats.activeProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorOverview;
