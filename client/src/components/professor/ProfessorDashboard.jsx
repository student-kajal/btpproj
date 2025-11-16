import { useState, useEffect } from 'react';
import ProfessorSidebar from './ProfessorSidebar';
import ProfessorHeader from './ProfessorHeader';
import ProfessorOverview from './ProfessorOverview';
import ProfessorGroups from './ProfessorGroups';
import ProfessorProjects from './ProfessorProjects';
import ProfessorProfile from './ProfessorProfile';
import PublicationManager from './PublicationManager';

const ProfessorDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // ✅ Use this instead of navigate
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ProfessorSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div style={{ flex: 1 }}>
        <ProfessorHeader user={user} onLogout={handleLogout} />
        
        <div style={{ padding: '20px', background: '#f5f7fa', minHeight: 'calc(100vh - 70px)' }}>
          {activeView === 'overview' && <ProfessorOverview user={user} />}
          {activeView === 'groups' && <ProfessorGroups user={user} />}
          {activeView === 'projects' && <ProfessorProjects user={user} />}
          {activeView === 'publications' && <PublicationManager user={user} />}
          {activeView === 'profile' && <ProfessorProfile user={user} />}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
