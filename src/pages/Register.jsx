import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const { register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formData);
    };

    return (
        <div style={{
            ...containerStyle,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            background: '#f8fafc'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2,
                background: '#ffffff',
                padding: '3rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }} className="registration-container">

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>
                        Join Enterra today
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Full Name</label>
                            <div style={inputContainerStyle}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Email Address</label>
                            <div style={inputContainerStyle}>
                                <Mail size={18} style={iconStyle} />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    style={inputStyle}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Phone Number</label>
                            <div style={inputContainerStyle}>
                                <Phone size={18} style={iconStyle} />
                                <input
                                    type="tel"
                                    placeholder="+234 800 000 0000"
                                    style={inputStyle}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Password</label>
                            <div style={inputContainerStyle}>
                                <Lock size={18} style={iconStyle} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    style={{ ...inputStyle, paddingRight: '3rem' }}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={eyeBtnStyle}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', marginTop: '2.5rem', fontSize: '1.1rem', borderRadius: '0', fontWeight: '700', boxShadow: 'none' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Sign Up for Free'}
                        {!loading && <ArrowRight size={20} style={{ marginLeft: '10px' }} />}
                    </button>

                    <div style={{ marginTop: '2.5rem' }}>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Already have an account? <Link to="/login" style={{ color: '#EB4641', fontWeight: '800', textDecoration: 'none' }}>Log In</Link>
                        </p>
                    </div>
                </form>
            </div>
            <style>{`
                :root {
                    --text-primary: #0f172a;
                    --text-secondary: #64748b;
                    --border-color: #e2e8f0;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                @media (max-width: 992px) {
                    .registration-container {
                        max-width: 100% !important;
                        padding: 2rem !important;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

// Styles
const containerStyle = { minHeight: '100vh', padding: '2rem', background: '#ffffff', paddingTop: '8rem', paddingBottom: '6rem' };
const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' };
const inputContainerStyle = { position: 'relative' };
const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 3.5rem',
    borderRadius: '0',
    border: '1px solid var(--border-color)',
    background: '#f8fafc',
    outline: 'none',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    transition: 'all 0.2s'
};
const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const eyeBtnStyle = { position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' };

export default Register;
