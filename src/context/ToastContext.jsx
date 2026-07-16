import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'none'
            }}>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const colors = {
        success: {
            bg: '#EB4641',
            border: '#EB4641',
            icon: '#ffffffff'
        },
        error: {
            bg: '#EB4641',
            border: '#EB4641',
            icon: '#e2dcdbff'
        },
        info: {
            bg: '#EB4641',
            border: '#EB4641',
            icon: '#f3ececff'
        },
        warning: {
            bg: '#EB4641',
            border: '#EB4641',
            icon: '#f3ececff'
        }
    };

    const config = colors[type] || colors.info;

    return (
        <div style={{
            minWidth: '320px',
            maxWidth: '420px',
            background: config.bg,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${config.border}`,
            borderRadius: '0',
            padding: '1rem 1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'toast-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            pointerEvents: 'auto',
            color: 'white'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '0',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {type === 'success' && <CheckCircle2 size={24} color={config.icon} />}
                {type === 'error' && <AlertCircle size={24} color={config.icon} />}
                {type === 'info' && <Info size={24} color={config.icon} />}
                {type === 'warning' && <AlertTriangle size={24} color={config.icon} />}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', lineHeight: '1.4' }}>{message}</p>
            </div>
            <button onClick={onClose} style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                borderRadius: '0'
            }}>
                <X size={18} />
            </button>
            <style>{`
                @keyframes toast-in {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
