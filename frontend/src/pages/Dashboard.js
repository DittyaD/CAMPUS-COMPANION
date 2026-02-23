import React, { useState } from 'react';
import { Form, Select, InputNumber, Button, Card, message, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const { Header, Content } = Layout;
const { Option } = Select;

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // This function runs when user submits health data
    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            // TODO: Later we'll connect this to backend API
            // For now, just simulate saving data
            console.log('Health data:', values);

            // Simulate API call delay
            setTimeout(() => {
                message.success('Health data saved successfully!');
                setLoading(false);
                // Clear the form after successful submission
                form.resetFields();
            }, 1000);

        } catch (error) {
            message.error('Failed to save data. Please try again.');
            setLoading(false);
        }
    };

    // Logout function
    const handleLogout = () => {
        message.info('Logged out successfully');
        navigate('/');
    };

    return (
        <Layout className="dashboard-layout">
            <Header className="dashboard-header">
                <h2>Campus Health & Wellness Dashboard</h2>
                <div className="header-buttons">
                    <Button onClick={() => navigate('/records')} style={{ marginRight: '10px' }}>
                        View Records
                    </Button>
                    <Button onClick={() => navigate('/health-tips')} style={{ marginRight: '10px' }}>
                        Health Tips
                    </Button>
                    <Button onClick={handleLogout} danger>
                        Logout
                    </Button>
                </div>
            </Header>

            <Content className="dashboard-content">
                <Card className="health-form-card" title="Add Today's Health Data">
                    <Form
                        form={form}
                        name="healthData"
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        {/* Mood Selection */}
                        <Form.Item
                            label="How are you feeling today?"
                            name="mood"
                            rules={[{ required: true, message: 'Please select your mood!' }]}
                        >
                            <Select placeholder="Select your mood" size="large">
                                <Option value="Very Happy">😄 Very Happy</Option>
                                <Option value="Happy">🙂 Happy</Option>
                                <Option value="Neutral">😐 Neutral</Option>
                                <Option value="Sad">😔 Sad</Option>
                                <Option value="Very Sad">😢 Very Sad</Option>
                                <Option value="Stressed">😰 Stressed</Option>
                                <Option value="Anxious">😟 Anxious</Option>
                            </Select>
                        </Form.Item>

                        {/* Sleep Hours Input */}
                        <Form.Item
                            label="How many hours did you sleep last night?"
                            name="sleepHours"
                            rules={[
                                { required: true, message: 'Please enter sleep hours!' },
                                { type: 'number', min: 0, max: 24, message: 'Sleep hours must be between 0 and 24!' }
                            ]}
                        >
                            <InputNumber
                                placeholder="Enter hours (e.g., 7.5)"
                                style={{ width: '100%' }}
                                size="large"
                                step={0.5}
                                min={0}
                                max={24}
                            />
                        </Form.Item>

                        {/* Submit Button */}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                            >
                                Save Health Data
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
}

export default Dashboard;
