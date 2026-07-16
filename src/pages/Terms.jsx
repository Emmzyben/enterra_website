import React from 'react';

const PolicySection = ({ title, children }) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>{title}</h2>
        <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>
            {children}
        </div>
    </div>
);

const Terms = () => {
    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', padding: '10rem 0 8rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    Terms of Service
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Please read these terms carefully before using the Enterra matching platform.
                </p>

                <PolicySection title="1. Acceptance of Terms">
                    <p>
                        By accessing and using Enterra, you agree to be bound by these Terms of Service. If you do not agree to these terms, you should not use our platform.
                    </p>
                </PolicySection>

                <PolicySection title="2. Platform Scope">
                    <p>
                        Enterra acts solely as a discovery and communication hub for entertainment vendors and clients. We do not provide the entertainment services ourselves, nor do we act as an agent for any vendor.
                    </p>
                </PolicySection>

                <PolicySection title="3. User Responsibilities">
                    <p>
                        Users are responsible for the accuracy of the information they provide. Vendors must represent their services truthfully. Clients are responsible for conducting their own due diligence before hiring a vendor found on the platform.
                    </p>
                </PolicySection>

                <PolicySection title="4. No Financial Transactions">
                    <p style={{ fontWeight: '700', color: '#0f172a' }}>
                        Enterra does not facilitate, process, or monitor payments between users. Any financial transactions occur strictly off-platform and are the sole responsibility of the parties involved.
                    </p>
                </PolicySection>

                <PolicySection title="5. Limitation of Liability">
                    <p>
                        Enterra is not liable for any losses, damages, or disputes arising from agreements made between users. We do not guarantee the performance of any vendor or the payment by any client. Users use the platform and its connections at their own risk.
                    </p>
                </PolicySection>

                <PolicySection title="6. User Conduct">
                    <p>
                        Users must interact professionally and respectfully. Any fraudulent activity, harassment, or misuse of the platform will lead to immediate account termination.
                    </p>
                </PolicySection>

                <PolicySection title="7. Modifications to Service">
                    <p>
                        We reserve the right to modify or discontinue any part of the Enterra service at any time without prior notice.
                    </p>
                </PolicySection>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem', marginTop: '5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Last Updated: April 14, 2026
                </div>
            </div>
        </div>
    );
};

export default Terms;
