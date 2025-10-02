// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api.js';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     if (token) {
//       loadUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const loadUser = async () => {
//     try {
//       const response = await api.getProfile();
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//     } catch (error) {
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password, role) => {
//     try {
//       const response = await api.login({ email, password, role });
      
//       if (response.success) {
//         const { token, user } = response.data;
        
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
        
//         setToken(token);
//         setUser(user);
//         setIsAuthenticated(true);
        
//         return { success: true, user };
//       } else {
//         return { success: false, message: response.message };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       return { success: false, message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
    
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
    
//     // Call API logout (optional)
//     api.logout().catch(() => {});
//   };

//   const value = {
//     user,
//     token,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//     loadUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // ✅ UPDATED LOGIN FUNCTION
  const login = async (email, password, role) => {
    try {
      console.log('🔍 Login attempt:', { email, role });
      
      const response = await api.api.post('/auth/login', {
        email,
        password,
        role
      });

      console.log('📨 Login response:', response.data);

      if (response.data.success) {
        const { token: authToken, user: userData } = response.data.data; // ✅ Extract from data object
        
        // Store token and user
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);

        // Update API default headers
        api.api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        console.log('✅ Login successful:', userData);

        // ✅ RETURN CORRECT FORMAT
        return {
          success: true,
          user: userData,
          token: authToken
        };
      } else {
        console.error('❌ Login failed:', response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Better error handling
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          api.api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
