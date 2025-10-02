import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../common/Modal.jsx';

const PublicationManager = () => {
  const [publications, setPublications] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [publicationForm, setPublicationForm] = useState({
    doi: '',
    title: '',
    authors: [''],
    journal: '',
    year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    publishedDate: '',
    groupId: '',
    session: '2024-25',
    semester: 'odd'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [publicationsRes, groupsRes] = await Promise.all([
        api.api.get('/professor/publications'),
        api.api.get('/professor/groups', { params: { status: 'approved' } })
      ]);
      setPublications(publicationsRes.data.data.publications);
      setGroups(groupsRes.data.data.groups);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPublicationForm({
      doi: '',
      title: '',
      authors: [''],
      journal: '',
      year: new Date().getFullYear(),
      volume: '',
      issue: '',
      pages: '',
      publishedDate: '',
      groupId: '',
      session: '2024-25',
      semester: 'odd'
    });
  };

  const handleAddAuthor = () => {
    setPublicationForm({
      ...publicationForm,
      authors: [...publicationForm.authors, '']
    });
  };

  const handleRemoveAuthor = (index) => {
    if (publicationForm.authors.length > 1) {
      setPublicationForm({
        ...publicationForm,
        authors: publicationForm.authors.filter((_, i) => i !== index)
      });
    }
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...publicationForm.authors];
    newAuthors[index] = value;
    setPublicationForm({
      ...publicationForm,
      authors: newAuthors
    });
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (publication) => {
    setSelectedPublication(publication);
    setPublicationForm({
      doi: publication.doi,
      title: publication.title,
      authors: publication.authors,
      journal: publication.journal,
      year: publication.year,
      volume: publication.volume || '',
      issue: publication.issue || '',
      pages: publication.pages || '',
      publishedDate: publication.publishedDate ? 
        new Date(publication.publishedDate).toISOString().split('T')[0] : '',
      groupId: publication.group?._id || '',
      session: publication.session,
      semester: publication.semester
    });
    setShowEditModal(true);
  };

  const handleDelete = async (publication) => {
    if (confirm('Are you sure you want to delete this publication?')) {
      try {
        await api.api.delete(`/professor/publications/${publication._id}`);
        alert('Publication deleted successfully!');
        loadData();
      } catch (error) {
        alert('Failed to delete publication: ' + error.message);
      }
    }
  };

  const submitAdd = async () => {
    try {
      const formData = {
        ...publicationForm,
        authors: publicationForm.authors.filter(author => author.trim()),
        groupId: publicationForm.groupId || undefined
      };
      
      await api.api.post('/professor/publications', formData);
      alert('Publication added successfully!');
      setShowAddModal(false);
      loadData();
    } catch (error) {
      alert('Failed to add publication: ' + error.response?.data?.message || error.message);
    }
  };

  const submitEdit = async () => {
    try {
      const formData = {
        ...publicationForm,
        authors: publicationForm.authors.filter(author => author.trim()),
        groupId: publicationForm.groupId || undefined
      };
      
      await api.api.put(`/professor/publications/${selectedPublication._id}`, formData);
      alert('Publication updated successfully!');
      setShowEditModal(false);
      loadData();
    } catch (error) {
      alert('Failed to update publication: ' + error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center" style={{ height: '200px' }}>
          <div className="spinner"></div>
          <span>Loading publications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Publication Management</h1>
          <p className="dashboard-subtitle">Manage your research publications and DOIs</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleAdd}
        >
          ➕ Add Publication
        </button>
      </div>

      {/* Publications List */}
      <div className="card">
        <div className="card-body">
          {publications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <h3>No publications yet</h3>
              <p>Add your first research publication to get started!</p>
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
                style={{ marginTop: '16px' }}
              >
                ➕ Add Publication
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {publications.map(publication => (
                <div key={publication._id} className="card" style={{ border: '1px solid #e2e8f0' }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '18px' }}>
                          {publication.title}
                        </h3>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <strong>Authors:</strong> {publication.authors.join(', ')}
                        </div>
                        
                        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
                          <strong>Journal:</strong> {publication.journal} • <strong>Year:</strong> {publication.year}
                          {publication.volume && (
                            <> • <strong>Volume:</strong> {publication.volume}</>
                          )}
                          {publication.issue && (
                            <> • <strong>Issue:</strong> {publication.issue}</>
                          )}
                          {publication.pages && (
                            <> • <strong>Pages:</strong> {publication.pages}</>
                          )}
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <strong>DOI:</strong> 
                          <a 
                            href={`https://doi.org/${publication.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#3b82f6', 
                              textDecoration: 'none', 
                              marginLeft: '8px',
                              fontSize: '14px',
                              fontFamily: 'monospace'
                            }}
                          >
                            {publication.doi} ↗
                          </a>
                        </div>
                        
                        {publication.group && (
                          <div style={{ marginBottom: '8px' }}>
                            <span style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              📚 Group: {publication.group.groupName}
                            </span>
                          </div>
                        )}
                        
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Added: {new Date(publication.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                          onClick={() => handleEdit(publication)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                          onClick={() => handleDelete(publication)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Publication Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Publication"
      >
        <div className="form-group">
          <label className="form-label">DOI *</label>
          <input
            type="text"
            className="form-input"
            value={publicationForm.doi}
            onChange={(e) => setPublicationForm({...publicationForm, doi: e.target.value})}
            placeholder="10.1000/xyz123"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={publicationForm.title}
            onChange={(e) => setPublicationForm({...publicationForm, title: e.target.value})}
            placeholder="Publication title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Authors *</label>
          {publicationForm.authors.map((author, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                placeholder={`Author ${index + 1}...`}
                style={{ flex: 1 }}
              />
              {publicationForm.authors.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ padding: '8px' }}
                  onClick={() => handleRemoveAuthor(index)}
                >
                  ➖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={handleAddAuthor}
          >
            ➕ Add Author
          </button>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Journal *</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.journal}
              onChange={(e) => setPublicationForm({...publicationForm, journal: e.target.value})}
              placeholder="Journal name..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Year *</label>
            <input
              type="number"
              className="form-input"
              value={publicationForm.year}
              onChange={(e) => setPublicationForm({...publicationForm, year: parseInt(e.target.value)})}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Volume</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.volume}
              onChange={(e) => setPublicationForm({...publicationForm, volume: e.target.value})}
              placeholder="Volume..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Issue</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.issue}
              onChange={(e) => setPublicationForm({...publicationForm, issue: e.target.value})}
              placeholder="Issue..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Pages</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.pages}
              onChange={(e) => setPublicationForm({...publicationForm, pages: e.target.value})}
              placeholder="1-10"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Published Date</label>
          <input
            type="date"
            className="form-input"
            value={publicationForm.publishedDate}
            onChange={(e) => setPublicationForm({...publicationForm, publishedDate: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assign to Group (Optional)</label>
          <select
            className="form-select"
            value={publicationForm.groupId}
            onChange={(e) => setPublicationForm({...publicationForm, groupId: e.target.value})}
          >
            <option value="">No group assignment</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>
                {group.groupName} ({group.members.length} members)
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-success" 
            onClick={submitAdd}
            disabled={!publicationForm.doi || !publicationForm.title || !publicationForm.journal}
          >
            ➕ Add Publication
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Publication Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Publication"
      >
        {/* Same form fields as Add Modal */}
        <div className="form-group">
          <label className="form-label">DOI *</label>
          <input
            type="text"
            className="form-input"
            value={publicationForm.doi}
            onChange={(e) => setPublicationForm({...publicationForm, doi: e.target.value})}
            placeholder="10.1000/xyz123"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={publicationForm.title}
            onChange={(e) => setPublicationForm({...publicationForm, title: e.target.value})}
            placeholder="Publication title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Authors *</label>
          {publicationForm.authors.map((author, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                placeholder={`Author ${index + 1}...`}
                style={{ flex: 1 }}
              />
              {publicationForm.authors.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ padding: '8px' }}
                  onClick={() => handleRemoveAuthor(index)}
                >
                  ➖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={handleAddAuthor}
          >
            ➕ Add Author
          </button>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Journal *</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.journal}
              onChange={(e) => setPublicationForm({...publicationForm, journal: e.target.value})}
              placeholder="Journal name..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Year *</label>
            <input
              type="number"
              className="form-input"
              value={publicationForm.year}
              onChange={(e) => setPublicationForm({...publicationForm, year: parseInt(e.target.value)})}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Volume</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.volume}
              onChange={(e) => setPublicationForm({...publicationForm, volume: e.target.value})}
              placeholder="Volume..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Issue</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.issue}
              onChange={(e) => setPublicationForm({...publicationForm, issue: e.target.value})}
              placeholder="Issue..."
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Pages</label>
            <input
              type="text"
              className="form-input"
              value={publicationForm.pages}
              onChange={(e) => setPublicationForm({...publicationForm, pages: e.target.value})}
              placeholder="1-10"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Published Date</label>
          <input
            type="date"
            className="form-input"
            value={publicationForm.publishedDate}
            onChange={(e) => setPublicationForm({...publicationForm, publishedDate: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assign to Group (Optional)</label>
          <select
            className="form-select"
            value={publicationForm.groupId}
            onChange={(e) => setPublicationForm({...publicationForm, groupId: e.target.value})}
          >
            <option value="">No group assignment</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>
                {group.groupName} ({group.members.length} members)
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-primary" 
            onClick={submitEdit}
            disabled={!publicationForm.doi || !publicationForm.title || !publicationForm.journal}
          >
            💾 Update Publication
          </button>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PublicationManager;
