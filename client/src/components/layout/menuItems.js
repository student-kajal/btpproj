export const getMenuItems = (role) => {
  switch (role) {
    case 'admin':
      return [
        {
          title: 'Dashboard',
          icon: '📊',
          link: '/admin'
        },
        {
          title: 'Data Management',
          icon: '📁',
          submenu: [
            { title: 'Upload Students', link: '/admin/students', icon: '👨‍🎓' },
            { title: 'Upload Faculty', link: '/admin/faculty', icon: '👨‍🏫' },
            { title: 'Create Session', link: '/admin/sessions', icon: '📅' }
          ]
        },
        {
          title: 'Analytics',
          icon: '📈',
          link: '/admin/analytics'
        },
        {
          title: 'Settings',
          icon: '⚙️',
          submenu: [
            { title: 'User Management', link: '/admin/users', icon: '👥' },
            { title: 'System Logs', link: '/admin/logs', icon: '📋' }
          ]
        }
      ];

    case 'professor':
      return [
        {
          title: 'Dashboard',
          icon: '🏠',
          link: '/professor'
        },
        {
          title: 'Group Management',
          icon: '👥',
          link: '/professor/groups'
        },
        {
          title: 'Publications',
          icon: '📚',
          link: '/professor/publications'
        },
        {
          title: 'Reports',
          icon: '📊',
          submenu: [
            { title: 'Group Progress', link: '/professor/reports/groups', icon: '📈' },
            { title: 'Publication Stats', link: '/professor/reports/publications', icon: '📑' }
          ]
        },
        {
          title: 'Profile',
          icon: '👤',
          link: '/professor/profile'
        }
      ];

    case 'student':
      return [
        {
          title: 'Dashboard',
          icon: '🏠',
          link: '/student'
        },
        {
          title: 'My Group',
          icon: '👥',
          link: '/student/group'
        },
        {
          title: 'Project',
          icon: '📋',
          link: '/student/project'
        },
        {
          title: 'Publications',
          icon: '📚',
          link: '/student/publications'
        },
        {
          title: 'Profile',
          icon: '👤',
          link: '/student/profile'
        }
      ];

    default:
      return [];
  }
};
