import React, { useState } from 'react';
import { MailCheck, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';

const VerifyEmailBanner = ({ compact = false }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const isVerified = user?.is_verified === 1 || user?.is_verified === true;

  if (!user || isVerified) {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      showToast('No email is available for verification.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code })
      });

      const data = await response.json();
      if (response.ok || data.status === 'success') {
        updateUser({ is_verified: 1, email_verified_at: new Date().toISOString() });
        setCode('');
        showToast('Email verified successfully.', 'success');
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#fff7ed',
        border: '1px solid #fdba74',
        borderRadius: '24px',
        padding: compact ? '1.25rem 1.5rem' : '2rem',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '999px', background: '#ffedd5', flexShrink: 0 }}>
            <MailCheck size={22} color="#c2410c" />
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h3 style={{ margin: '0 0 0.35rem 0', fontSize: compact ? '1rem' : '1.15rem', color: '#9a2c0c', fontWeight: 800 }}>
              Verify your email to unlock full access
            </h3>
            <p style={{ margin: 0, color: '#7c2d12', lineHeight: 1.6 }}>
              Enter the 6-digit code we sent to <strong>{user.email}</strong>.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            required
            style={{
              flex: '1 1 220px',
              minWidth: '220px',
              padding: '0.95rem 1rem',
              borderRadius: '10px',
              border: '1px solid #fdba74',
              background: '#fff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '0.95rem 1.15rem',
            border: 'none',
            borderRadius: '10px',
            background: '#EB4641',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            {loading ? 'Verifying...' : 'Verify'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailBanner;
