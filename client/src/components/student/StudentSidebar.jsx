const StudentSidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '🏠' },
    { id: 'group-formation', label: 'Form Group', icon: '👥' },
    { id: 'my-group', label: 'My Group', icon: '🎯' },
    { id: 'project', label: 'Project', icon: '📁' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div style={{ 
      width: '250px', 
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)', 
      color: 'white',
      padding: '20px'
    }}>
      <h2 style={{ marginBottom: '30px' }}>🎓 Student Portal</h2>
      
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          style={{
            width: '100%',
            padding: '12px',
            margin: '5px 0',
            border: 'none',
            background: activeView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: 'white',
            textAlign: 'left',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
};

export default StudentSidebar;
