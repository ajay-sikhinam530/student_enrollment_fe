import api from './api';

export const instructorService = {
  // Authentication
  register: async (instructorData) => {
    const response = await api.post('/instructors/register', instructorData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/instructors/login', credentials);
    // Store token if login successful
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('instructor', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('instructor');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current instructor from localStorage
  getCurrentInstructor: () => {
    const instructor = localStorage.getItem('instructor');
    return instructor ? JSON.parse(instructor) : null;
  },

  // Public endpoints
  getAllInstructors: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await api.get('/instructors', {
      params: { page, limit, search }
    });
    return response.data;
  },

  getInstructorById: async (id) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  },

  getInstructorCourses: async (id) => {
    const response = await api.get(`/instructors/${id}/courses`);
    return response.data;
  },

  getInstructorStudents: async (id) => {
    const response = await api.get(`/instructors/${id}/students`);
    return response.data;
  },

  // Protected endpoints (require authentication)
  updateProfile: async (profileData) => {
    const response = await api.put('/instructors/profile', profileData);
    return response.data;
  },

  getMyCourses: async () => {
    const response = await api.get('/instructors/my-courses');
    return response.data;
  },

  getMyAnalytics: async () => {
    const response = await api.get('/instructors/analytics');
    return response.data;
  },

  // Admin/Instructor management (requires proper authorization)
  updateInstructor: async (id, instructorData) => {
    const response = await api.put(`/instructors/${id}`, instructorData);
    return response.data;
  },

  deleteInstructor: async (id) => {
    const response = await api.delete(`/instructors/${id}`);
    return response.data;
  }
};