import React from 'react';

const PolicySection = ({ title, children }) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>{title}</h2>
        <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>
            {children}
        </div>
    </div>
);

const Privacy = () => {
    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', padding: '10rem 0 8rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    Privacy Policy
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem', lineHeight: '1.6' }}>
                    Your privacy is important to us. This policy outlines how we handle your data at Enterra.
                </p>

                <PolicySection title="1. Information We Collect">
                    <p>We collect information that you provide directly to us when you create an account, update your profile, or communicate with other users:</p>
                    <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><strong>Account Data:</strong> Name, email address, phone number, and password.</li>
                        <li><strong>Profile Data:</strong> For vendors, this includes business location, category, portfolio images, and bio.</li>
                        <li><strong>Communication Data:</strong> Messages sent through our internal chat system.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="2. How We Use Your Information">
                    <p>We use the collected data to provide and improve our matching platform, including:</p>
                    <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li>Connecting clients with relevant entertainment professionals.</li>
                        <li>Facilitating communication between users.</li>
                        <li>Verifying vendor identities and business legitimacy.</li>
                        <li>Sending important service updates and security alerts.</li>
                    </ul>
                </PolicySection>

                <PolicySection title="3. Data Sharing">
                    <p>
                        Vendor profile information is public to allow clients to discover your services. Personal contact information (like phone numbers) is shared only between connected parties during the matching process. We do not sell your personal data to third-party advertisers.
                    </p>
                </PolicySection>

                <PolicySection title="4. Data Security">
                    <p>
                        We implement standard security measures to protect your data from unauthorized access. However, as Enterra does not process payments, we do not store sensitive financial information like credit card numbers.
                    </p>
                </PolicySection>

                <PolicySection title="5. Your Choices">
                    <p>
                        You can update your profile information or delete your account at any time through your dashboard settings. For any specific data requests, you can reach out to our support team.
                    </p>
                </PolicySection>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem', marginTop: '5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Last Updated: April 14, 2026
                </div>
            </div>
        </div>
    );
};

export default Privacy;
