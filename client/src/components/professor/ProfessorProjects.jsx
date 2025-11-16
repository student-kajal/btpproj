import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfessorProjects = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState('2024-25');
  const [selectedSemester, setSelectedSemester] = useState('odd');

  useEffect(() => {
    fetchProjects();
  }, [selectedSession, selectedSemester]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/professor/projects?session=${selectedSession}&semester=${selectedSemester}`;
      
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professor-projects">
      <div className="page-header">
        <div>
          <h2>Projects Overview</h2>
          <p>View and manage group projects</p>
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
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Projects Yet</h3>
          <p>Projects will appear here once you assign them to approved groups</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="project-badge">
                  {project.group?.members?.length || 0} Members
                </span>
              </div>

              <div className="project-body">
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}

                <div className="project-info">
                  <div className="info-item">
                    <span className="label">Group:</span>
                    <span className="value">{project.group?.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Session:</span>
                    <span className="value">{project.session} ({project.semester})</span>
                  </div>
                </div>

                <div className="project-members">
                  <p className="members-label">Team Members:</p>
                  <div className="members-grid">
                    {project.group?.members?.map((member) => (
                      <div key={member._id} className="member-chip">
                        <span className="member-avatar">{member.name?.charAt(0)}</span>
                        <span className="member-name">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="project-actions">
                <button className="btn-edit">✏️ Edit Project</button>
                <button className="btn-publications">📄 Manage Publications</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorProjects;
