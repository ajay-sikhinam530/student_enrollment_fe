import React from 'react';
import { Modal, Form, Input, Button, message, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Option } = Select;

const LoginModal = ({ visible, onCancel, onLogin, onRegister, loading }) => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async () => {
    try {
      const values = await loginForm.validateFields();
      onLogin(values);
    } catch {
      message.error('Please check all required fields');
    }
  };

  const handleRegister = async () => {
    try {
      const values = await registerForm.validateFields();
      onRegister(values);
    } catch {
      message.error('Please check all required fields');
    }
  };

  const loginTab = (
    <Form
      form={loginForm}
      layout="vertical"
      style={{ marginTop: 16 }}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />}
          placeholder="Enter your email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter your password' }
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />}
          placeholder="Enter your password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          onClick={handleLogin}
          loading={loading}
          size="large"
          block
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );

  const registerTab = (
    <Form
      form={registerForm}
      layout="vertical"
      style={{ marginTop: 16 }}
      initialValues={{ title: 'Mr.' }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <Form.Item
          name="title"
          label="Title"
          style={{ flex: '0 0 80px' }}
        >
          <Select placeholder="Title">
            <Option value="Dr.">Dr.</Option>
            <Option value="Prof.">Prof.</Option>
            <Option value="Mr.">Mr.</Option>
            <Option value="Ms.">Ms.</Option>
            <Option value="Mrs.">Mrs.</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="first_name"
          label="First Name"
          rules={[
            { required: true, message: 'Please enter first name' },
            { min: 2, max: 50, message: 'First name must be between 2 and 50 characters' }
          ]}
          style={{ flex: 1 }}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="First name"
          />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[
            { required: true, message: 'Please enter last name' },
            { min: 2, max: 50, message: 'Last name must be between 2 and 50 characters' }
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Last name" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />}
          placeholder="Enter email address"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter password' },
          { min: 6, message: 'Password must be at least 6 characters long' },
          { 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' 
          }
        ]}
      >
        <Input.Password 
          prefix={<LockOutlined />}
          placeholder="Enter password"
        />
      </Form.Item>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Form.Item
          name="department"
          label="Department"
          rules={[
            { required: true, message: 'Please enter department' },
            { min: 2, max: 100, message: 'Department must be between 2 and 100 characters' }
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Enter department" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { pattern: /^[+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Phone (optional)" />
        </Form.Item>
      </div>

      <Form.Item>
        <Button 
          type="primary" 
          onClick={handleRegister}
          loading={loading}
          size="large"
          block
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  const tabItems = [
    {
      key: 'login',
      label: 'Login',
      children: loginTab,
    },
    {
      key: 'register',
      label: 'Register',
      children: registerTab,
    }
  ];

  return (
    <Modal
      title="Instructor Authentication"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Tabs 
        defaultActiveKey="login" 
        items={tabItems}
        centered
      />
    </Modal>
  );
};

export default LoginModal;