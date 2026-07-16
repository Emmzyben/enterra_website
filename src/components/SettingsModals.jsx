import React, { useState } from 'react';
import { X, Bell, Mail, Lock, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const ModalStyles = () => (
    <style>{`
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 1.5rem;
            animation: modalFadeIn 0.3s ease-out;
        }
        .modal-content {
            background: white;
            border-radius: 0;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
            animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 10000;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes modalSlideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-close {
            background: #f8fafc;
            border: none;
            border-radius: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #64748b;
            transition: all 0.2s;
        }
        .modal-close:hover {
            background: #f1f5f9;
            color: #0f172a;
            transform: rotate(90deg);
        }
        .modal-body { 
            padding: 2rem; 
            overflow-y: auto;
            flex: 1;
        }
        .modal-footer {
            padding: 1.5rem 2rem;
            background: #f8fafc;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            border-top: 1px solid #f1f5f9;
        }
        .form-input {
            width: 100%;
            padding: 0.85rem 1rem;
            border-radius: 0;
            border: 1px solid #e2e8f0;
            outline: none;
            transition: all 0.2s;
            font-size: 1rem;
        }
        .form-input:focus { 
            border-color: #EB4641; 
            box-shadow: 0 0 0 4px rgba(235, 70, 65, 0.1); 
        }
        .toggle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem;
            background: #f8fafc;
            border-radius: 0;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid transparent;
        }
        .toggle-item:hover {
            background: #f1f5f9;
            border-color: #e2e8f0;
        }
        .icon-box {
            padding: 0.6rem;
            background: white;
            border-radius: 0;
            color: #EB4641;
            border: 1px solid #e2e8f0;
        }
    `}</style>
);

export const AccountSettingsModal = ({ isOpen, onClose }) => {
    const { user, token, updateUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [notifs, setNotifs] = useState({
        email: user?.email_notifications !== 0,
        inApp: user?.in_app_notifications !== 0
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/update_settings.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    emailNotifications: notifs.email ? 1 : 0,
                    inAppNotifications: notifs.inApp ? 1 : 0
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                updateUser({
                    email,
                    email_notifications: notifs.email ? 1 : 0,
                    in_app_notifications: notifs.inApp ? 1 : 0
                });
                showToast('Settings updated successfully!', 'success');
                onClose();
            } else {
                showToast(data.message || 'Error updating settings', 'error');
            }
        } catch (err) {
            showToast('Connection error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <ModalStyles />
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#FEF2F2', color: '#EB4641', borderRadius: '0' }}>
                            <Bell size={24} style={{ color: '#EB4641' }} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Account Settings</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Manage preferences</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div className="setting-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#EB4641' }} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: '2.8rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Notification Preferences</h4>

                        <label className="toggle-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="icon-box"><Mail size={18} /></div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600' }}>Email Notifications</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Get updates via email</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                checked={notifs.email}
                                onChange={() => setNotifs({ ...notifs, email: !notifs.email })}
                            />
                        </label>

                        <label className="toggle-item" style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="icon-box"><Bell size={18} /></div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600' }}>In-App Notifications</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>See alerts in dashboard</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                checked={notifs.inApp}
                                onChange={() => setNotifs({ ...notifs, inApp: !notifs.inApp })}
                            />
                        </label>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SecurityModal = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    if (!isOpen) return null;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast("New passwords do not match!", 'warning');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/change_password.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                showToast('Password changed successfully!', 'success');
                onClose();
            } else {
                showToast(data.message || 'Error changing password', 'error');
            }
        } catch (err) {
            showToast('Connection error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <ModalStyles />
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0' }}>
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Security</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Change password</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <form onSubmit={handleChangePassword}>
                    <div className="modal-body">
                        <div className="setting-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Current Password</label>
                            <input
                                type="password"
                                className="form-input"
                                required
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            />
                        </div>

                        <div style={{ height: '1px', background: '#f1f5f9', margin: '2rem 0' }}></div>

                        <div className="setting-group" style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                required
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            />
                        </div>

                        <div className="setting-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                required
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }} disabled={loading}>
                            {loading ? 'Updating...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const DeleteAccountModal = ({ isOpen, onClose }) => {
    const { token, logout } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') {
            showToast("Please type DELETE to confirm.", 'warning');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/delete_account.php`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'success') {
                showToast('Account deleted successfully. We\'re sorry to see you go.', 'success');
                logout();
                navigate('/');
            } else {
                showToast(data.message || 'Error deleting account', 'error');
            }
        } catch (err) {
            showToast('Connection error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <ModalStyles />
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Delete Account</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>This action is permanent</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '0', border: '1px solid #fecaca', marginBottom: '1.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#991b1b', lineHeight: '1.5' }}>
                            <strong>Warning:</strong> Deleting your account will permanently remove all your messages, profile data, and history. This cannot be undone.
                        </p>
                    </div>

                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Please type <strong>DELETE</strong> in the box below to confirm.</p>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Type DELETE here"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        style={{ borderBottomColor: confirmText === 'DELETE' ? '#dc2626' : '#e2e8f0' }}
                    />
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleDelete}
                        className="btn"
                        style={{
                            background: confirmText === 'DELETE' ? '#dc2626' : '#fecaca',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0',
                            fontWeight: '600',
                            cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: 'none'
                        }}
                        disabled={loading || confirmText !== 'DELETE'}
                    >
                        <Trash2 size={18} /> {loading ? 'Deleting...' : 'Permanently Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};
