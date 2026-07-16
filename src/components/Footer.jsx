import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const SocialIcon = ({ icon }) => (
    <a href="#" style={{
        width: '40px',
        height: '40px',
        borderRadius: '0',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        transition: 'all 0.2s',
        border: '1px solid rgba(255,255,255,0.1)'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        {icon}
    </a>
);

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            padding: '5rem 0 2rem',
            background: '#020617',
            color: '#94a3b8'
        }}>
            <div className="container">
                <div className="footer-grid">


                    {/* Brand Column */}
                    <div className="footer-brand">
                        <div className="logo-footer" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={"/logo.png"} alt="" style={{ width: '200px' }} />
                        </div>
                        <p style={{ maxWidth: '300px', marginBottom: '2rem' }}>
                            The safest way to find and connect with event professionals in Nigeria.
                            Verified professionals, seamless connections, and peace of mind.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <SocialIcon icon={<Twitter size={20} />} />
                            <SocialIcon icon={<Instagram size={20} />} />
                            <SocialIcon icon={<Linkedin size={20} />} />
                            <SocialIcon icon={<Facebook size={20} />} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Platform</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/vendors" className="hover-text">Browse Vendors</Link></li>
                            <li><a href="#how-it-works" className="hover-text">How it Works</a></li>
                            <li><Link to="/safety" className="hover-text">Trust & Safety</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Company</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/about" className="hover-text">About Us</Link></li>
                            <li><Link to="/contact" className="hover-text">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem' }}>Stay Updated</h4>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Get the latest tips on event planning.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid #334155',
                                    padding: '0.75rem',
                                    borderRadius: '0',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                background: 'var(--primary)',
                                border: 'none',
                                borderRadius: '0',
                                padding: '0 1rem',
                                color: 'white',
                                cursor: 'pointer'
                            }}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '0.9rem' }}>© 2026 Enterra Inc. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                        <Link to="/safety" className="hover-text">Safety Policy</Link>
                        <Link to="/privacy" className="hover-text">Privacy Policy</Link>
                        <Link to="/terms" className="hover-text">Terms of Service</Link>
                    </div>
                </div>
            </div>
            <style>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 4rem;
                    margin-bottom: 4rem;
                }
                .footer-brand {
                    grid-column: span 2;
                }
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .footer-brand {
                        grid-column: span 1;
                    }
                    .footer-grid > div {
                        text-align: center;
                    }
                    .logo-footer, .footer-brand p, .footer-brand div {
                        justify-content: center;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .footer-brand div {
                        display: flex;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
