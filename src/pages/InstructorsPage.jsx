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
  Avatar,
  Tooltip,
  Dropdown
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { instructorService } from '../services/instructorService';
import InstructorForm from '../components/InstructorForm';
import LoginModal from '../components/LoginModal';

const { Title } = Typography;
const { Search } = Input;

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(instructorService.isAuthenticated());
  const [currentInstructor, setCurrentInstructor] = useState(instructorService.getCurrentInstructor());

  // Fetch instructors data
  const fetchInstructors = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const response = await instructorService.getAllInstructors({
        page,
        limit,
        search
      });
      
      setInstructors(response.data || []);
      setPagination({
        current: response.pagination?.currentPage || page,
        pageSize: limit,
        total: response.pagination?.totalInstructors || response.data?.length || 0,
      });
    } catch (error) {
      message.error('Failed to fetch instructors');
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  // Handle table pagination
  const handleTableChange = (paginationConfig) => {
    fetchInstructors(paginationConfig.current, paginationConfig.pageSize, searchText);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    fetchInstructors(1, pagination.pageSize, value);
  };

  // Handle login
  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await instructorService.login(credentials);
      if (response.success) {
        message.success('Login successful');
        setIsAuthenticated(true);
        setCurrentInstructor(instructorService.getCurrentInstructor());
        setLoginModalVisible(false);
        fetchInstructors(); // Refresh data
      } else {
        message.error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      message.error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await instructorService.register(userData);
      if (response.success) {
        message.success('Registration successful! Please login.');
        // Switch to login tab or close modal
        setLoginModalVisible(false);
        fetchInstructors(); // Refresh data
      } else {
        message.error(response.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      message.error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    instructorService.logout();
    setIsAuthenticated(false);
    setCurrentInstructor(null);
    message.success('Logged out successfully');
    fetchInstructors(); // Refresh data
  };

  // Handle create/edit instructor
  const handleSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (selectedInstructor) {
        // Update existing instructor
        await instructorService.updateInstructor(selectedInstructor.instructor_id, values);
        message.success('Instructor updated successfully');
      } else {
        // This would be for admin creating instructors
        message.info('Please use the Register option to create new instructors');
        return;
      }
      
      setModalVisible(false);
      setSelectedInstructor(null);
      fetchInstructors(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      message.error(errorMessage);
      console.error('Error submitting instructor:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete instructor
  const handleDelete = async (instructorId) => {
    try {
      await instructorService.deleteInstructor(instructorId);
      message.success('Instructor deleted successfully');
      fetchInstructors(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete instructor';
      message.error(errorMessage);
      console.error('Error deleting instructor:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setModalVisible(true);
  };

  // User menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: 'Edit Profile',
      onClick: () => {
        setSelectedInstructor(currentInstructor);
        setModalVisible(true);
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  // Table columns configuration
  const columns = [
    {
      title: 'Instructor',
      key: 'instructor',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ marginRight: 12, backgroundColor: '#1890ff' }}
          >
            {record.first_name?.[0]}{record.last_name?.[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {record.title ? `${record.title} ` : ''}{record.first_name} {record.last_name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Courses',
      dataIndex: 'course_count',
      key: 'course_count',
      align: 'center',
      render: (count) => (
        <Tag color="blue">{count || 0} courses</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Hire Date',
      dataIndex: 'hire_date',
      key: 'hire_date',
      render: (date) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {isAuthenticated && currentInstructor && record.instructor_id === currentInstructor.instructor_id && (
            <Tooltip title="Edit My Profile">
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
              title="Delete My Account"
              description="Are you sure you want to delete your account? This action cannot be undone."
              onConfirm={() => handleDelete(record.instructor_id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete My Account">
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
              <TeamOutlined style={{ marginRight: 8 }} />
              Instructors Management
            </Title>
          </Col>
          <Col>
            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  {currentInstructor?.title || ''} {currentInstructor?.first_name} {currentInstructor?.last_name}
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => setLoginModalVisible(true)}
              >
                Login / Register
              </Button>
            )}
          </Col>
        </Row>

        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Search instructors by name, email, or department..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            {!isAuthenticated && (
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
                Login to manage instructor profiles
              </div>
            )}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={instructors}
          rowKey="instructor_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} instructors`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />

        <InstructorForm
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedInstructor(null);
          }}
          onSubmit={handleSubmit}
          instructor={selectedInstructor}
          loading={formLoading}
          mode="edit"
        />

        <LoginModal
          visible={loginModalVisible}
          onCancel={() => setLoginModalVisible(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
        />
      </Card>
    </div>
  );
};

export default InstructorsPage;