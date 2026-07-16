import React, { useState } from 'react';
import { Coins, CreditCard, History, ArrowRight, Zap, CheckCircle, AlertCircle } from 'lucide-react';
// import { usePaystackPayment } from 'react-paystack'; // Disabled for simulation
import useAuth from '../hooks/useAuth';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';

const Wallet = () => {
    const { user, token, updateUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedTokens, setSelectedTokens] = useState(20);

    const tokenPrice = 50; // 50 Naira per token (10 tokens = 500 Naira)
    const amount = selectedTokens * tokenPrice;

    // Disabled for simulation:
    // const config = { ... };
    // const initializePayment = usePaystackPayment(config);
    // const onSuccess = (ref) => verifyPayment(ref.reference);
    // const onClose = () => showToast("Payment cancelled", "info");

    const handlePurchase = () => {
        const dummyRef = "SIM_PAYSTACK_" + new Date().getTime();
        verifyPayment(dummyRef);
    };

    const verifyPayment = async (ref) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/payment/verify-paystack`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reference: ref,
                    tokens: selectedTokens
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                showToast(`Successfully purchased ${selectedTokens} tokens!`, 'success');
                updateUser({ tokens: data.tokens });
            } else {
                showToast(data.message || "Verification failed", 'error');
            }
        } catch (error) {
            console.error("Verification error:", error);
            showToast("Server error during verification. We will check manually.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const packages = [
        { tokens: 10, price: 500, popular: false },
        { tokens: 20, price: 1000, popular: true },
        { tokens: 50, price: 2500, popular: false },
        { tokens: 100, price: 5000, popular: false }
    ];

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '100%' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Your Token Wallet</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your tokens and top up your balance.</p>
                </div>

                <div className="wallet-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                    {/* Balance Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="panel" style={{ background: '#0f172a', color: 'white', padding: '1.25rem', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '0.9rem' }}>Balance</span>
                                <Coins size={20} color="#FFD700" fill="#FFD700" />
                            </div>
                            <div style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                                {user?.tokens || 0}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                Platform Tokens
                            </div>
                        </div>

                        <div className="panel" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={18} color="var(--primary)" />
                                Token Usage
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Initiate New Chat</span>
                                    <span style={{ fontWeight: '700' }}>3 Tokens</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span>Upload Portfolio Project</span>
                                    <span style={{ fontWeight: '700' }}>5 Tokens</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Each token is ₦50. You get 20 tokens free on signup.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top-up Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Top Up Tokens</h3>

                            <div className="wallet-packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {packages.map((pkg) => (
                                    <button
                                        key={pkg.tokens}
                                        onClick={() => setSelectedTokens(pkg.tokens)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0',
                                            border: selectedTokens === pkg.tokens ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            background: selectedTokens === pkg.tokens ? 'rgba(235, 70, 65, 0.02)' : 'white',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            position: 'relative',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {pkg.popular && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                padding: '0.15rem 0.5rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase'
                                            }}>Popular</span>
                                        )}
                                        <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.15rem' }}>{pkg.tokens}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₦{pkg.price.toLocaleString()}</div>
                                    </button>
                                ))}
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total to Pay</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>₦{amount.toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    Paystack Secure Payment
                                </div>
                            </div>

                            <button
                                onClick={handlePurchase}
                                disabled={loading}
                                className="btn btn-primary hover:bg-primary/80 cursor-pointer"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                            >
                                {loading ? 'Processing...' : `Purchase ${selectedTokens} Tokens`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
