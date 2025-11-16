import { useState, useEffect } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import StudentOverview from './StudentOverview';
import GroupFormation from './GroupFormation';
import MyGroup from './MyGroup';
import ProjectView from './ProjectView';
import StudentProfile from './StudentProfile';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <StudentSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div style={{ flex: 1 }}>
        <StudentHeader user={user} onLogout={handleLogout} />
        
        <div style={{ padding: '20px', background: '#f5f7fa', minHeight: 'calc(100vh - 70px)' }}>
          {activeView === 'overview' && <StudentOverview user={user} />}
          {activeView === 'group-formation' && <GroupFormation user={user} />}
          {activeView === 'my-group' && <MyGroup user={user} />}
          {activeView === 'project' && <ProjectView user={user} />}
          {activeView === 'profile' && <StudentProfile user={user} />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
