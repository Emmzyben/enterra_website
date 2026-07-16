import React from 'react';
import { Users, Search, MessageSquare, Handshake, AlertCircle, Focus, Target } from 'lucide-react';

const AboutSection = ({ title, icon: Icon, children }) => (
    <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
                background: 'var(--surface-hover)',
                padding: '0.5rem',
                borderRadius: '0',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>
            {title}
        </h2>
        <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem', paddingLeft: '3.25rem' }}>
            {children}
        </div>
    </div>
);

const About = () => {
    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', padding: '10rem 0 8rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    About Enterra
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '4rem', lineHeight: '1.6' }}>
                    Enterra is a modern platform for discovering event talent, connecting with trusted professionals, and managing experiences from planning to ticketing. It brings together clients, vendors, and organizers in one reliable space.
                </p>

                <AboutSection title="What Enterra Offers" icon={Target}>
                    <p>
                        Enterra brings together everything needed for modern event experiences. Clients can discover verified vendors, compare portfolios, and start conversations with professionals in minutes. Organizers can also enroll, publish events, manage ticket tiers, and use built-in event tools to streamline operations.
                    </p>
                </AboutSection>

                <AboutSection title="A Trusted Meeting Point" icon={Focus}>
                    <p>
                        Enterra is designed as a simple meeting point between people who need event services and the professionals who provide them. It is not a rigid marketplace with forced transactions; instead, it helps users discover the right fit, communicate clearly, and move forward with confidence.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        From vendor discovery and direct chat to event organization and ticketing, the platform gives users a flexible place to build and manage their event plans.
                    </p>
                </AboutSection>

                <AboutSection title="Built for Clients, Vendors, and Organizers" icon={Users}>
                    <p>
                        Whether you are planning a wedding, a concert, a private party, or a branded experience, Enterra supports the full journey. Clients can browse talented vendors, organizers can manage hosted events, and vendors can showcase work, connect with opportunities, and grow their visibility.
                    </p>
                </AboutSection>

                <AboutSection title="How the Platform Works" icon={Search}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', width: '90px', flexShrink: 0 }}>1. Discover</div>
                            <div>Browse vendors by category, location, and rating to find the right fit for your event.</div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', width: '90px', flexShrink: 0 }}>2. Connect</div>
                            <div>Use direct messaging to discuss ideas, availability, and requirements with confidence.</div>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', width: '90px', flexShrink: 0 }}>3. Manage</div>
                            <div>Organizers can create events, add ticket tiers, and streamline check-in with built-in ticketing features.</div>
                        </li>
                    </ul>
                </AboutSection>

                <AboutSection title="Why Enterra Stands Out" icon={Handshake}>
                    <p>
                        Enterra is built to make event planning simpler, more transparent, and more collaborative. By combining discovery, communication, and event management in one platform, it helps users move from idea to execution without unnecessary friction.
                    </p>
                </AboutSection>


            </div>
        </div>
    );
};

export default About;
