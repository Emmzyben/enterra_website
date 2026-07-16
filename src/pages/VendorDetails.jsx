import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin, Star, Share2, Heart, MessageSquare,
    CheckCircle, ChevronLeft, ShieldCheck,
    Calendar, Award, Info, Image as ImageIcon,
    Users, Clock, Trophy, ExternalLink
} from 'lucide-react';
import useVendorDetails from '../hooks/useVendorDetails';
import useAuth from '../hooks/useAuth';
import API_URL from '../config';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Loader from '../components/Loader';

const CATEGORY_COVERS = {
    'DJ': 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=1950&q=80',
    'Photographer': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1950&q=80',
    'Makeup Artist': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1950&q=80',
    'Catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1950&q=80',
    'Planner': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1950&q=80',
    'Live Band': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1950&q=80',
    'default': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1950&q=80'
};

const VendorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const { user, token, updateUser } = useAuth();
    const { vendor, loading, error } = useVendorDetails(id);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [portfolio, setPortfolio] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        if (id && user) {
            fetch(`${API_URL}/favorites/status?vendor_id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') setIsFavorited(data.is_favorited);
                });
        }
    }, [id, user, token]);

    const handleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vendor_id: id })
            });
            const result = await response.json();
            if (result.status === 'success') {
                setIsFavorited(result.action === 'added');
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/reviews/get.php?vendor_id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') setReviews(data.reviews);
                });

            fetch(`${API_URL}/vendors/get-portfolio?vendor_id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') setPortfolio(data.data);
                });
        }
    }, [id]);

    const handleMessage = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.user_type === 'vendor') {
            showToast("Vendors cannot initiate chats.", "error");
            return;
        }

        const isConfirmed = await confirm(
             "Initiating a new chat with this vendor costs 3 Tokens. (If you already have an active chat, no tokens are deducted).",
             { title: "Initiate Chat", confirmText: "Proceed", type: "info" }
        );
        
        if (!isConfirmed) return;

        showToast("Initiating chat...", "info");
        try {
            const response = await fetch(`${API_URL}/chat/initiate.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vendor_id: vendor.id })
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (result.is_new) {
                    updateUser({ tokens: result.tokens });
                    showToast('Chat initiated. 3 tokens deducted.', 'success');
                } else {
                    showToast('Opening existing chat...', 'success');
                }
                navigate(`/client/dashboard?tab=messages&chatWith=${vendor.id}`);
            } else if (result.status === 'insufficient_tokens') {
                showToast(result.message, 'error');
                navigate('/wallet');
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error("Error initiating chat:", error);
            showToast("Failed to initiate chat. Try again.", "error");
        }
    };

    const isOwnProfile = user && (String(user.id) === String(id) || String(user.user_id) === String(id));

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reviews/add.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vendor_id: vendor.id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });
            const result = await response.json();
            if (result.status === 'success') {
                showToast('Review submitted!', 'success');
                setNewReview({ rating: 5, comment: '' });
                fetch(`${API_URL}/reviews/get.php?vendor_id=${vendor.id}`)
                    .then(res => res.json())
                    .then(data => { if (data.status === 'success') setReviews(data.reviews); });
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            showToast("Error submitting review.", 'error');
        }
    };

    if (loading) return <Loader fullPage message="Loading vendor profile..." />;

    if (error || !vendor) return (
        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Oops! Vendor details unavailable.</h2>
            <Link to="/vendors" className="btn btn-primary">Back to Search</Link>
        </div>
    );

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (parseInt(r.rating) || 0), 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Minimal Header Nav */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/vendors" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '700',
                    background: 'rgba(15, 23, 42, 0.3)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} className="hover-lift">
                    <ChevronLeft size={20} /> <span style={{ fontSize: '0.95rem', letterSpacing: '0.025em' }}>Back to Search</span>
                </Link>
            </div>

            {/* Hero Cover Image Section */}
            <div style={{
                height: '400px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
                <img
                    src={
                        portfolio[0]?.images?.[0]?.file_path 
                        ? (portfolio[0].images[0].file_path && portfolio[0].images[0].file_path.startsWith('http') ? portfolio[0].images[0].file_path : `${API_URL.replace('/api', '')}/${portfolio[0].images[0].file_path}`) 
                        : (CATEGORY_COVERS[vendor.category] || CATEGORY_COVERS['default'])
                    }
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        opacity: '0.6',
                        transition: 'opacity 0.5s ease'
                    }}
                    alt="Cover"
                />
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 40%, transparent 100%)'
                }}></div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', marginTop: '-120px', position: 'relative', zIndex: 5 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.5fr) 1fr', gap: '2rem' }}>

                    {/* Main Content Side */}
                    <div>
                        {/* Profile Info Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '0',
                            padding: '2.5rem',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                            marginBottom: '2rem',
                            border: '1px solid rgba(255,255,255,0.8)'
                        }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                {/* Profile Picture Wrapper */}
                                <div style={{ position: 'relative', marginTop: '-80px' }}>
                                    <div style={{
                                        width: '180px',
                                        height: '180px',
                                        borderRadius: '0',
                                        padding: '5px',
                                        background: 'white',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                                    }}>
                                        <img
                                            src={vendor.image ? (vendor.image && vendor.image.startsWith('http') ? vendor.image : `${API_URL.replace('/api', '')}/${vendor.image}`) : `https://ui-avatars.com/api/?name=${vendor.business_name || vendor.name}&background=6366f1&color=fff&size=256`}
                                            style={{ width: '100%', height: '100%', borderRadius: '0', objectFit: 'cover' }}
                                            alt={vendor.business_name}
                                        />
                                    </div>
                                    {vendor.is_verified && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            background: 'white',
                                            borderRadius: '0',
                                            padding: '4px',
                                            boxShadow: 'var(--shadow-md)'
                                        }}>
                                            <ShieldCheck size={28} color="#22c55e" fill="#f0fdf4" />
                                        </div>
                                    )}
                                </div>

                                {/* Title Details */}
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span style={{
                                                    color: 'var(--primary)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>{vendor.category}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: '700' }}>
                                                    <Star size={16} fill="#fbbf24" /> {averageRating}
                                                    <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.85rem' }}>({reviews.length} reviews)</span>
                                                </div>
                                            </div>
                                            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: '800' }}>
                                                {vendor.business_name || vendor.name}
                                            </h1>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <MapPin size={18} className="text-primary" /> {vendor.business_address || 'Lagos, Nigeria'}
                                                </span>
                                                {vendor.rating >= 4.5 && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Award size={18} className="text-primary" /> Top Rated Pro
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn btn-secondary" style={{ width: '48px', height: '48px', padding: 0, borderRadius: '0' }}>
                                                <Share2 size={20} />
                                            </button>
                                            <button
                                                onClick={handleFavorite}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    padding: 0,
                                                    borderRadius: '0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: isFavorited ? '#ef4444' : 'var(--text-secondary)',
                                                    border: '1px solid',
                                                    borderColor: isFavorited ? '#fee2e2' : 'var(--border-color)',
                                                    background: isFavorited ? '#fef2f2' : 'white',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Heart size={20} fill={isFavorited ? "#ef4444" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Quick Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '1.5rem',
                                marginTop: '2.5rem',
                                paddingTop: '2rem',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '0', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Response Time</p>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{vendor.response_time_text || 'Under 1 Hour'}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '0', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Happy Clients</p>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{vendor.happy_clients}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '0', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</p>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{vendor.experience_years >= 1 ? `${vendor.experience_years}+ Years` : vendor.experience_years}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '2.5rem',
                            borderBottom: '2px solid #e2e8f0',
                            marginBottom: '2rem',
                            padding: '0 1rem'
                        }}>
                            {['about', 'portfolio', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '1rem 0',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                                        color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        transition: 'all 0.2s',
                                        marginBottom: '-2px'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{
                            background: 'white',
                            borderRadius: '0',
                            padding: '2.5rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                            minHeight: '400px'
                        }}>
                            {activeTab === 'about' && (
                                <div className="fade-in">
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Business Overview</h3>
                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569', whiteSpace: 'pre-wrap' }}>
                                        {vendor.bio || "This vendor hasn't provided a detailed bio yet. Reach out to them via messages to learn more about their services and specialized offerings."}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'portfolio' && (
                                <div className="fade-in">
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Work Showcase</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                        {portfolio.length > 0 ? portfolio.map((work) => (
                                            <div
                                                key={work.id}
                                                className="hover-lift"
                                                onClick={() => navigate(`/portfolio/${work.id}`)}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '0',
                                                    overflow: 'hidden',
                                                    border: '1px solid #f1f5f9',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <div style={{ position: 'relative', height: '220px', background: '#f8fafc' }}>
                                                    <div style={{ display: 'flex', overflowX: 'auto', gap: '2px', height: '100%', scrollSnapType: 'x mandatory' }} className="custom-scrollbar">
                                                        {work.images && work.images.map((img) => (
                                                            <img
                                                                key={img.id}
                                                                src={(img.file_path && img.file_path.startsWith('http') ? img.file_path : `${API_URL.replace('/api', '')}/${img.file_path}`)}
                                                                style={{ width: '100%', height: '100%', minWidth: '100%', objectFit: 'cover', scrollSnapAlign: 'start' }}
                                                                alt={work.title}
                                                            />
                                                        ))}
                                                        {(!work.images || work.images.length === 0) && (
                                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                                <ImageIcon size={48} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {work.images?.length > 1 && (
                                                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '0', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                            {work.images.length} Photos
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ padding: '1.5rem' }}>
                                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{work.title}</h4>
                                                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>{work.description}</p>
                                                    <Link to={`/portfolio/${work.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        View Details <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                                <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                                <p>No portfolio items uploaded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="fade-in">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Customer Reviews</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '0' }}>
                                            <div style={{ color: '#fbbf24', display: 'flex', gap: '2px' }}>
                                                <Star size={18} fill="#fbbf24" />
                                            </div>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{averageRating}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>• {reviews.length} reviews</span>
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {reviews.map(review => (
                                            <div key={review.id} style={{
                                                border: '1px solid var(--border-color)',
                                                padding: '2rem',
                                                borderRadius: '0',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                    <img src={`https://ui-avatars.com/api/?name=${review.reviewer_name}&background=random`} style={{ width: '48px', height: '48px', borderRadius: '0' }} alt="Reviewer" />
                                                    <div>
                                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem' }}>{review.reviewer_name}</h4>
                                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "#fbbf24" : "none"} color="#fbbf24" />)}
                                                            <span style={{ marginLeft: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p style={{ margin: 0, color: '#475569', lineHeight: '1.7', fontSize: '1rem' }}>"{review.comment}"</p>
                                            </div>
                                        ))}

                                        {reviews.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                                <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                                <p>Be the first to leave a review for this vendor!</p>
                                            </div>
                                        )}

                                        {/* Review Form */}
                                        {user && !isOwnProfile && (
                                            <div style={{
                                                marginTop: '2rem',
                                                padding: '2rem',
                                                background: '#f8fafc',
                                                borderRadius: '0',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>Leave a Feedback</h4>
                                                <form onSubmit={handleSubmitReview}>
                                                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: '600' }}>Overall Rating</span>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => setNewReview({ ...newReview, rating: s })}
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                                >
                                                                    <Star size={24} fill={s <= newReview.rating ? "#fbbf24" : "none"} color={s <= newReview.rating ? "#fbbf24" : "#cbd5e1"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ marginBottom: '1.5rem' }}>
                                                        <textarea
                                                            placeholder="Share your experience with this vendor..."
                                                            value={newReview.comment}
                                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                            required
                                                            style={{
                                                                width: '100%',
                                                                padding: '1.25rem',
                                                                borderRadius: '0',
                                                                border: '1px solid var(--border-color)',
                                                                minHeight: '120px',
                                                                fontSize: '1rem',
                                                                outline: 'none',
                                                                background: 'white'
                                                            }}
                                                        />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Post Review</button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sticky Action Sidebar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'sticky', top: '90px' }}>
                            <div style={{
                                background: 'white',
                                borderRadius: '0',
                                padding: '2.5rem',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(255,255,255,0.8)'
                            }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500' }}>Packages from</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '900' }}>
                                            ₦{parseInt(vendor.starting_price || 0).toLocaleString()}
                                        </h2>
                                        <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            / {vendor.price_type === 'per_hour' ? 'hour' : 'event'}
                                        </span>
                                    </div>
                                </div>

                                {!isOwnProfile && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <button
                                            onClick={handleMessage}
                                            className="btn btn-primary"
                                            style={{
                                                width: '100%',
                                                justifyContent: 'center',
                                                padding: '1.25rem',
                                                fontSize: '1.1rem',
                                                borderRadius: '0',
                                                boxShadow: '0 10px 15px -3px rgba(235, 70, 65, 0.3)'
                                            }}
                                        >
                                            <MessageSquare size={20} /> Message Vendor
                                        </button>

                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0' }}>
                                            {vendor.response_time_text ? `Typically responds in ~${vendor.response_time_text}` : 'Ready to respond to your request'}
                                        </p>
                                    </div>
                                )}

                                <div style={{
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '0', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldCheck size={18} color="#22c55e" />
                                        </div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155' }}>Verified Identity</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-lift {
                    transition: all 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 0;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                @media (max-width: 968px) {
                    .container > div {
                        grid-template-columns: 1fr !important;
                    }
                    h1 { font-size: 2rem !important; }
                }
            `}</style>
        </div>
    );
};

export default VendorDetails;
