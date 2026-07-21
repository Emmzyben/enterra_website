import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const email = location.state?.email || '';

  React.useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(c => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('No email was provided for verification.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      if (response.ok || data.status === 'success') {
        showToast('Email verified successfully.', 'success');
        navigate('/dashboard');
      } else {
        showToast(data.message || 'Verification failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok || data.status === 'success' || data.message?.toLowerCase().includes('resent')) {
        showToast('A new verification code has been sent to your email.', 'success');
        setResendCooldown(60);
      } else {
        showToast(data.message || 'Could not resend code.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
      console.error(err);
    } finally {
      setResending(false);
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
        maxWidth: '460px',
        background: '#fff',
        padding: '3rem',
        border: '1px solid #e2e8f0'
      }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: '700', marginBottom: '1.75rem' }}>
          <ChevronLeft size={16} /> Back to login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '999px', background: '#ecfeff', marginBottom: '1rem' }}>
            <MailCheck size={28} color="#0f766e" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Verify your email</h1>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            We sent a 6-digit verification code to <strong>{email || 'your email'}</strong>.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '700', color: '#334155' }}>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
              style={{
                width: '100%',
                padding: '1rem 1.1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0',
                background: '#f8fafc',
                fontSize: '1rem'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '1.1rem', border: 'none', background: '#EB4641', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
            {loading ? 'Verifying...' : 'Verify Email'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? '#9ca3af' : '#EB4641',
              fontWeight: 700,
              cursor: (resendCooldown > 0 || resending) ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              textDecoration: resendCooldown > 0 ? 'none' : 'underline'
            }}
          >
            {resending ? 'Resending...' : resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Didn't receive code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
