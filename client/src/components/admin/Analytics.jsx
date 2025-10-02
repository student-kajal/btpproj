// import { useState, useEffect } from 'react';
// import api from '../../services/api.js';

// const Analytics = ({ onClose }) => {
//   const [analytics, setAnalytics] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [filters, setFilters] = useState({
//     session: '2024-25',
//     semester: 'odd',
//     role: 'all',
//     search: ''
//   });

//   useEffect(() => {
//     loadAnalytics();
//   }, [filters.session, filters.semester]);

//   const loadAnalytics = async () => {
//     try {
//       setLoading(true);
//       const response = await api.api.get('/admin/analytics', {
//         params: {
//           session: filters.session,
//           semester: filters.semester
//         }
//       });
//       setAnalytics(response.data.data);
//       setUsers(response.data.data.allUsers || []);
//     } catch (error) {
//       console.error('Failed to load analytics:', error);
//       alert('Failed to load analytics data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     if (filters.role !== 'all' && user.role !== filters.role) return false;
//     if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) && 
//         !user.email.toLowerCase().includes(filters.search.toLowerCase())) return false;
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="modal-overlay" onClick={onClose}>
//         <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'center' }}>
//           <div className="spinner"></div>
//           <span>Loading analytics...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div 
//         className="modal-content" 
//         style={{ maxWidth: '95vw', width: '1200px', maxHeight: '90vh' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-header">
//           <h2 className="modal-title">📊 Analytics & Data Management</h2>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>
        
//         <div className="modal-body">
//           {/* Filters */}
//           <div className="flex gap-2 mb-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
//             <select
//               value={filters.session}
//               onChange={(e) => setFilters({...filters, session: e.target.value})}
//               className="form-select"
//               style={{ width: '120px' }}
//             >
//               <option value="2024-25">2024-25</option>
//               <option value="2023-24">2023-24</option>
//               <option value="2025-26">2025-26</option>
//             </select>
            
//             <select
//               value={filters.semester}
//               onChange={(e) => setFilters({...filters, semester: e.target.value})}
//               className="form-select"
//               style={{ width: '120px' }}
//             >
//               <option value="odd">Odd Sem</option>
//               <option value="even">Even Sem</option>
//             </select>
            
//             <button 
//               className="btn btn-success"
//               onClick={loadAnalytics}
//             >
//               🔄 Refresh
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-2 mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
//             <button
//               style={{
//                 padding: '8px 16px',
//                 border: 'none',
//                 background: activeTab === 'overview' ? '#3b82f6' : '#f1f5f9',
//                 color: activeTab === 'overview' ? 'white' : 'black',
//                 cursor: 'pointer',
//                 borderRadius: '4px 4px 0 0'
//               }}
//               onClick={() => setActiveTab('overview')}
//             >
//               📈 Overview
//             </button>
//             <button
//               style={{
//                 padding: '8px 16px',
//                 border: 'none',
//                 background: activeTab === 'users' ? '#3b82f6' : '#f1f5f9',
//                 color: activeTab === 'users' ? 'white' : 'black',
//                 cursor: 'pointer',
//                 borderRadius: '4px 4px 0 0'
//               }}
//               onClick={() => setActiveTab('users')}
//             >
//               👥 All Users ({users.length})
//             </button>
//             <button
//               style={{
//                 padding: '8px 16px',
//                 border: 'none',
//                 background: activeTab === 'departments' ? '#3b82f6' : '#f1f5f9',
//                 color: activeTab === 'departments' ? 'white' : 'black',
//                 cursor: 'pointer',
//                 borderRadius: '4px 4px 0 0'
//               }}
//               onClick={() => setActiveTab('departments')}
//             >
//               🏛️ Departments
//             </button>
//           </div>

//           {/* Overview Tab */}
//           {activeTab === 'overview' && analytics && (
//             <div>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
//                 <div className="stat-card">
//                   <div className="stat-number">{analytics.overview.totalUsers}</div>
//                   <div className="stat-label">Total Users</div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-number">{analytics.overview.totalStudents}</div>
//                   <div className="stat-label">Students</div>
//                 </div>
//                 <div className="stat-card">
//                   <div className="stat-number">{analytics.overview.totalProfessors}</div>
//                   <div className="stat-label">Professors</div>
//                 </div>
//               </div>

//               {/* Category Distribution */}
//               {Object.keys(analytics.categoryStats).length > 0 && (
//                 <div className="card mb-4">
//                   <div className="card-header">
//                     <h3>📊 Student Categories</h3>
//                   </div>
//                   <div className="card-body">
//                     <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
//                       {Object.entries(analytics.categoryStats).map(([category, count]) => (
//                         <div key={category} style={{ background: '#dbeafe', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
//                           <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{count}</div>
//                           <div style={{ fontSize: '14px' }}>{category}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Recent Uploads */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
//                 <div className="card">
//                   <div className="card-header">
//                     <h3>🆕 Recent Students</h3>
//                   </div>
//                   <div className="card-body">
//                     {analytics.recentUploads.students.slice(0, 5).map(student => (
//                       <div key={student._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
//                         <span style={{ fontWeight: '500' }}>{student.name}</span>
//                         <span style={{ fontSize: '12px', color: '#64748b' }}>
//                           {new Date(student.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="card">
//                   <div className="card-header">
//                     <h3>🆕 Recent Professors</h3>
//                   </div>
//                   <div className="card-body">
//                     {analytics.recentUploads.professors.slice(0, 5).map(professor => (
//                       <div key={professor._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
//                         <span style={{ fontWeight: '500' }}>{professor.name}</span>
//                         <span style={{ fontSize: '12px', color: '#64748b' }}>
//                           {new Date(professor.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === 'users' && (
//             <div>
//               {/* User Filters */}
//               <div className="flex gap-2 mb-4">
//                 <select
//                   value={filters.role}
//                   onChange={(e) => setFilters({...filters, role: e.target.value})}
//                   className="form-select"
//                   style={{ width: '150px' }}
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="student">Students</option>
//                   <option value="professor">Professors</option>
//                 </select>
                
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   value={filters.search}
//                   onChange={(e) => setFilters({...filters, search: e.target.value})}
//                   className="form-input"
//                   style={{ flex: 1 }}
//                 />
//               </div>

//               {/* Users Table */}
//               <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
//                 <table className="table" style={{ margin: 0 }}>
//                   <thead style={{ position: 'sticky', top: 0, background: '#f8fafc' }}>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Role</th>
//                       <th>Department</th>
//                       <th>Added</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map(user => (
//                       <tr key={user._id}>
//                         <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{user.userId}</td>
//                         <td style={{ fontWeight: '500' }}>{user.name}</td>
//                         <td style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</td>
//                         <td>
//                           <span style={{
//                             padding: '4px 8px',
//                             borderRadius: '4px',
//                             fontSize: '11px',
//                             fontWeight: '500',
//                             background: 
//                               user.role === 'admin' ? '#fee2e2' :
//                               user.role === 'professor' ? '#dcfce7' : '#dbeafe',
//                             color:
//                               user.role === 'admin' ? '#dc2626' :
//                               user.role === 'professor' ? '#166534' : '#1e40af'
//                           }}>
//                             {user.role}
//                           </span>
//                         </td>
//                         <td style={{ fontSize: '12px' }}>{user.department || '-'}</td>
//                         <td style={{ fontSize: '11px', color: '#64748b' }}>
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div style={{ marginTop: '16px', textAlign: 'center', color: '#64748b' }}>
//                 Showing {filteredUsers.length} of {users.length} users
//               </div>
//             </div>
//           )}

//           {/* Departments Tab */}
//           {activeTab === 'departments' && analytics && (
//             <div>
//               <div className="card">
//                 <div className="card-header">
//                   <h3>🏛️ Department-wise Distribution</h3>
//                 </div>
//                 <div className="card-body">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Department</th>
//                         <th>Students</th>
//                         <th>Professors</th>
//                         <th>Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {Object.entries(analytics.departmentStats).map(([dept, stats]) => (
//                         <tr key={dept}>
//                           <td style={{ fontWeight: '500' }}>{dept}</td>
//                           <td style={{ color: '#3b82f6' }}>{stats.students}</td>
//                           <td style={{ color: '#059669' }}>{stats.professors}</td>
//                           <td style={{ fontWeight: 'bold' }}>{stats.students + stats.professors}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const Analytics = ({ onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    session: '2024-25',
    semester: 'odd',
    role: 'all',
    search: ''
  });
  // ✅ ADD SORTING STATE
  const [sortBy, setSortBy] = useState('userId');

  useEffect(() => {
    loadAnalytics();
  }, [filters.session, filters.semester]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsersPage(1); // Load first page when switching to users tab
    }
  }, [activeTab, filters.session, filters.semester, sortBy]); // ✅ Added sortBy dependency

  // ✅ UPDATED loadAnalytics with sorting
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.getAnalytics({
        session: filters.session,
        semester: filters.semester,
        page: 1,
        limit: 50,
        sortBy: sortBy // ✅ Add sorting parameter
      });
      
      setAnalytics(response.data);
      if (activeTab === 'users') {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      alert('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED loadUsersPage with sorting
  const loadUsersPage = async (page) => {
    try {
      setLoading(true);
      const response = await api.getAnalytics({
        session: filters.session,
        semester: filters.semester,
        page,
        limit: 50,
        sortBy: sortBy // ✅ Add sorting parameter
      });
      
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    loadUsersPage(newPage);
  };

  // ✅ UPDATED handleSortChange
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    // loadUsersPage will be called by useEffect due to sortBy change
    setTimeout(() => loadUsersPage(1), 100);
  };

  const filteredUsers = users.filter(user => {
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    if (filters.search && 
        !user.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !user.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.userId.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (loading && !analytics) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '95vw', width: '1200px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">📊 Analytics & Data Management</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Filters */}
          <div className="flex gap-2 mb-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={filters.session}
              onChange={(e) => setFilters({...filters, session: e.target.value})}
              className="form-select"
              style={{ width: '120px' }}
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2025-26">2025-26</option>
            </select>
            
            <select
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
              className="form-select"
              style={{ width: '120px' }}
            >
              <option value="odd">Odd Sem</option>
              <option value="even">Even Sem</option>
            </select>
            
            <button 
              className="btn btn-success"
              onClick={loadAnalytics}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <button
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'overview' ? '#3b82f6' : '#f1f5f9',
                color: activeTab === 'overview' ? 'white' : 'black',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
              onClick={() => setActiveTab('overview')}
            >
              📈 Overview
            </button>
            <button
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'users' ? '#3b82f6' : '#f1f5f9',
                color: activeTab === 'users' ? 'white' : 'black',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
              onClick={() => setActiveTab('users')}
            >
              👥 All Users ({analytics?.overview?.totalUsers || 0})
            </button>
            <button
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeTab === 'departments' ? '#3b82f6' : '#f1f5f9',
                color: activeTab === 'departments' ? 'white' : 'black',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
              onClick={() => setActiveTab('departments')}
            >
              🏛️ Departments
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && analytics && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="stat-card">
                  <div className="stat-number">{analytics.overview.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{analytics.overview.totalStudents}</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{analytics.overview.totalProfessors}</div>
                  <div className="stat-label">Professors</div>
                </div>
              </div>

              {/* Category Distribution */}
              {Object.keys(analytics.categoryStats || {}).length > 0 && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h3>📊 Student Categories</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {Object.entries(analytics.categoryStats).map(([category, count]) => (
                        <div key={category} style={{ background: '#dbeafe', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{count}</div>
                          <div style={{ fontSize: '14px' }}>{category}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Uploads */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="card">
                  <div className="card-header">
                    <h3>🆕 Recent Students</h3>
                  </div>
                  <div className="card-body">
                    {analytics.recentUploads.students.slice(0, 5).map(student => (
                      <div key={student._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: '500' }}>{student.name}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>🆕 Recent Professors</h3>
                  </div>
                  <div className="card-body">
                    {analytics.recentUploads.professors.slice(0, 5).map(professor => (
                      <div key={professor._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: '500' }}>{professor.name}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {new Date(professor.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ UPDATED Users Tab with Sorting */}
          {activeTab === 'users' && (
            <div>
              {/* User Filters with Sort Option */}
              <div className="flex gap-2 mb-4">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="form-select"
                  style={{ width: '150px' }}
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="professor">Professors</option>
                </select>

                {/* ✅ SORT DROPDOWN */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="form-select"
                  style={{ width: '160px' }}
                >
                  <option value="userId">Roll Number ↑</option>
                  <option value="name">Name A-Z</option>
                  <option value="createdAt">Newest First</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="form-input"
                  style={{ flex: 1 }}
                />
              </div>

              {/* Users Table */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="spinner"></div>
                  <span>Loading users...</span>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                    <table className="table" style={{ margin: 0 }}>
                      <thead style={{ position: 'sticky', top: 0, background: '#f8fafc' }}>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user._id}>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{user.userId}</td>
                            <td style={{ fontWeight: '500' }}>{user.name}</td>
                            <td style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</td>
                            <td>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '500',
                                background: 
                                  user.role === 'admin' ? '#fee2e2' :
                                  user.role === 'professor' ? '#dcfce7' : '#dbeafe',
                                color:
                                  user.role === 'admin' ? '#dc2626' :
                                  user.role === 'professor' ? '#166534' : '#1e40af'
                              }}>
                                {user.role}
                              </span>
                            </td>
                            <td style={{ fontSize: '12px' }}>{user.department || '-'}</td>
                            <td style={{ fontSize: '11px', color: '#64748b' }}>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 16px' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>
                      Showing page {pagination.currentPage} of {pagination.totalPages} 
                      ({pagination.totalUsers} total users) - Sorted by {
                        sortBy === 'userId' ? 'Roll Number' :
                        sortBy === 'name' ? 'Name' : 'Date Added'
                      }
                    </span>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        disabled={!pagination.hasPrev}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        ← Previous
                      </button>
                      
                      <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '500' }}>
                        {pagination.currentPage} / {pagination.totalPages}
                      </span>
                      
                      <button
                        className="btn btn-secondary"
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && analytics && (
            <div>
              <div className="card">
                <div className="card-header">
                  <h3>🏛️ Department-wise Distribution</h3>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Students</th>
                        <th>Professors</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analytics.departmentStats || {}).map(([dept, stats]) => (
                        <tr key={dept}>
                          <td style={{ fontWeight: '500' }}>{dept}</td>
                          <td style={{ color: '#3b82f6' }}>{stats.students}</td>
                          <td style={{ color: '#059669' }}>{stats.professors}</td>
                          <td style={{ fontWeight: 'bold' }}>{stats.students + stats.professors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

