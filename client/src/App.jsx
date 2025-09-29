import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Login from './components/auth/Login.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import './App.css';

const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated, user]);

  const handleLoginSuccess = (userData) => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="flex items-center justify-center">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (currentView === 'login' || !isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'professor') {
    return (
      <div className="dashboard-container">
        <h1>Professor Dashboard - Coming Soon!</h1>
        <p>Welcome {user.name}</p>
      </div>
    );
  }

  if (user?.role === 'student') {
    return (
      <div className="dashboard-container">
        <h1>Student Dashboard - Coming Soon!</h1>
        <p>Welcome {user.name}</p>
      </div>
    );
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
