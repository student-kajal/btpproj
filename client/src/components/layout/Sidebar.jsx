import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getMenuItems } from './menuItems.js';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openSubMenus, setOpenSubMenus] = useState({});
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = getMenuItems(user?.role || 'student');

  const toggleSubMenu = (title) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (link) => {
    return location.pathname === link;
  };

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header with Collapse Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span className="text-xl">
            {isCollapsed ? '→' : '←'}
          </span>
          {!isCollapsed && (
            <span className="ml-2 text-sm font-medium">Collapse</span>
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              // Submenu Item
              <div>
                <button
                  onClick={() => toggleSubMenu(item.title)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className={`transition-transform ${
                      openSubMenus[item.title] ? 'rotate-90' : 'rotate-0'
                    }`}>
                      ▶
                    </span>
                  )}
                </button>
                
                {/* Submenu Items */}
                {!isCollapsed && openSubMenus[item.title] && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.link}
                        className={`flex items-center p-2 rounded-lg transition-colors text-sm ${
                          isActive(subItem.link)
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <span className="text-base mr-3">{subItem.icon}</span>
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Regular Menu Item
              <Link
                to={item.link}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive(item.link)
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
