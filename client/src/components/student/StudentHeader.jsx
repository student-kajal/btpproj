const StudentHeader = ({ user, onLogout }) => {
  return (
    <header style={{
      background: 'white',
      padding: '15px 30px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: 0 }}>Welcome, {user?.name}!</h1>
        <p style={{ margin: '5px 0 0', color: '#6b7280' }}>
          {user?.userId} | {user?.department}
        </p>
      </div>

      <button 
        onClick={onLogout}
        style={{
          padding: '10px 20px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default StudentHeader;
