import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, CheckCircle, KeyRound } from 'lucide-react';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('request');

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok || data.status === 'success') {
                setStep('reset');
                showToast('Reset code sent to your email.', 'success');
            } else {
                showToast(data.message || 'Something went wrong. Please try again.', 'error');
            }
        } catch (err) {
            showToast('Connection error. Please try again.', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password-with-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword })
            });

            const data = await response.json();

            if (response.ok || data.status === 'success') {
                setStep('done');
                showToast('Password reset successfully.', 'success');
            } else {
                showToast(data.message || 'Unable to reset password.', 'error');
            }
        } catch (err) {
            showToast('Connection error. Please try again.', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                <Link to="/login" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    marginBottom: '2.5rem',
                    fontWeight: '700',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0',
                    background: '#f1f5f9',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s'
                }}>
                    <ChevronLeft size={16} /> Back to Login
                </Link>

                {step === 'request' ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Reset Password</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
                                Enter your email and we'll send you a reset code to continue.
                            </p>
                        </div>

                        <form onSubmit={handleRequestCode}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '0', fontSize: '1.1rem', fontWeight: '700', boxShadow: 'none' }} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Code'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </button>
                        </form>
                    </>
                ) : step === 'reset' ? (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '999px', background: '#fef3c7', marginBottom: '1rem' }}>
                                <KeyRound size={24} color="#92400e" />
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>Enter reset code</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>We sent a 6-digit code to <strong>{email}</strong>.</p>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Reset Code</label>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="123456" style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '0', border: '1px solid var(--border-color)', background: '#f8fafc', outline: 'none', fontSize: '1rem', color: 'var(--text-primary)', transition: 'all 0.2s' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '0', border: '1px solid var(--border-color)', background: '#f8fafc', outline: 'none', fontSize: '1rem', color: 'var(--text-primary)', transition: 'all 0.2s' }} />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '0', fontSize: '1.1rem', fontWeight: '700', boxShadow: 'none' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#f0fdf4',
                            color: '#22c55e',
                            borderRadius: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            border: '1px solid #dcfce7'
                        }}>
                            <CheckCircle size={40} />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Password reset complete</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '1rem' }}>
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                        <Link to="/login" className="btn btn-secondary" style={{ display: 'inline-flex', width: 'auto', padding: '1.1rem 2.5rem', borderRadius: '0', background: '#ffffff', color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem', border: '1px solid var(--border-color)' }}>
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
            <style>{`
                :root {
                    --text-primary: #0f172a;
                    --text-secondary: #64748b;
                    --border-color: #e2e8f0;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
