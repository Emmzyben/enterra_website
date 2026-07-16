import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, User, LogOut, LayoutDashboard, Search, MessageSquare, Home, Coins } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import API_URL from '../config';

const Header = () => {
    const { user, token, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/chat/unread_count.php`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setUnreadCount(data.unread_count);
                }
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll headers less frequently (30s)
        return () => clearInterval(interval);
    }, [user, token, location.pathname]);

    const isActive = (path, tab = null) => {
        const queryParams = new URLSearchParams(location.search);
        const currentTab = queryParams.get('tab');

        if (location.pathname !== path) return false;

        if (tab) {
            return currentTab === tab;
        } else {
            // Root dashboard paths are active if no tab or default tab is set
            return !currentTab || currentTab === 'overview' || currentTab === 'portfolio';
        }
    };

    const GuestNav = () => (
        <>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/vendors" className={`nav-link ${isActive('/vendors') ? 'active' : ''}`}>Find Vendors</Link>
            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>Events</Link>
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </>
    );

    const UserNav = () => (
        <>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/vendors" className={`nav-link ${isActive('/vendors') ? 'active' : ''}`}>Find Vendors</Link>
            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>Events</Link>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/dashboard?tab=messages" className={`nav-link ${isActive('/dashboard', 'messages') ? 'active' : ''}`} style={{ position: 'relative' }}>
                <MessageSquare size={18} /> Messages
                {unreadCount > 0 && <span className="header-badge">{unreadCount}</span>}
            </Link>
            <Link to="/wallet" className="token-nav-badge">
                <Coins size={16} color="#FFD700" fill="#FFD700" />
                <span>{user?.tokens || 0}</span>
            </Link>
            <div className="user-menu">
                <img
                    src={user?.image ? (user.image && user.image.startsWith('http') ? user.image : `${API_URL.replace('/api', '')}/${user.image}`) : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=EB4641&color=fff`}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    alt="User"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=EB4641&color=fff`; }}
                />
                <span className="user-name">Hi, {(user?.name || 'User').split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-icon" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </>
    );

    return (
        <header className="main-header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <div>
                        <img src={"/logo.png"} alt="" style={{ width: '150px' }} />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    {!user ? <GuestNav /> : <UserNav />}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <div className="mobile-nav">
                        {!user ? <GuestNav /> : <UserNav />}
                    </div>
                )}
            </div>

            <style>{`
                .main-header {
                    background: white;
                    border-bottom: 1px solid #e2e8f0;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    height: 70px;
                    display: flex;
                    align-items: center;
                }
                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: var(--text-primary);
                    font-weight: 700;
                    font-size: 1.25rem;
                }
                .logo-icon {
                    width: 36px;
                    height: 36px;
                    background: var(--primary);
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .nav-link {
                    text-decoration: none;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .nav-link:hover, .nav-link.active {
                    color: var(--primary);
                }
                .btn-sm {
                    padding: 0.6rem 1.25rem;
                    font-size: 0.9rem;
                    border-radius: 0;
                }
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding-left: 1.5rem;
                    border-left: 1px solid #e2e8f0;
                    margin-left: 0.5rem;
                }
                .user-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .btn-icon {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0.25rem;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                }
                .btn-icon:hover {
                    color: #ef4444;
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-primary);
                }
                .mobile-nav {
                    display: none;
                }

                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none;
                    }
                    .mobile-menu-btn {
                        display: block;
                    }
                    .mobile-nav {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        top: 70px;
                        left: 0;
                        right: 0;
                        background: white;
                        border-bottom: 1px solid #e2e8f0;
                        padding: 1.5rem;
                        gap: 1.5rem;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    }
                    .user-menu {
                        padding-left: 0;
                        border-left: none;
                        margin-left: 0;
                        padding-top: 1rem;
                        border-top: 1px solid #f1f5f9;
                        justify-content: space-between;
                }
                .header-badge {
                    position: absolute;
                    top: -5px;
                    right: -10px;
                    background: #ef4444;
                    color: white;
                    font-size: 0.65rem;
                    padding: 2px 5px;
                    border-radius: 0;
                    font-weight: 700;
                    min-width: 18px;
                    text-align: center;
                    border: 2px solid white;
                }
            `}</style>
        </header>
    );
};

export default Header;
