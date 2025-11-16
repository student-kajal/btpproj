const ProfessorProfile = ({ user }) => {
  return (
    <div className="professor-profile">
      <h2>Profile Settings</h2>
      
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0) || 'P'}
          </div>
        </div>

        <div className="profile-info-section">
          <div className="info-group">
            <label>Full Name</label>
            <p>{user?.name || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>Staff ID</label>
            <p>{user?.staffId || user?.userId || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>Department</label>
            <p>{user?.department || 'N/A'}</p>
          </div>

          <div className="info-group">
            <label>Designation</label>
            <p>{user?.designation || 'Professor'}</p>
          </div>

          <div className="info-group">
            <label>Mobile</label>
            <p>{user?.mobile || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;
