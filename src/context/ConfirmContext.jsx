import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);

    const confirm = useCallback((message, options = {}) => {
        return new Promise((resolve) => {
            setConfig({
                message,
                title: options.title || 'Are you sure?',
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'danger', // danger, info, warning
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        if (config) {
            config.resolve(true);
            setConfig(null);
        }
    };

    const handleCancel = () => {
        if (config) {
            config.resolve(false);
            setConfig(null);
        }
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {config && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '1.5rem',
                    animation: 'modalFadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '0',
                        width: '100%',
                        maxWidth: '440px',
                        padding: '2.5rem',
                        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4)',
                        animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        textAlign: 'center',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.5)'
                    }}>
                        <button
                            onClick={handleCancel}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: '#f8fafc',
                                border: 'none',
                                borderRadius: '0',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                        >
                            <X size={18} />
                        </button>

                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '0',
                            background: config.type === 'danger' ? '#FEF2F2' : '#FEF2F2',
                            color: config.type === 'danger' ? '#EB4641' : '#EB4641',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            transform: 'rotate(-5deg)'
                        }}>
                            <AlertTriangle size={40} />
                        </div>

                        <h3 style={{
                            fontSize: '1.75rem',
                            margin: '0 0 1rem 0',
                            color: '#0f172a',
                            fontWeight: '800',
                            letterSpacing: '-0.02em'
                        }}>{config.title}</h3>

                        <p style={{
                            margin: '0 0 2.5rem 0',
                            color: '#64748b',
                            lineHeight: '1.6',
                            fontSize: '1.05rem'
                        }}>{config.message}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <button
                                onClick={handleCancel}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    color: '#64748b',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                {config.cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0',
                                    border: 'none',
                                    background: config.type === 'danger' ? '#EB4641' : '#EB4641',
                                    color: 'white',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    boxShadow: config.type === 'danger'
                                        ? '0 10px 20px -5px rgba(235, 70, 65, 0.4)'
                                        : '0 10px 20px -5px rgba(235, 70, 65, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = config.type === 'danger'
                                        ? '0 15px 25px -5px rgba(235, 70, 65, 0.5)'
                                        : '0 15px 25px -5px rgba(235, 70, 65, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = config.type === 'danger'
                                        ? '0 10px 20px -5px rgba(235, 70, 65, 0.4)'
                                        : '0 10px 20px -5px rgba(235, 70, 65, 0.4)';
                                }}
                            >
                                {config.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes modalFadeIn { 
                    from { opacity: 0; } 
                    to { opacity: 1; } 
                }
                @keyframes modalSlideUp { 
                    from { transform: translateY(30px) scale(0.95); opacity: 0; } 
                    to { transform: translateY(0) scale(1); opacity: 1; } 
                }
            `}</style>
        </ConfirmContext.Provider>
    );
};
