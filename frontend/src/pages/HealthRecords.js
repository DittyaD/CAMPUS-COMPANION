import React, { useState, useEffect } from 'react';
import { Table, Button, Layout, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HealthRecords.css';

const { Header, Content } = Layout;

function HealthRecords() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    // This runs when the page loads
    useEffect(() => {
        fetchRecords();
    }, []);

    // Function to get health records from backend
    const fetchRecords = async () => {
        setLoading(true);

        try {
            // TODO: Later we'll connect this to backend API
            // For now, use dummy data to show how the table looks
            const dummyData = [
                {
                    key: '1',
                    date: '2026-01-18',
                    mood: 'Happy',
                    sleepHours: 7.5,
                },
                {
                    key: '2',
                    date: '2026-01-17',
                    mood: 'Stressed',
                    sleepHours: 5.0,
                },
                {
                    key: '3',
                    date: '2026-01-16',
                    mood: 'Very Happy',
                    sleepHours: 8.0,
                },
            ];

            // Simulate API call delay
            setTimeout(() => {
                setRecords(dummyData);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error('Failed to fetch records:', error);
            setLoading(false);
        }
    };

    // Define table columns
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: 'Mood',
            dataIndex: 'mood',
            key: 'mood',
            filters: [
                { text: 'Very Happy', value: 'Very Happy' },
                { text: 'Happy', value: 'Happy' },
                { text: 'Neutral', value: 'Neutral' },
                { text: 'Sad', value: 'Sad' },
                { text: 'Very Sad', value: 'Very Sad' },
                { text: 'Stressed', value: 'Stressed' },
                { text: 'Anxious', value: 'Anxious' },
            ],
            onFilter: (value, record) => record.mood === value,
        },
        {
            title: 'Sleep Hours',
            dataIndex: 'sleepHours',
            key: 'sleepHours',
            sorter: (a, b) => a.sleepHours - b.sleepHours,
            render: (hours) => `${hours} hours`,
        },
    ];

    return (
        <Layout className="records-layout">
            <Header className="records-header">
                <h2>My Health Records</h2>
                <div className="header-buttons">
                    <Button onClick={() => navigate('/dashboard')} style={{ marginRight: '10px' }}>
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => navigate('/health-tips')} style={{ marginRight: '10px' }}>
                        Health Tips
                    </Button>
                    <Button onClick={() => navigate('/')} danger>
                        Logout
                    </Button>
                </div>
            </Header>

            <Content className="records-content">
                <Card className="records-card">
                    <Table
                        columns={columns}
                        dataSource={records}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
}

export default HealthRecords;
