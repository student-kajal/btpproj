import { useAuth } from '../../hooks/useAuth.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚧 Coming Soon!</h2>
        </div>
        <div className="card-body">
          <p>Student features are under development. You'll soon be able to:</p>
          <ul style={{ marginTop: '16px', paddingLeft: '24px' }}>
            <li>Form and manage your project group</li>
            <li>View assigned projects and professor details</li>
            <li>Access group publications</li>
            <li>Track project progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
