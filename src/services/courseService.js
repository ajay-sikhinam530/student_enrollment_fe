import api from './api';

export const courseService = {
  // Get all courses with pagination and search
  getAllCourses: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await api.get('/courses', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create new course (requires authentication)
  createCourse: async (courseData) => {
    // Remove instructor_id from courseData as it's automatically set by backend
    const { instructor_id: _instructor_id, ...dataWithoutInstructor } = courseData;
    const response = await api.post('/courses', dataWithoutInstructor);
    return response.data;
  },

  // Update course (requires authentication)
  updateCourse: async (id, courseData) => {
    // Remove instructor_id from courseData as it shouldn't be changed
    const { instructor_id: _instructor_id, ...dataWithoutInstructor } = courseData;
    const response = await api.put(`/courses/${id}`, dataWithoutInstructor);
    return response.data;
  },

  // Delete course (requires authentication)
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Get course enrollments
  getCourseEnrollments: async (id) => {
    const response = await api.get(`/courses/${id}/enrollments`);
    return response.data;
  },

  // Get available spots for a course
  getAvailableSpots: async (id) => {
    const response = await api.get(`/courses/${id}/available-spots`);
    return response.data;
  }
};