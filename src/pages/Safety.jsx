import React from 'react';

const PolicySection = ({ title, children }) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>{title}</h2>
        <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>
            {children}
        </div>
    </div>
);

const Safety = () => {
    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', padding: '10rem 0 8rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    Safety Policy
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Our commitment to maintaining a professional and safe environment for discovery.
                </p>

                <PolicySection title="1. Platform Purpose">
                    <p>
                        Enterra is an online meeting point designed to facilitate the discovery and connection between entertainment vendors and potential clients. We provide the tools for vendors to showcase their work and for clients to find the right talent for their events.
                    </p>
                </PolicySection>

                <PolicySection title="2. No On-Platform Payments">
                    <p style={{ fontWeight: '700', color: '#0f172a', background: '#fff1f1', padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        IMPORTANT: Enterra does not process any payments, escrow, or financial transactions on the platform. We are not a payment gateway.
                    </p>
                    <p style={{ marginTop: '1.5rem' }}>
                        All financial agreements, deposits, and final payments are handled directly between the client and the vendor outside of Enterra. We do not provide escrow services and do not take responsibility for any payment disputes or losses.
                    </p>
                </PolicySection>

                <PolicySection title="3. Private Contracts">
                    <p>
                        Any work agreements or contracts established are private arrangements between the user and the vendor. Enterra is not a party to these contracts. We strongly recommend that both parties document their agreements in writing and agree on clear terms before starting any engagement.
                    </p>
                </PolicySection>

                <PolicySection title="4. Vendor Verification">
                    <p>
                        While we vet vendors through identity and business registration checks (CAC) to ensure legitimacy, this does not constitute a guarantee of service quality. We encourage all clients to:
                    </p>
                    <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li>• Review the vendor's portfolio and past work.</li>
                        <li>• Read verified reviews from other Enterra users.</li>
                        <li>• Conduct an initial interview or meeting before committing.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="5. Safety Guidelines">
                    <p>To ensure a safe experience, we recommend following these best practices:</p>
                    <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><strong>Stay on the Platform for Chat:</strong> Keep your initial conversations and negotiations within Enterra's messaging system to maintain a clear record of communication.</li>
                        <li><strong>Public Meetings:</strong> If meeting a vendor or client in person for the first time, choose a public location during daylight hours.</li>
                        <li><strong>Secure Payments:</strong> Since payments are handled offline, use secure and traceable payment methods. Avoid sending cash or using untraceable transfer methods.</li>
                        <li><strong>Report Suspicious Activity:</strong> If you encounter a profile that seems fraudulent or receive unprofessional messages, please report it to our team immediately.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="6. Contact Support">
                    <p>
                        If you have questions about our safety procedures or wish to report a concern, please contact our community safety team via our contact page.
                    </p>
                </PolicySection>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem', marginTop: '5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Last Updated: April 14, 2026
                </div>
            </div>
        </div>
    );
};

export default Safety;
