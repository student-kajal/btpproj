import { useState, useEffect } from 'react';
import axios from 'axios';

const MyGroup = ({ user }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/student/my-group', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setGroup(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading group information...</div>;

  if (!group) {
    return (
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>👥</div>
        <h2>No Group Yet</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          You haven't formed a group yet. Start by proposing a group!
        </p>
        <button
          onClick={() => window.location.href = '#group-formation'}
          style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Form Group
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#d97706' },
      approved: { bg: '#d1fae5', color: '#059669' },
      rejected: { bg: '#fee2e2', color: '#dc2626' }
    };
    const style = colors[group.status] || colors.pending;
    
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.color
      }}>
        {group.status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>{group.name}</h2>
          {getStatusBadge()}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>Session</p>
            <p style={{ fontWeight: '600' }}>{group.session}</p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>Semester</p>
            <p style={{ fontWeight: '600' }}>{group.semester}</p>
          </div>
        </div>

        {group.professor && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>Assigned Professor</p>
            <p style={{ fontWeight: '600', fontSize: '18px' }}>{group.professor.name}</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>{group.professor.email}</p>
          </div>
        )}
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
        <h3>Team Members ({group.members?.length || 0})</h3>
        
        <div style={{ marginTop: '20px' }}>
          {group.members?.map((member, index) => (
            <div
              key={member._id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginRight: '15px'
              }}>
                {member.name?.charAt(0)}
              </div>
              
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>{member.name}</p>
                <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: '14px' }}>
                  {member.userId} | {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyGroup;
