import { useState, useEffect } from 'react';
import axios from 'axios';

const GroupFormation = ({ user }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([user?.userId || '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/student/propose-group',
        { groupName, members: members.filter(m => m.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setMessage('Group proposed successfully! Waiting for professor approval.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to propose group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '600px' }}>
      <h2>Form Your Group</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Propose a group name and add team members
      </p>

      {message && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          background: message.includes('success') ? '#d1fae5' : '#fee2e2',
          color: message.includes('success') ? '#065f46' : '#dc2626'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Group Name *
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter unique group name"
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Team Members
          </label>
          {members.map((member, index) => (
            <input
              key={index}
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              placeholder="Student ID"
              disabled={index === 0}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            />
          ))}
          <button
            type="button"
            onClick={handleAddMember}
            style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            + Add Member
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {loading ? 'Proposing...' : 'Propose Group'}
        </button>
      </form>
    </div>
  );
};

export default GroupFormation;
