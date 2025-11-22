import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message, InputNumber, Select, Alert } from 'antd';
import dayjs from 'dayjs';
import { instructorService } from '../services/instructorService';

const { TextArea } = Input;
const { Option } = Select;

const CourseForm = ({ visible, onCancel, onSubmit, course, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!course;
  const currentInstructor = instructorService.getCurrentInstructor();

  // Check if current instructor can edit this course

  useEffect(() => {
    if (visible) {
      if (course) {
        // Pre-fill form with course data for editing
        form.setFieldsValue({
          ...course,
          start_date: course.start_date ? dayjs(course.start_date) : null,
          end_date: course.end_date ? dayjs(course.end_date) : null
        });
      } else {
        // Reset form for new course
        form.resetFields();
      }
    }
  }, [visible, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format dates for API
      const formattedValues = {
        ...values,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null
      };

      onSubmit(formattedValues);
    } catch {
      message.error('Please check all required fields');
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Course' : 'Add New Course'}
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
          {isEditing ? 'Update' : 'Create'}
        </Button>
      ]}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          credits: 3,
          max_capacity: 30
        }}
      >
        <Form.Item
          name="course_name"
          label="Course Name"
          rules={[
            { required: true, message: 'Please enter course name' },
            { min: 3, max: 100, message: 'Course name must be between 3 and 100 characters' }
          ]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="course_code"
          label="Course Code"
          rules={[
            { required: true, message: 'Please enter course code' },
            { min: 3, max: 20, message: 'Course code must be between 3 and 20 characters' },
            { pattern: /^[A-Z0-9]+$/, message: 'Course code must contain only uppercase letters and numbers' }
          ]}
        >
          <Input 
            placeholder="Enter course code (e.g., CS101)" 
            style={{ textTransform: 'uppercase' }}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              form.setFieldValue('course_code', value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 1000, message: 'Description cannot exceed 1000 characters' }
          ]}
        >
          <TextArea 
            rows={4}
            placeholder="Enter course description (optional)" 
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="credits"
            label="Credits"
            rules={[
              { required: true, message: 'Please enter credits' }
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={1} 
              max={10} 
              placeholder="Credits"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="max_capacity"
            label="Maximum Capacity"
            rules={[
              { required: true, message: 'Please enter maximum capacity' }
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber 
              min={1} 
              max={500} 
              placeholder="Max students"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>

        {!isEditing && currentInstructor && (
          <Alert
            message="Instructor Assignment"
            description={`This course will be automatically assigned to you: ${currentInstructor.title || ''} ${currentInstructor.first_name} ${currentInstructor.last_name} (${currentInstructor.department})`}
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        {isEditing && course && (
          <Alert
            message="Course Instructor"
            description={`Instructor: ${course.instructor_title || ''} ${course.instructor_first_name} ${course.instructor_last_name} - ${course.instructor_department || 'N/A'}`}
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[
              { required: true, message: 'Please select start date' }
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker 
              style={{ width: '100%' }}
              placeholder="Select start date"
              disabledDate={(current) => {
                // Disable past dates
                return current && current < dayjs().startOf('day');
              }}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[
              { required: true, message: 'Please select end date' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('start_date');
                  if (!value || !startDate) {
                    return Promise.resolve();
                  }
                  if (value.isAfter(startDate)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('End date must be after start date'));
                },
              })
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker 
              style={{ width: '100%' }}
              placeholder="Select end date"
              disabledDate={(current) => {
                const startDate = form.getFieldValue('start_date');
                if (startDate) {
                  return current && current <= startDate;
                }
                return current && current < dayjs().startOf('day');
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CourseForm;