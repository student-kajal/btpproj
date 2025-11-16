const ProfessorSidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '🏠' },
    { id: 'groups', label: 'My Groups', icon: '👥' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'publications', label: 'Publications', icon: '📄' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="professor-sidebar">
      <div className="sidebar-header">
        <h2>📚 Academic Project</h2>
        <p className="subtitle">Professor Portal</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>© 2025 NSUT Delhi</p>
      </div>
    </div>
  );
};

export default ProfessorSidebar;
