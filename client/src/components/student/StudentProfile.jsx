const StudentProfile = ({ user }) => {
  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '800px' }}>
      <h2>My Profile</h2>
      
      <div style={{ marginTop: '30px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '40px',
          fontWeight: '600',
          margin: '0 auto 30px'
        }}>
          {user?.name?.charAt(0)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Full Name</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.name || 'N/A'}</p>
          </div>

          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Student ID</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.userId || 'N/A'}</p>
          </div>

          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Email</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.email || 'N/A'}</p>
          </div>

          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Department</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.department || 'N/A'}</p>
          </div>

          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Mobile</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.mobile || 'N/A'}</p>
          </div>

          <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Session</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>{user?.session || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
