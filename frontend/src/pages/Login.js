import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // This function runs when user clicks Login button
  const handleLogin = async (values) => {
    setLoading(true);

    try {
      // TODO: Later we'll connect this to backend API
      // For now, just simulate login
      console.log('Login values:', values);

      // Simulate API call delay
      setTimeout(() => {
        message.success('Login successful!');
        setLoading(false);
        // Navigate to dashboard after successful login
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      message.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="Campus Health & Wellness">
        <h2>Student Login</h2>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          {/* Username Field */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Link to Register Page */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          Don't have an account?{' '}
          <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0 }}>
            Register here
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Login;
