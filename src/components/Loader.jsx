import React from 'react';

/**
 * Reusable Loader component.
 *
 * Props:
 *  - fullPage (bool)    : Centers in the full viewport. Default: false
 *  - message  (string)  : Optional text beneath the spinner
 *  - size     (string)  : 'sm' | 'md' | 'lg'. Default: 'md'
 *  - color    (string)  : CSS color string. Default: 'var(--primary, #EB4641)'
 */
const Loader = ({
    fullPage = false,
    message = '',
    size = 'md',
    color = 'var(--primary, #EB4641)'
}) => {
    const sizes = {
        sm: { ring: 28, border: 3, dot: 6 },
        md: { ring: 48, border: 4, dot: 10 },
        lg: { ring: 72, border: 5, dot: 14 },
    };
    const s = sizes[size] || sizes.md;

    const spinner = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            {/* Outer ring */}
            <div style={{ position: 'relative', width: s.ring, height: s.ring }}>
                {/* Track ring */}
                <div style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '0',
                    border: `${s.border}px solid rgba(0,0,0,0.07)`
                }} />
                {/* Spinning arc */}
                <div className="loader-spin" style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '0',
                    border: `${s.border}px solid transparent`,
                    borderTopColor: color,
                    borderRightColor: color,
                }} />
                {/* Center pulse dot */}
                <div className="loader-pulse" style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: s.dot,
                    height: s.dot,
                    borderRadius: '0',
                    background: color,
                    opacity: 0.8,
                }} />
            </div>

            {message && (
                <p style={{
                    margin: 0,
                    fontSize: size === 'sm' ? '0.8rem' : size === 'lg' ? '1.05rem' : '0.9rem',
                    fontWeight: '600',
                    color: '#94a3b8',
                    letterSpacing: '0.01em',
                    animation: 'loader-blink 1.5s ease-in-out infinite'
                }}>
                    {message}
                </p>
            )}

            <style>{`
                .loader-spin {
                    animation: loader-rotate 0.85s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite;
                }
                .loader-pulse {
                    animation: loader-scale 1.7s ease-in-out infinite;
                }
                @keyframes loader-rotate {
                    to { transform: rotate(360deg); }
                }
                @keyframes loader-scale {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                    50%       { transform: translate(-50%, -50%) scale(1.4); opacity: 0.4; }
                }
                @keyframes loader-blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.5; }
                }
            `}</style>
        </div>
    );

    if (fullPage) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--bg-color, #f8fafc)'
            }}>
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loader;
