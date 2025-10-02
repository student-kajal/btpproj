import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import MainContent from './MainContent.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <Navbar onLogout={handleLogout} />
      
      {/* Main Section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Main Content Area */}
        <MainContent>
          {children || <Outlet />}
        </MainContent>
      </div>
    </div>
  );
};

export default Layout;
