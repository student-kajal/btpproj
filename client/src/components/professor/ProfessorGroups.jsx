import { useState, useEffect } from 'react';
import axios from 'axios';
import GroupCard from './GroupCard';

const ProfessorGroups = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedSession, setSelectedSession] = useState('2024-25');
  const [selectedSemester, setSelectedSemester] = useState('odd');

  useEffect(() => {
    fetchGroups();
  }, [filter, selectedSession, selectedSemester]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = 'http://localhost:5000/api/professor/groups?';
      url += `session=${selectedSession}&semester=${selectedSemester}`;
      if (filter !== 'all') url += `&status=${filter}`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setGroups(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:5000/api/professor/groups/${groupId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert('Group approved successfully!');
        fetchGroups();
      }
    } catch (error) {
      alert('Failed to approve group');
    }
  };

  const handleReject = async (groupId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:5000/api/professor/groups/${groupId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert('Group rejected');
        fetchGroups();
      }
    } catch (error) {
      alert('Failed to reject group');
    }
  };

  const handleAssignProject = async (groupId, projectData) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `http://localhost:5000/api/professor/groups/${groupId}/project`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert('Project assigned successfully!');
        fetchGroups();
      }
    } catch (error) {
      alert('Failed to assign project');
    }
  };

  return (
    <div className="professor-groups">
      <div className="page-header">
        <div>
          <h2>My Groups</h2>
          <p>Manage your assigned student groups</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Session:</label>
          <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Semester:</label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            <option value="odd">Odd</option>
            <option value="even">Even</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Groups</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No Groups Found</h3>
          <p>No groups match your selected filters</p>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onApprove={handleApprove}
              onReject={handleReject}
              onAssignProject={handleAssignProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorGroups;
