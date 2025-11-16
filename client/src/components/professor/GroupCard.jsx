import { useState } from 'react';

const GroupCard = ({ group, onApprove, onReject, onAssignProject }) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState(group.project?.title || '');
  const [projectDesc, setProjectDesc] = useState(group.project?.description || '');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleAssignProject = () => {
    if (!projectTitle.trim()) {
      alert('Please enter project title');
      return;
    }
    onAssignProject(group._id, { title: projectTitle, description: projectDesc });
    setShowProjectForm(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }
    onReject(group._id, rejectReason);
    setShowRejectForm(false);
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red'
    };
    return (
      <span className={`status-badge ${statusColors[group.status]}`}>
        {group.status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="group-card">
      <div className="group-card-header">
        <h3>{group.name}</h3>
        {getStatusBadge()}
      </div>

      <div className="group-card-body">
        <div className="info-row">
          <span className="label">Members:</span>
          <span className="value">{group.members?.length || 0}</span>
        </div>

        <div className="members-list">
          {group.members?.slice(0, 3).map((member) => (
            <div key={member._id} className="member-item">
              <span className="member-avatar">{member.name?.charAt(0)}</span>
              <div>
                <p className="member-name">{member.name}</p>
                <p className="member-id">{member.userId}</p>
              </div>
            </div>
          ))}
          {group.members?.length > 3 && (
            <p className="more-members">+{group.members.length - 3} more</p>
          )}
        </div>

        {group.project ? (
          <div className="project-info">
            <p className="label">Project:</p>
            <p className="project-title">{group.project.title}</p>
          </div>
        ) : (
          <p className="no-project">No project assigned</p>
        )}
      </div>

      <div className="group-card-actions">
        {group.status === 'pending' && (
          <>
            <button className="btn-approve" onClick={() => onApprove(group._id)}>
              ✓ Approve
            </button>
            <button className="btn-reject" onClick={() => setShowRejectForm(true)}>
              ✗ Reject
            </button>
          </>
        )}
        
        {group.status === 'approved' && (
          <button className="btn-assign" onClick={() => setShowProjectForm(true)}>
            {group.project ? '✏️ Edit Project' : '+ Assign Project'}
          </button>
        )}
      </div>

      {showProjectForm && (
        <div className="modal-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Project</h3>
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Enter project description"
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleAssignProject}>
                Save Project
              </button>
              <button className="btn-cancel" onClick={() => setShowProjectForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectForm && (
        <div className="modal-overlay" onClick={() => setShowRejectForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Group</h3>
            <div className="form-group">
              <label>Reason for Rejection *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-submit btn-danger" onClick={handleReject}>
                Confirm Reject
              </button>
              <button className="btn-cancel" onClick={() => setShowRejectForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCard;
