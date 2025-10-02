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



// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
// import Login from './components/auth/Login.jsx';
// import Layout from './components/layout/Layout.jsx';

// // Admin Components
// import AdminDashboard from './components/admin/AdminDashboard.jsx';

// // Professor Components  
// import ProfessorDashboard from './components/professor/ProfessorDashboard.jsx';
// import GroupManagement from './components/professor/GroupManagement.jsx';
// import PublicationManager from './components/professor/PublicationManager.jsx';

// // Student Components (Placeholder)
// import StudentDashboard from './components/student/StudentDashboard.jsx';

// import './App.css';

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-container" style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         flexDirection: 'column',
//         gap: '16px'
//       }}>
//         <div className="spinner"></div>
//         <span>Loading...</span>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// // Main App Content with Routing
// const AppContent = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-container" style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         flexDirection: 'column',
//         gap: '16px'
//       }}>
//         <div className="spinner"></div>
//         <span>Loading application...</span>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         {/* Login Route */}
//         <Route 
//           path="/login" 
//           element={
//             isAuthenticated ? <Navigate to="/" replace /> : <Login />
//           } 
//         />

//         {/* Protected Routes with Layout */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }>
//           {/* Admin Routes */}
//           <Route 
//             path="admin" 
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Professor Routes */}
//           <Route 
//             path="professor" 
//             element={
//               <ProtectedRoute allowedRoles={['professor']}>
//                 <ProfessorDashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="professor/groups" 
//             element={
//               <ProtectedRoute allowedRoles={['professor']}>
//                 <GroupManagement />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="professor/publications" 
//             element={
//               <ProtectedRoute allowedRoles={['professor']}>
//                 <PublicationManager />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Student Routes */}
//           <Route 
//             path="student" 
//             element={
//               <ProtectedRoute allowedRoles={['student']}>
//                 <StudentDashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Default Route - Redirect based on role */}
//           <Route 
//             index 
//             element={<RoleBasedRedirect />} 
//           />
//         </Route>

//         {/* Catch all route */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// // Role-based redirect component
// const RoleBasedRedirect = () => {
//   const { user } = useAuth();
  
//   switch (user?.role) {
//     case 'admin':
//       return <Navigate to="/admin" replace />;
//     case 'professor':
//       return <Navigate to="/professor" replace />;
//     case 'student':
//       return <Navigate to="/student" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// // Main App Component
// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;
