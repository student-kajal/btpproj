// import axios from 'axios';

// class ApiService {
//   constructor() {
//     this.api = axios.create({
//       baseURL: 'http://localhost:5000/api',
//       timeout: 30000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   setupInterceptors() {
//     // Request interceptor
//     this.api.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );

//     // Response interceptor
//     this.api.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       (error) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           window.location.href = '/';
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Auth methods
//   async login(data) {
//     const response = await this.api.post('/auth/login', data);
//     return response.data;
//   }

//   async getProfile() {
//     const response = await this.api.get('/auth/profile');
//     return response.data;
//   }

//   async logout() {
//     const response = await this.api.post('/auth/logout');
//     return response.data;
//   }

//   // Admin methods
//   async getAdminDashboard() {
//     const response = await this.api.get('/admin/dashboard');
//     return response.data;
//   }

//   async uploadStudents(file, session, semester) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('session', session);
//     formData.append('semester', semester);

//     const response = await this.api.post('/admin/upload/students', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   async uploadFaculty(file, session, semester) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('session', session);
//     formData.append('semester', semester);

//     const response = await this.api.post('/admin/upload/faculty', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   }

//   // Student methods
//   async getStudentDashboard() {
//     const response = await this.api.get('/student/dashboard');
//     return response.data;
//   }

//   async proposeGroup(data) {
//     const response = await this.api.post('/student/groups/propose', data);
//     return response.data;
//   }

//   // Professor methods
//   async getProfessorDashboard() {
//     const response = await this.api.get('/professor/dashboard');
//     return response.data;
//   }

//   async getPendingGroups() {
//     const response = await this.api.get('/professor/groups/pending');
//     return response.data;
//   }

//   async approveGroup(groupId, projectTitle, projectDescription) {
//     const response = await this.api.put(`/professor/groups/${groupId}/approve`, {
//       projectTitle,
//       projectDescription
//     });
//     return response.data;
//   }

//   async rejectGroup(groupId, reason) {
//     const response = await this.api.put(`/professor/groups/${groupId}/reject`, {
//       reason
//     });
//     return response.data;
//   }
// }

// export default new ApiService();
import axios from 'axios';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 300000, // Increased to 5 minutes (300 seconds)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(data) {
    const response = await this.api.post('/auth/login', data);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  // Admin methods
  async getAdminDashboard() {
    const response = await this.api.get('/admin/dashboard');
    return response.data;
  }

  async uploadStudents(file, session, semester) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session', session);
    formData.append('semester', semester);

    const response = await this.api.post('/admin/upload/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for file upload
    });
    return response.data;
  }

  async uploadFaculty(file, session, semester) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session', session);
    formData.append('semester', semester);

    const response = await this.api.post('/admin/upload/faculty', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for file upload
    });
    return response.data;
  }
 // ✅ ANALYTICS METHOD - MOVED INSIDE CLASS
  async getAnalytics(params = {}) {
    const response = await this.api.get('/admin/analytics', { params });
    return response.data;
  }

  // Student methods
  async getStudentDashboard() {
    const response = await this.api.get('/student/dashboard');
    return response.data;
  }

  async proposeGroup(data) {
    const response = await this.api.post('/student/groups/propose', data);
    return response.data;
  }

  // Professor methods
  async getProfessorDashboard() {
    const response = await this.api.get('/professor/dashboard');
    return response.data;
  }

  async getPendingGroups() {
    const response = await this.api.get('/professor/groups/pending');
    return response.data;
  }

  async approveGroup(groupId, projectTitle, projectDescription) {
    const response = await this.api.put(`/professor/groups/${groupId}/approve`, {
      projectTitle,
      projectDescription
    });
    return response.data;
  }

  async rejectGroup(groupId, reason) {
    const response = await this.api.put(`/professor/groups/${groupId}/reject`, {
      reason
    });
    return response.data;
  }
async getProfessorDashboard() {
    const response = await this.api.get('/professor/dashboard');
    return response.data;
  }

  // Group Management
  async getPendingGroups(params = {}) {
    const response = await this.api.get('/professor/groups/pending', { params });
    return response.data;
  }

  async getAllGroups(params = {}) {
    const response = await this.api.get('/professor/groups', { params });
    return response.data;
  }

  async approveGroup(groupId, projectData) {
    const response = await this.api.put(`/professor/groups/${groupId}/approve`, projectData);
    return response.data;
  }

  async rejectGroup(groupId, reason) {
    const response = await this.api.put(`/professor/groups/${groupId}/reject`, { reason });
    return response.data;
  }

  async editProject(groupId, projectData) {
    const response = await this.api.put(`/professor/groups/${groupId}/project`, projectData);
    return response.data;
  }

  // Publication Management
  async addPublication(publicationData) {
    const response = await this.api.post('/professor/publications', publicationData);
    return response.data;
  }

  async getPublications(params = {}) {
    const response = await this.api.get('/professor/publications', { params });
    return response.data;
  }

  async updatePublication(publicationId, publicationData) {
    const response = await this.api.put(`/professor/publications/${publicationId}`, publicationData);
    return response.data;
  }

  async deletePublication(publicationId) {
    const response = await this.api.delete(`/professor/publications/${publicationId}`);
    return response.data;
  }
}



export default new ApiService();
