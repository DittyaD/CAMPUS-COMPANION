import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/theme.css';

const USER_NAV = [
    { label: 'Dashboard',    path: '/dashboard',     icon: '🏠', mobIcon: '🏠' },
    { label: 'Appointments', path: '/appointments',  icon: '📅', mobIcon: '📅' },
    { label: 'Medications',  path: '/medications',   icon: '💊', mobIcon: '💊' },
    { label: 'My Records',   path: '/records',       icon: '🗂️', mobIcon: '🗂️' },
    { label: 'Health Tips',  path: '/health-tips',   icon: '💡', mobIcon: '💡' },
];

const ADMIN_NAV = [
    { label: 'Admin Panel',       path: '/admin',        icon: '⚙️', mobIcon: '⚙️' },
    { label: 'All Patients',      path: '/patients',     icon: '👥', mobIcon: '👥' },
    { label: 'Appointments',      path: '/appointments', icon: '📅', mobIcon: '📅' },
    { label: 'Medications',       path: '/medications',  icon: '💊', mobIcon: '💊' },
    { label: 'Health Tips',       path: '/health-tips',  icon: '💡', mobIcon: '💡' },
];

// Mobile bottom nav shows max 5 items
const USER_MOB_NAV = [
    { label: 'Home',      path: '/dashboard',    icon: '🏠' },
    { label: 'Appt',      path: '/appointments', icon: '📅' },
    { label: 'Meds',      path: '/medications',  icon: '💊' },
    { label: 'Records',   path: '/records',      icon: '🗂️' },
    { label: 'Tips',      path: '/health-tips',  icon: '💡' },
];

const ADMIN_MOB_NAV = [
    { label: 'Admin',     path: '/admin',        icon: '⚙️' },
    { label: 'Patients',  path: '/patients',     icon: '👥' },
    { label: 'Appt',      path: '/appointments', icon: '📅' },
    { label: 'Meds',      path: '/medications',  icon: '💊' },
    { label: 'Tips',      path: '/health-tips',  icon: '💡' },
];

function AppLayout({ children, title }) {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role') || 'user';
    const name = localStorage.getItem('auth_name') || localStorage.getItem('patient_name') || 'Student';
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const navItems = role === 'admin' ? ADMIN_NAV : USER_NAV;
    const mobNavItems = role === 'admin' ? ADMIN_MOB_NAV : USER_MOB_NAV;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="app-shell">
            {/* ── Desktop Sidebar ── */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <p className="logo-title">Campus Health</p>
                    <p className="logo-sub">Wellness Companion &middot; VIT</p>
                </div>

                <p className="sidebar-section-label">Navigation</p>
                <ul className="sidebar-nav">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <button
                                className={`nav-btn${location.pathname === item.path ? ' active' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">{initials}</div>
                        <div>
                            <div className="sidebar-user-name">{name}</div>
                            <div className="sidebar-user-role">{role === 'admin' ? 'Administrator' : 'Student'}</div>
                        </div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="main-area">
                <header className="topbar">
                    <h2 className="topbar-title">{title}</h2>
                    <div className="topbar-right">
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginRight: 6 }}>
                            {name}
                        </span>
                        <span className={`topbar-badge ${role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                            {role === 'admin' ? 'Admin' : 'Student'}
                        </span>
                    </div>
                </header>
                <main className="page-content">
                    {children}
                </main>
            </div>

            {/* ── Mobile Bottom Navigation (iPhone) ── */}
            <nav className="mobile-bottom-nav">
                {mobNavItems.map(item => (
                    <button
                        key={item.path}
                        className={`mobile-nav-btn${location.pathname === item.path ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="mob-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
                <button className="mobile-nav-btn" onClick={handleLogout}>
                    <span className="mob-icon">🚪</span>
                    Logout
                </button>
            </nav>
        </div>
    );
}

export default AppLayout;
