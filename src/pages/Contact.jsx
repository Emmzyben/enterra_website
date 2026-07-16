import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Plus, Minus } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        showToast('Thank you for contacting Enterra! We will get back to you shortly.', 'success');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    };

    return (
        <div style={{ paddingTop: '8rem', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="container">
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        We're here to <span className="text-gradient">help.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                        Have a question about booking, profiles, or becoming a vendor? Our team is available 24/7.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '4rem',
                    marginBottom: '8rem'
                }}>
                    {/* Contact Form */}
                    <div style={{
                        background: 'white',
                        padding: '3rem',
                        borderRadius: '0',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Send us a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '0',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-hover)',
                                        outline: 'none'
                                    }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '0',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-hover)',
                                        outline: 'none'
                                    }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Subject</label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '0',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-hover)',
                                        outline: 'none'
                                    }}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option>General Inquiry</option>
                                    <option>Booking Issue</option>
                                    <option>Booking Question</option>
                                    <option>Become a Vendor</option>
                                    <option>Report a User</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="How can we help you?"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '0',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-hover)',
                                        outline: 'none',
                                        resize: 'none'
                                    }}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Support Channels */}
                    <div>
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Support Channels</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <ContactMethod
                                    icon={<Mail size={24} />}
                                    title="Email Support"
                                    desc="help@enterra.com"
                                    sub="Average response: 2 hours"
                                />
                                <ContactMethod
                                    icon={<Phone size={24} />}
                                    title="Phone Support"
                                    desc="+234 800 ENTERRA"
                                    sub="Available 9am - 6pm (Mon-Fri)"
                                />
                                <ContactMethod
                                    icon={<MessageCircle size={24} />}
                                    title="Live Chat"
                                    desc="Click the icon on bottom left"
                                    sub="Available 24/7 for urgent issues"
                                />
                                <ContactMethod
                                    icon={<MapPin size={24} />}
                                    title="Office Address"
                                    desc="Victoria Island, Lagos, Nigeria"
                                    sub="By appointment only"
                                />
                            </div>
                        </div>

                        {/* Quick FAQ */}
                        <div style={{ background: 'var(--surface-hover)', padding: '2rem', borderRadius: '0', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Common Questions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <details style={{ cursor: 'pointer' }}>
                                    <summary style={{ fontWeight: '600', fontSize: '0.95rem' }}>How do I pay a vendor?</summary>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        Payments are handled directly between you and the vendor. We recommend discussing and agreeing on payment terms during your consultation.
                                    </p>
                                </details>
                                <details style={{ cursor: 'pointer' }}>
                                    <summary style={{ fontWeight: '600', fontSize: '0.95rem' }}>What if a vendor doesn't show up?</summary>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                        If a vendor fails to appear, please report them immediately. We maintain high standards and will take necessary actions, including profile suspension.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactMethod = ({ icon, title, desc, sub }) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{
            width: '48px',
            height: '48px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{title}</h4>
            <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{desc}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sub}</div>
        </div>
    </div>
);

export default Contact;
