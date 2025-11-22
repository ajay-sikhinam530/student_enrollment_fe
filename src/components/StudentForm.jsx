import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

const StudentForm = ({ visible, onCancel, onSubmit, student, loading }) => {
    const [studentDetailForm] = Form.useForm();
    const isEditing = !!student;

    useEffect(() => {
        if (visible) {
            if (student) {
                // Pre-fill form with student data for editing
                studentDetailForm.setFieldsValue({
                    ...student,
                    date_of_birth: student.date_of_birth ? dayjs(student.date_of_birth) : null
                });
            } else {
                // Reset form for new student
                studentDetailForm.resetFields();
            }
        }
    }, [visible, student, studentDetailForm]);

    const handleSubmit = async () => {
        try {
            const values = await studentDetailForm.validateFields();

            // Format date for API
            const formattedValues = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null
            };

            onSubmit(formattedValues);
        } catch {
            message.error('Please check all required fields');
        }
    };

    return (
        <Modal
            title={isEditing ? 'Edit Student' : 'Add New Student'}
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
            width={600}
        >
            <Form
                form={studentDetailForm}
                layout="vertical"
                initialValues={{
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    address: ''
                }}
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                        { required: true, message: 'Please enter first name' },
                        { min: 2, max: 50, message: 'First name must be between 2 and 50 characters' }
                    ]}
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
                >
                    <Input placeholder="Enter last name" />
                </Form.Item>

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

                <Form.Item
                    name="date_of_birth"
                    label="Date of Birth"
                    rules={[
                        { required: true, message: 'Please select date of birth' }
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Select date of birth"
                        disabledDate={(current) => {
                            // Disable future dates and dates that make age < 16 or > 120
                            const today = dayjs();
                            const maxAge = today.subtract(120, 'year');
                            const minAge = today.subtract(16, 'year');
                            return current && (current > minAge || current < maxAge);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        { pattern: /^[+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                    ]}
                >
                    <Input placeholder="Enter phone number (optional)" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                        { max: 255, message: 'Address cannot exceed 255 characters' }
                    ]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Enter address (optional)"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StudentForm;