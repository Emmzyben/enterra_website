import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft, Calendar, ImageIcon, MessageSquare,
    ArrowUpRight, CheckCircle2, ChevronLeft as Prev,
    ChevronRight as Next, X
} from 'lucide-react';
import API_URL from '../config';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';

const PortfolioDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    useEffect(() => {
        const fetchWorkDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/vendors/get-portfolio-details?id=${id}`);
                const data = await res.json();
                if (data.status === 'success') setWork(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkDetails();
    }, [id]);

    if (loading) return <Loader fullPage message="Loading project..." />;

    if (!work) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'white' }}>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Project not found or removed.</p>
                <button onClick={() => navigate('/vendors')} className="btn btn-primary">Browse Vendors</button>
            </div>
        );
    }

    const baseUrl = API_URL.replace('/api', '');
    const images = work.images || [];

    const handleContact = () => {
        if (!user) return navigate('/login');
        navigate(`/client/dashboard?tab=messages&chatWith=${work.vendor_id}`);
    };

    const prev = () => setActiveImage(i => (i - 1 + images.length) % images.length);
    const next = () => setActiveImage(i => (i + 1) % images.length);

    return (
        <div style={{ background: 'white', minHeight: '100vh', paddingTop: '5.5rem' }}>


            {/* ── MAIN LAYOUT ── */}
            <div style={{ maxWidth: 'auto', margin: '0 auto', padding: '3rem 2rem 6rem', display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '4rem', alignItems: 'start' }}>

                {/* ── LEFT: Gallery ── */}
                <div>
                    {/* Main Image */}
                    <div
                        onClick={() => images.length && setLightbox(true)}
                        style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: images.length ? 'zoom-in' : 'default', marginBottom: '1rem' }}
                    >
                        {images.length ? (
                            <>
                                <img
                                    key={activeImage}
                                    src={(images[activeImage].file_path && images[activeImage].file_path.startsWith('http') ? images[activeImage].file_path : `${baseUrl}/${images[activeImage].file_path}`)}
                                    alt={work.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'pd-fade 0.3s ease' }}
                                />
                                {images.length > 1 && (
                                    <>
                                        <button onClick={e => { e.stopPropagation(); prev(); }} style={navBtn('left')}>
                                            <Prev size={18} />
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); next(); }} style={navBtn('right')}>
                                            <Next size={18} />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', letterSpacing: '0.04em' }}>
                                            {activeImage + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                                <ImageIcon size={48} strokeWidth={1} />
                                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>No images</p>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {images.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImage(i)}
                                    style={{ flexShrink: 0, width: '88px', height: '64px', padding: 0, border: activeImage === i ? '2px solid #EB4641' : '2px solid transparent', background: '#f1f5f9', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.15s' }}
                                >
                                    <img src={(img.file_path && img.file_path.startsWith('http') ? img.file_path : `${baseUrl}/${img.file_path}`)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Info ── */}
                <div style={{ position: 'sticky', top: '120px' }}>

                    {/* Category label */}
                    <p style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 0.75rem' }}>
                        Portfolio Work
                    </p>

                    {/* Title */}
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1.2', margin: '0 0 1.75rem' }}>
                        {work.title}
                    </h1>

                    {/* Vendor */}
                    <Link
                        to={`/vendors/${work.vendor_id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', padding: '0.9rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', transition: 'border-color 0.15s', background: '#fafafa' }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#EB4641'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(work.business_name || 'V')}&background=FEF2F2&color=EB4641&size=60`}
                            alt="Vendor"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#F27A76' }}>Professional</p>
                            <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {work.business_name || work.vendor_name}
                            </p>
                        </div>
                        <ArrowUpRight size={15} color="#94a3b8" />
                    </Link>

                    {/* Meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.9rem', background: 'white' }}>
                            <p style={{ margin: '0 0 3px', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Date</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                                <Calendar size={13} color="#EB4641" />
                                {new Date(work.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                        <div style={{ padding: '0.9rem', background: 'white' }}>
                            <p style={{ margin: '0 0 3px', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Photos</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                                <ImageIcon size={13} color="#EB4641" />
                                {images.length} image{images.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0 0 1.25rem' }} />

                    {/* Description */}
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>About This Project</h4>
                    <p style={{ margin: '0 0 2rem', fontSize: '0.93rem', lineHeight: '1.8', color: '#64748b', whiteSpace: 'pre-wrap' }}>
                        {work.description || 'This vendor has showcased this project as an example of their expertise and quality of service.'}
                    </p>

                    {/* CTA */}
                    <button
                        onClick={handleContact}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.95rem', background: '#EB4641', color: 'white', border: 'none', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#C63935'}
                        onMouseOut={e => e.currentTarget.style.background = '#EB4641'}
                    >
                        <MessageSquare size={16} /> Contact Vendor
                    </button>

                    <Link
                        to={`/vendors/${work.vendor_id}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '0.75rem', padding: '0.75rem', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#EB4641'; e.currentTarget.style.color = '#EB4641'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        View Full Profile <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>

            {/* ── LIGHTBOX ── */}
            {lightbox && images[activeImage] && (
                <div
                    onClick={() => setLightbox(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pd-fade 0.2s ease' }}
                >
                    <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                    {images.length > 1 && <>
                        <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', ...lbNavBtn }}>
                            <Prev size={22} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', ...lbNavBtn }}>
                            <Next size={22} />
                        </button>
                    </>}
                    <img
                        onClick={e => e.stopPropagation()}
                        src={(images[activeImage].file_path && images[activeImage].file_path.startsWith('http') ? images[activeImage].file_path : `${baseUrl}/${images[activeImage].file_path}`)}
                        alt={work.title}
                        style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain', animation: 'pd-fade 0.25s ease' }}
                    />
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                        {activeImage + 1} / {images.length}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pd-fade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @media (max-width: 900px) {
                    .pd-layout-inner {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

/* small helpers */
const navBtn = (side) => ({
    position: 'absolute',
    top: '50%',
    [side]: '0.6rem',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid #e2e8f0',
    color: '#334155',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 3
});

const lbNavBtn = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

export default PortfolioDetails;
