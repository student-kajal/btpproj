import { useState, useEffect } from 'react';
import axios from 'axios';

const PublicationManager = ({ user }) => {
  const [publications, setPublications] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    doi: '',
    authors: '',
    publishedIn: '',
    publicationDate: '',
    url: '',
    groupId: ''
  });

  useEffect(() => {
    fetchPublications();
    fetchGroups();
  }, []);

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/professor/publications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setPublications(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/professor/groups?status=approved', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setGroups(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.groupId) {
      alert('Please fill required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const authorsArray = formData.authors.split(',').map(a => a.trim());

      const { data } = await axios.post(
        'http://localhost:5000/api/professor/publications',
        { ...formData, authors: authorsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert('Publication added successfully!');
        setShowAddForm(false);
        setFormData({
          title: '',
          doi: '',
          authors: '',
          publishedIn: '',
          publicationDate: '',
          url: '',
          groupId: ''
        });
        fetchPublications();
      }
    } catch (error) {
      alert('Failed to add publication');
    }
  };

  const handleDelete = async (publicationId) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/professor/publications/${publicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Publication deleted');
      fetchPublications();
    } catch (error) {
      alert('Failed to delete publication');
    }
  };

  return (
    <div className="publication-manager">
      <div className="page-header">
        <div>
          <h2>Publications</h2>
          <p>Manage research publications for your groups</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Publication
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading publications...</div>
      ) : publications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Publications Yet</h3>
          <p>Add publications for your research groups</p>
        </div>
      ) : (
        <div className="publications-list">
          {publications.map((pub) => (
            <div key={pub._id} className="publication-card">
              <div className="publication-header">
                <h3>{pub.title}</h3>
                <button className="btn-delete" onClick={() => handleDelete(pub._id)}>
                  🗑️
                </button>
              </div>

              <div className="publication-body">
                {pub.doi && (
                  <p className="pub-doi">
                    <strong>DOI:</strong> {pub.doi}
                  </p>
                )}

                {pub.authors && pub.authors.length > 0 && (
                  <p className="pub-authors">
                    <strong>Authors:</strong> {pub.authors.join(', ')}
                  </p>
                )}

                {pub.publishedIn && (
                  <p className="pub-published">
                    <strong>Published In:</strong> {pub.publishedIn}
                  </p>
                )}

                {pub.publicationDate && (
                  <p className="pub-date">
                    <strong>Date:</strong> {new Date(pub.publicationDate).toLocaleDateString()}
                  </p>
                )}

                {pub.url && (
                  <p className="pub-url">
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      🔗 View Publication
                    </a>
                  </p>
                )}

                <p className="pub-group">
                  <strong>Group:</strong> {pub.group?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content publication-form" onClick={(e) => e.stopPropagation()}>
            <h3>Add Publication</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Group *</label>
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  required
                >
                  <option value="">Select a group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>DOI</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  placeholder="10.1234/example"
                />
              </div>

              <div className="form-group">
                <label>Authors (comma separated)</label>
                <input
                  type="text"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="John Doe, Jane Smith"
                />
              </div>

              <div className="form-group">
                <label>Published In</label>
                <input
                  type="text"
                  value={formData.publishedIn}
                  onChange={(e) => setFormData({ ...formData, publishedIn: e.target.value })}
                  placeholder="Journal name or Conference"
                />
              </div>

              <div className="form-group">
                <label>Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/publication"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-submit">
                  Add Publication
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationManager;
