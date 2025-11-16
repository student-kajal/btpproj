const ProfessorHeader = ({ user, onLogout }) => {
  return (
    <header className="professor-header">
      <div className="header-left">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Professor'}!</h1>
        <p className="subtitle">{user?.department || 'Department'}</p>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <span>🔔</span>
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'Professor'}</p>
            <p className="user-role">{user?.designation || 'Professor'}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default ProfessorHeader;
