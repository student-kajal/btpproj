import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentOverview = ({ user }) => {
  const [stats, setStats] = useState({
    hasGroup: false,
    groupMembers: 0,
    projectAssigned: false,
    publications: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/student/overview', {
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
    <div>
      <h2>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>{stats.hasGroup ? '✅' : '❌'}</h3>
          <p>Group Status</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>{stats.groupMembers}</h3>
          <p>Team Members</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>{stats.projectAssigned ? '✅' : '⏳'}</h3>
          <p>Project Status</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>{stats.publications}</h3>
          <p>Publications</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Form Group
          </button>
          <button style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            View Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
