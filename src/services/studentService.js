import api from './api';

export const studentService = {
  // Get all students with pagination and search
  getAllStudents: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await api.get('/students', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get student enrollments
  getStudentEnrollments: async (id) => {
    const response = await api.get(`/students/${id}/enrollments`);
    return response.data;
  }
};