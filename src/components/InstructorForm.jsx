import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const InstructorForm = ({ visible, onCancel, onSubmit, instructor, loading, mode = 'create' }) => {
  const [form] = Form.useForm();
  const isEditing = !!instructor;
  const isRegistration = mode === 'register';

  useEffect(() => {
    if (visible) {
      if (instructor) {
        // Pre-fill form with instructor data for editing
        form.setFieldsValue({
          ...instructor,
          // Don't pre-fill password for security
          password: undefined,
          // Convert hire_date string to dayjs object for DatePicker
          hire_date: instructor.hire_date ? dayjs(instructor.hire_date) : null
        });
      } else {
        // Reset form for new instructor
        form.resetFields();
      }
    }
  }, [visible, instructor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format hire_date for API (convert dayjs to YYYY-MM-DD string)
      const formattedValues = {
        ...values,
        hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : null
      };

      onSubmit(formattedValues);
    } catch {
      message.error('Please check all required fields');
    }
  };

  const getTitle = () => {
    if (isRegistration) return 'Register as Instructor';
    if (isEditing) return 'Edit Instructor Profile';
    return 'Add New Instructor';
  };

  return (
    <Modal
      title={getTitle()}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {isRegistration ? 'Register' : (isEditing ? 'Update' : 'Create')}
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: 'Mr.'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
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
            <Input placeholder="Enter first name" />
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
            <Input placeholder="Enter last name" />
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
          <Input placeholder="Enter email address" />
        </Form.Item>

        {(isRegistration || !isEditing) && (
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
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { pattern: /^[+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
            ]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter phone number (optional)" />
          </Form.Item>

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
        </div>

        <Form.Item
          name="bio"
          label="Bio"
          rules={[
            { max: 1000, message: 'Bio cannot exceed 1000 characters' }
          ]}
        >
          <TextArea 
            rows={4}
            placeholder="Enter bio (optional)"
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          name="hire_date"
          label="Hire Date"
        >
          <DatePicker 
            style={{ width: '100%' }}
            placeholder="Select hire date (optional)"
            disabledDate={(current) => {
              // Disable future dates (hire date should not be in the future)
              return current && current > dayjs().endOf('day');
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InstructorForm;