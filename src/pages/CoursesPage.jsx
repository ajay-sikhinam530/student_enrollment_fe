import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  message,
  Popconfirm,
  Tag,
  Typography,
  Row,
  Col,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { courseService } from '../services/courseService';
import { instructorService } from '../services/instructorService';
import CourseForm from '../components/CourseForm';

const { Title } = Typography;
const { Search } = Input;

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = instructorService.isAuthenticated();
  const currentInstructor = instructorService.getCurrentInstructor();

  // Fetch courses data
  const fetchCourses = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const response = await courseService.getAllCourses({
        page,
        limit,
        search
      });
      
      setCourses(response.data || []);
      setPagination({
        current: response.pagination?.currentPage || page,
        pageSize: limit,
        total: response.pagination?.totalCourses || response.data?.length || 0,
      });
    } catch (error) {
      message.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle table pagination
  const handleTableChange = (paginationConfig) => {
    fetchCourses(paginationConfig.current, paginationConfig.pageSize, searchText);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchCourses(1, pagination.pageSize, value);
  };

  // Handle create/edit course
  const handleSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (selectedCourse) {
        // Update existing course
        await courseService.updateCourse(selectedCourse.course_id, values);
        message.success('Course updated successfully');
      } else {
        // Create new course
        await courseService.createCourse(values);
        message.success('Course created successfully');
      }
      
      setModalVisible(false);
      setSelectedCourse(null);
      fetchCourses(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      message.error(errorMessage);
      console.error('Error submitting course:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete course
  const handleDelete = async (courseId) => {
    try {
      await courseService.deleteCourse(courseId);
      message.success('Course deleted successfully');
      fetchCourses(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete course';
      message.error(errorMessage);
      console.error('Error deleting course:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  // Handle add new course
  const handleAddNew = () => {
    if (!isAuthenticated) {
      message.warning('Please login as an instructor to create courses');
      return;
    }
    setSelectedCourse(null);
    setModalVisible(true);
  };

  // Get course status based on dates
  const getCourseStatus = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (now.isBefore(start)) {
      return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    } else if (now.isAfter(end)) {
      return { status: 'completed', color: 'gray', text: 'Completed' };
    } else {
      return { status: 'active', color: 'green', text: 'Active' };
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
      width: 100,
      render: (code) => (
        <Tag color="blue" style={{ fontWeight: 'bold' }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (name) => (
        <span>
          <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {name}
        </span>
      ),
    },
    {
      title: 'Instructor',
      key: 'instructor',
      render: (_, record) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {record.instructor_title ? `${record.instructor_title} ` : ''}
          {record.instructor_first_name} {record.instructor_last_name}
        </span>
      ),
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      render: (credits) => (
        <Badge count={credits} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Capacity',
      key: 'capacity',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={`${record.enrolled_count || 0} enrolled out of ${record.max_capacity}`}>
          <span>
            <TeamOutlined style={{ marginRight: 4 }} />
            {record.enrolled_count || 0}/{record.max_capacity}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(record.start_date).format('MMM DD, YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            to {dayjs(record.end_date).format('MMM DD, YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const { color, text } = getCourseStatus(record.start_date, record.end_date);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {isAuthenticated && currentInstructor && record.instructor_id === currentInstructor.instructor_id && (
            <Tooltip title="Edit Course">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}
          {isAuthenticated && currentInstructor && record.instructor_id === currentInstructor.instructor_id && (
            <Popconfirm
              title="Delete Course"
              description="Are you sure you want to delete this course?"
              onConfirm={() => handleDelete(record.course_id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete Course">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
          {(!isAuthenticated || !currentInstructor || record.instructor_id !== currentInstructor.instructor_id) && (
            <span style={{ color: '#999', fontSize: '12px' }}>
              View Only
            </span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <BookOutlined style={{ marginRight: 8 }} />
              Courses Management
            </Title>
            {isAuthenticated && (
              <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
                Welcome, {currentInstructor?.title || ''} {currentInstructor?.first_name} {currentInstructor?.last_name}
              </div>
            )}
          </Col>
        </Row>

        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Search courses by name, code, or instructor..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAddNew}
              disabled={!isAuthenticated}
            >
              Add New Course
            </Button>
            {!isAuthenticated && (
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Login as instructor to create courses
              </div>
            )}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="course_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />

        <CourseForm
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedCourse(null);
          }}
          onSubmit={handleSubmit}
          course={selectedCourse}
          loading={formLoading}
        />
      </Card>
    </div>
  );
};

export default CoursesPage;