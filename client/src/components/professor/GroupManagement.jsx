import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../common/Modal.jsx';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    projectTitle: '',
    projectDescription: ''
  });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending') {
        const response = await api.api.get('/professor/groups/pending');
        setPendingGroups(response.data.data.groups);
      } else {
        const response = await api.api.get('/professor/groups', {
          params: { status: activeTab === 'all' ? 'all' : activeTab }
        });
        setGroups(response.data.data.groups);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (group) => {
    setSelectedGroup(group);
    setApprovalForm({
      projectTitle: group.projectTitle || '',
      projectDescription: group.projectDescription || ''
    });
    setShowApprovalModal(true);
  };

  const handleReject = (group) => {
    setSelectedGroup(group);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setApprovalForm({
      projectTitle: group.projectTitle || '',
      projectDescription: group.projectDescription || ''
    });
    setShowEditModal(true);
  };

  const submitApproval = async () => {
    try {
      await api.api.put(`/professor/groups/${selectedGroup._id}/approve`, approvalForm);
      alert('Group approved successfully!');
      setShowApprovalModal(false);
      loadData();
    } catch (error) {
      alert('Failed to approve group: ' + error.message);
    }
  };

  const submitRejection = async () => {
    try {
      await api.api.put(`/professor/groups/${selectedGroup._id}/reject`, {
        reason: rejectionReason
      });
      alert('Group rejected successfully!');
      setShowRejectionModal(false);
      loadData();
    } catch (error) {
      alert('Failed to reject group: ' + error.message);
    }
  };

  const submitEdit = async () => {
    try {
      await api.api.put(`/professor/groups/${selectedGroup._id}/project`, approvalForm);
      alert('Project updated successfully!');
      setShowEditModal(false);
      loadData();
    } catch (error) {
      alert('Failed to update project: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#d97706' },
      approved: { bg: '#dcfce7', color: '#166534' },
      rejected: { bg: '#fee2e2', color: '#dc2626' }
    };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '500',
        background: colors[status]?.bg || '#f1f5f9',
        color: colors[status]?.color || '#64748b'
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center" style={{ height: '200px' }}>
          <div className="spinner"></div>
          <span>Loading groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Group Management</h1>
          <p className="dashboard-subtitle">Manage student groups and project assignments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'pending' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'pending' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('pending')}
        >
          🕐 Pending Approval ({pendingGroups.length})
        </button>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'approved' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'approved' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('approved')}
        >
          ✅ Approved
        </button>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'rejected' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'rejected' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('rejected')}
        >
          ❌ Rejected
        </button>
        <button
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'all' ? '#3b82f6' : '#f1f5f9',
            color: activeTab === 'all' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            fontWeight: '500'
          }}
          onClick={() => setActiveTab('all')}
        >
          📋 All Groups
        </button>
      </div>

      {/* Groups List */}
      <div className="card">
        <div className="card-body">
          {activeTab === 'pending' ? (
            // Pending Groups
            pendingGroups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No pending groups</h3>
                <p>All groups have been processed!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {pendingGroups.map(group => (
                  <div key={group._id} className="card" style={{ border: '2px solid #fbbf24' }}>
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>{group.groupName}</h3>
                          <div style={{ marginBottom: '12px' }}>
                            {getStatusBadge(group.status)}
                            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#64748b' }}>
                              Proposed: {new Date(group.proposedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Members:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                              {group.members.map(member => (
                                <div key={member._id} style={{ 
                                  background: '#f8fafc', 
                                  padding: '8px 12px', 
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0'
                                }}>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{member.name}</div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {member.userId} • {member.email}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-success"
                            style={{ padding: '8px 16px' }}
                            onClick={() => handleApprove(group)}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '8px 16px' }}
                            onClick={() => handleReject(group)}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // All Other Groups
            groups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No groups found</h3>
                <p>No groups in {activeTab} status</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {groups.map(group => (
                  <div key={group._id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>{group.groupName}</h3>
                          <div style={{ marginBottom: '12px' }}>
                            {getStatusBadge(group.status)}
                            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#64748b' }}>
                              Updated: {new Date(group.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {group.projectTitle && (
                            <div style={{ marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Project:</h4>
                              <p style={{ color: '#1f2937' }}>{group.projectTitle}</p>
                              {group.projectDescription && (
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                  {group.projectDescription}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {group.rejectionReason && (
                            <div style={{ marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Rejection Reason:</h4>
                              <p style={{ color: '#dc2626', fontSize: '14px' }}>{group.rejectionReason}</p>
                            </div>
                          )}
                          
                          <div style={{ marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Members:</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {group.members.map(member => (
                                <span key={member._id} style={{ 
                                  background: '#f1f5f9', 
                                  padding: '4px 8px', 
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  color: '#1f2937'
                                }}>
                                  {member.name} ({member.userId})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {group.status === 'approved' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '8px 16px', fontSize: '12px' }}
                              onClick={() => handleEdit(group)}
                            >
                              ✏️ Edit Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approve Group & Assign Project"
      >
        <div className="form-group">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-input"
            value={selectedGroup?.groupName || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            className="form-input"
            value={approvalForm.projectTitle}
            onChange={(e) => setApprovalForm({...approvalForm, projectTitle: e.target.value})}
            placeholder="Enter project title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Description</label>
          <textarea
            className="form-input"
            rows="4"
            value={approvalForm.projectDescription}
            onChange={(e) => setApprovalForm({...approvalForm, projectDescription: e.target.value})}
            placeholder="Enter project description..."
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-success" 
            onClick={submitApproval}
            disabled={!approvalForm.projectTitle.trim()}
          >
            ✅ Approve & Assign
          </button>
          <button className="btn btn-secondary" onClick={() => setShowApprovalModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        title="Reject Group"
      >
        <div className="form-group">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-input"
            value={selectedGroup?.groupName || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rejection Reason *</label>
          <textarea
            className="form-input"
            rows="4"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-danger" 
            onClick={submitRejection}
            disabled={!rejectionReason.trim()}
          >
            ❌ Reject Group
          </button>
          <button className="btn btn-secondary" onClick={() => setShowRejectionModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project Details"
      >
        <div className="form-group">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-input"
            value={selectedGroup?.groupName || ''}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            className="form-input"
            value={approvalForm.projectTitle}
            onChange={(e) => setApprovalForm({...approvalForm, projectTitle: e.target.value})}
            placeholder="Enter project title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Description</label>
          <textarea
            className="form-input"
            rows="4"
            value={approvalForm.projectDescription}
            onChange={(e) => setApprovalForm({...approvalForm, projectDescription: e.target.value})}
            placeholder="Enter project description..."
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-primary" 
            onClick={submitEdit}
            disabled={!approvalForm.projectTitle.trim()}
          >
            💾 Update Project
          </button>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupManagement;
