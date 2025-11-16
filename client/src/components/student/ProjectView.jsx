import { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectView = ({ user }) => {
  const [project, setProject] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/student/my-project', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setProject(data.data.project);
        setPublications(data.data.publications || []);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading project information...</div>;

  if (!project) {
    return (
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📁</div>
        <h2>No Project Assigned</h2>
        <p style={{ color: '#6b7280' }}>
          Your professor will assign a project once your group is approved.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>{project.title}</h2>
        
        {project.description && (
          <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
            {project.description}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>Group</p>
            <p style={{ fontWeight: '600' }}>{project.group?.name}</p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '5px' }}>Professor</p>
            <p style={{ fontWeight: '600' }}>{project.professor?.name}</p>
          </div>
        </div>
      </div>

      {publications.length > 0 && (
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <h3>Publications ({publications.length})</h3>
          
          <div style={{ marginTop: '20px' }}>
            {publications.map((pub) => (
              <div
                key={pub._id}
                style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              >
                <h4 style={{ margin: '0 0 10px' }}>{pub.title}</h4>
                
                {pub.doi && (
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>DOI:</strong> {pub.doi}
                  </p>
                )}
                
                {pub.authors && pub.authors.length > 0 && (
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>Authors:</strong> {pub.authors.join(', ')}
                  </p>
                )}
                
                {pub.publishedIn && (
                  <p style={{ margin: '5px 0', color: '#6b7280', fontSize: '14px' }}>
                    <strong>Published In:</strong> {pub.publishedIn}
                  </p>
                )}
                
                {pub.url && (
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}
                  >
                    🔗 View Publication
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
