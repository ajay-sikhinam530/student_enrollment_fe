import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import InstructorsPage from './pages/InstructorsPage';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const NavigationLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'students',
      icon: <UserOutlined />,
      label: 'Student',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Courses',
    },
    {
      key: 'instructors',
      icon: <TeamOutlined />,
      label: 'Instructors',
    },
    {
      key: 'enrollments',
      icon: <FileTextOutlined />,
      label: 'Enrollments',
    },
  ];

  const getCurrentKey = () => {
    const path = location.pathname.slice(1) || 'students';
    return path;
  };

  const handleMenuClick = ({ key }) => {
    navigate(`/${key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: '#001529',
        padding: '0 24px'
      }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Student Enrollment System
        </Title>
      </Header>
      
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[getCurrentKey()]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        
        <Layout style={{ padding: '0' }}>
          <Content style={{ 
            background: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)'
          }}>
            <Routes>
              <Route path="/" element={<Navigate to="/students" replace />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/instructors" element={<InstructorsPage />} />
              <Route path="/enrollments" element={<div style={{ padding: 24 }}>Enrollments Page - Coming Soon</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <NavigationLayout />
    </Router>
  );
}

export default App
