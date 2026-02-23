import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // This function runs when user clicks Register button
    const handleRegister = async (values) => {
        setLoading(true);

        try {
            // TODO: Later we'll connect this to backend API
            // For now, just simulate registration
            console.log('Register values:', values);

            // Simulate API call delay
            setTimeout(() => {
                message.success('Registration successful! Please login.');
                setLoading(false);
                // Navigate to login page after successful registration
                navigate('/');
            }, 1000);

        } catch (error) {
            message.error('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card" title="Campus Health & Wellness">
                <h2>Student Registration</h2>

                <Form
                    name="register"
                    onFinish={handleRegister}
                    autoComplete="off"
                >
                    {/* Username Field */}
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Please enter your username!' },
                            { min: 3, message: 'Username must be at least 3 characters!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            size="large"
                        />
                    </Form.Item>

                    {/* Email Field */}
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    {/* Password Field */}
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    {/* Confirm Password Field */}
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                            size="large"
                        />
                    </Form.Item>

                    {/* Register Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                {/* Link to Login Page */}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    Already have an account?{' '}
                    <Button type="link" onClick={() => navigate('/')} style={{ padding: 0 }}>
                        Login here
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Register;
