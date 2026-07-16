import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData.email, formData.password);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f8fafc',
            paddingTop: '6rem',
            paddingBottom: '4rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                zIndex: 2,
                background: '#ffffff',
                padding: '3rem',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Enter your credentials to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#EB4641' }} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                style={{
                                    width: '100%',
                                    padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                                    borderRadius: '0',
                                    border: '1px solid var(--border-color)',
                                    background: '#f8fafc',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    color: 'var(--text-primary)',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.background = '#fff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-color)';
                                    e.target.style.background = '#f8fafc';
                                }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#EB4641' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '1.1rem 3.5rem',
                                    borderRadius: '0',
                                    border: '1px solid var(--border-color)',
                                    background: '#f8fafc',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    color: 'var(--text-primary)',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.background = '#fff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-color)';
                                    e.target.style.background = '#f8fafc';
                                }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1.25rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '500' }}>
                            <input type="checkbox" style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)', borderRadius: '0' }} /> Keep me logged in
                        </label>
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#F27A76', fontWeight: '700' }}>Forgot password?</Link>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', marginBottom: '2.5rem', borderRadius: '0', fontSize: '1.1rem', fontWeight: '700', boxShadow: 'none' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In Account'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#F27A76', fontWeight: '800' }}>Sign up for free</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
