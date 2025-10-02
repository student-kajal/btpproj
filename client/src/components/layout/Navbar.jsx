const Navbar = ({ onLogout }) => {
  return (
    <nav className="w-full h-20 bg-white shadow-md z-50 flex justify-between items-center px-4">
      {/* Logo Section */}
      <div className="flex items-center w-20">
        <img 
          src="/nsut-logo.png" 
          alt="NSUT" 
          className="h-12 w-12 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{ display: 'none', padding: '8px 12px', background: '#3b82f6', color: 'white', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
          NSUT
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
          <img 
            src="/search-icon.svg" 
            alt="Search" 
            className="w-5 h-5 mr-3 opacity-50"
            onError={(e) => {
              e.target.innerHTML = '🔍';
              e.target.style.fontSize = '16px';
            }}
          />
          <input
            type="text"
            placeholder="Search groups, projects, publications..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="btn btn-danger hover:scale-105 transition-transform"
        style={{
          background: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        🚪 Logout
      </button>
    </nav>
  );
};

export default Navbar;
