import React from 'react';
import { Layout, Card, Button, Row, Col } from 'antd';
import { PhoneOutlined, MedicineBoxOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './HealthTips.css';

const { Header, Content } = Layout;

function HealthTips() {
    const navigate = useNavigate();

    return (
        <Layout className="tips-layout">
            <Header className="tips-header">
                <h2>Health Tips & Resources</h2>
                <div className="header-buttons">
                    <Button onClick={() => navigate('/dashboard')} style={{ marginRight: '10px' }}>
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => navigate('/records')} style={{ marginRight: '10px' }}>
                        View Records
                    </Button>
                    <Button onClick={() => navigate('/')} danger>
                        Logout
                    </Button>
                </div>
            </Header>

            <Content className="tips-content">
                {/* Mental Health Tips */}
                <Card className="tips-card" title={<><HeartOutlined /> Mental Health Tips</>}>
                    <h3>Take Care of Your Mind:</h3>
                    <ul>
                        <li><strong>Practice Mindfulness:</strong> Take 5-10 minutes daily for meditation or deep breathing</li>
                        <li><strong>Stay Connected:</strong> Talk to friends and family regularly</li>
                        <li><strong>Set Boundaries:</strong> Learn to say no and avoid overcommitting</li>
                        <li><strong>Take Breaks:</strong> Step away from studies every hour for a short break</li>
                        <li><strong>Seek Help:</strong> Don't hesitate to talk to a counselor if you're struggling</li>
                    </ul>
                </Card>

                {/* Sleep Tips */}
                <Card className="tips-card" title="💤 Sleep Better">
                    <h3>Healthy Sleep Habits:</h3>
                    <ul>
                        <li><strong>Consistent Schedule:</strong> Go to bed and wake up at the same time daily</li>
                        <li><strong>Aim for 7-9 Hours:</strong> Most adults need this much sleep</li>
                        <li><strong>Avoid Screens:</strong> No phones or laptops 30 minutes before bed</li>
                        <li><strong>Create a Routine:</strong> Wind down with reading or light stretching</li>
                        <li><strong>Comfortable Environment:</strong> Keep your room cool, dark, and quiet</li>
                    </ul>
                </Card>

                {/* Emergency Contacts */}
                <Card className="tips-card emergency-card" title={<><PhoneOutlined /> Emergency Contacts</>}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div className="contact-item">
                                <h3>🚨 Emergency Services</h3>
                                <p className="contact-number">108 / 112</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="contact-item">
                                <h3>🏥 Campus Health Center</h3>
                                <p className="contact-number">0416-2202000</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="contact-item">
                                <h3>🧠 Mental Health Helpline</h3>
                                <p className="contact-number">9152987821</p>
                                <p className="contact-note">AASRA (24/7 Support)</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="contact-item">
                                <h3>👨‍⚕️ Campus Counselor</h3>
                                <p className="contact-number">0416-2202108</p>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* General Wellness Tips */}
                <Card className="tips-card" title={<><MedicineBoxOutlined /> General Wellness</>}>
                    <h3>Stay Healthy on Campus:</h3>
                    <ul>
                        <li><strong>Stay Hydrated:</strong> Drink 8-10 glasses of water daily</li>
                        <li><strong>Eat Balanced Meals:</strong> Include fruits, vegetables, and proteins</li>
                        <li><strong>Exercise Regularly:</strong> At least 30 minutes of physical activity daily</li>
                        <li><strong>Limit Caffeine:</strong> Especially in the evening hours</li>
                        <li><strong>Regular Check-ups:</strong> Visit the health center for routine check-ups</li>
                    </ul>
                </Card>
            </Content>
        </Layout>
    );
}

export default HealthTips;
