import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, CheckCircle, ChevronDown, SlidersHorizontal, Heart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useVendors from '../hooks/useVendors';
import useAuth from '../hooks/useAuth';
import API_URL from '../config';
import Loader from '../components/Loader';

const Vendors = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'All');
    const [locationFilter, setLocationFilter] = useState("");

    // Sync category from URL on first mount
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
    }, []);

    const { vendors, loading, error } = useVendors({
        category: selectedCategory,
        search: searchTerm,
        location: locationFilter
    });

    const handleSearch = () => {
        // The hook will automatically refetch when filters change
    };

    return (
        <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-color)' }}>
            {/* Search Header — compact strip */}
            <div style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
                <div className="container">
                    {/* Title + search row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                        <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', margin: 0 }}>
                            Vendors
                        </h1>

                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '0.6rem', flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
                            {/* Search input */}
                            <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', padding: '0 0.9rem', height: '38px', minWidth: 0 }}>
                                <Search size={15} color="var(--text-muted)" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'transparent' }}
                                />
                            </div>

                            {/* Location input */}
                            <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', padding: '0 0.9rem', height: '38px', minWidth: 0 }}>
                                <MapPin size={15} color="var(--text-muted)" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'transparent' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 1.25rem', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>
                                Search
                            </button>
                        </form>
                    </div>

                    {/*Filters Bar */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', overflowX: 'auto', paddingBottom: '2px' }}>
                        {['All', 'DJ', 'Photographer', 'Makeup Artist', 'Catering', 'Planner'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.3rem 0.9rem',
                                    borderRadius: '0',
                                    border: selectedCategory === cat ? 'none' : '1px solid var(--border-color)',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'white',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                        <button style={{
                            marginLeft: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            padding: '0.3rem 0.9rem',
                            borderRadius: '0',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            <SlidersHorizontal size={14} /> Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '1rem',
                        borderRadius: '0',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                        <Loader size="lg" message="Finding the best vendors..." />
                    </div>
                ) : (
                    <>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Showing {vendors.length} results
                        </p>

                        {vendors.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                                    No vendors found. Try adjusting your filters.
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '2rem'
                            }}>
                                {vendors.map(vendor => (
                                    <VendorCard key={vendor.id} vendor={vendor} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <VendorStyles />
        </div>
    );
};

const VendorStyles = () => (
    <style>{`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `}</style>
);

const VendorCard = ({ vendor }) => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        if (user && vendor.id) {
            fetch(`${API_URL}/favorites/status?vendor_id=${vendor.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') setIsFavorited(data.is_favorited);
                })
                .catch(err => console.error("Error checking favorite status:", err));
        }
    }, [user, vendor.id, token]);

    const handleFavorite = async (e) => {
        e.stopPropagation();
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
                body: JSON.stringify({ vendor_id: vendor.id })
            });
            const result = await response.json();
            if (result.status === 'success') {
                setIsFavorited(result.action === 'added');
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    // Map API data to display format
    const displayData = {
        id: vendor.id,
        name: vendor.business_name || vendor.name,
        category: vendor.category,
        location: vendor.business_address || 'Location not specified',
        price: vendor.starting_price ? `₦${parseInt(vendor.starting_price).toLocaleString()}${vendor.price_type ? '/' + vendor.price_type : ''}` : 'Contact for pricing',
        rating: vendor.rating || 0,
        reviewsCount: vendor.reviews_count || 0,
        image: vendor.image ? (vendor.image && vendor.image.startsWith('http') ? vendor.image : `${API_URL.replace('/api', '')}/${vendor.image}`) : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75',
        verified: vendor.is_verified == 1,
        bio: vendor.bio || ''
    };

    return (
        <div
            className="card"
            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-color)' }}
            onClick={() => navigate(`/vendors/${displayData.id}`)}
        >
            <div style={{ position: 'relative', height: '200px' }}>
                <img
                    src={displayData.image}
                    alt={displayData.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';
                    }}
                />
                <button
                    onClick={handleFavorite}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: isFavorited ? '#fee2e2' : 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '0',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 2
                    }}
                >
                    <Heart size={18} color={isFavorited ? "#ef4444" : "var(--text-secondary)"} fill={isFavorited ? "#ef4444" : "none"} />
                </button>
                {displayData.verified && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '4px 8px',
                        borderRadius: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--success)'
                    }}>
                        <CheckCircle size={12} /> Verified
                    </div>
                )}
            </div>

            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                        <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {displayData.category}
                        </span>
                        <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0 0', color: 'var(--text-primary)' }}>{displayData.name}</h3>
                    </div>
                    {displayData.rating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--surface-hover)', padding: '4px 6px', borderRadius: '0' }}>
                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{displayData.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} /> {displayData.location}
                </p>

                {displayData.bio && (
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {displayData.bio}
                    </p>
                )}

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Rate</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{displayData.price}</span>
                    </div>
                    <button style={{
                        background: 'none',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vendors/${displayData.id}`);
                        }}
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
