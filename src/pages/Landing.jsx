import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
    Shield, Star, Calendar, Search, CheckCircle, ArrowRight,
    UserCheck, Lock, Camera, Music, Palette, Play, Zap, ChevronRight, MapPin,
    MessageSquare, QrCode, Users, Smartphone, Download
} from 'lucide-react';
import API_URL from '../config';

const Typewriter = ({ text, delay = 100, start = true, onComplete }) => {
    const [currentText, setCurrentText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (start && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (currentIndex === text.length && onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, text, start, onComplete]);

    return (
        <span>
            {currentText}
            {start && currentIndex < text.length && <span className="typing-cursor">|</span>}
        </span>
    );
};

const useReveal = () => {
    React.useEffect(() => {
        const observerOptions = {
            threshold: 0,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Function to observe elements
        const observeElements = () => {
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.observe(el));
        };

        // Run initially
        observeElements();

        // Also run after a short delay for any late-mounting components
        const timeoutId = setTimeout(observeElements, 500);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, []);
};

const Landing = () => {
    const { user } = useAuth();
    const [startSecondLine, setStartSecondLine] = React.useState(false);
    const [featuredVendors, setFeaturedVendors] = React.useState([]);
    useReveal();

    React.useEffect(() => {
        fetch(`${API_URL}/vendors/featured`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setFeaturedVendors(data.vendors);
                }
            })
            .catch(err => console.error("Error fetching featured vendors", err));
    }, []);

    return (
        <div className="landing-page">
            {/* Background Blobs for Landing removed to reduce slop */}

            {/* Hero Section */}
            <section className="hero">
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 className="fade-in-up">
                            <Typewriter
                                text="Event Experts,"
                                delay={100}
                                onComplete={() => setStartSecondLine(true)}
                            />
                            <br />
                            <span className="text-gradient">
                                <Typewriter
                                    text="Found & Verified."
                                    delay={100}
                                    start={startSecondLine}
                                />
                            </span>
                        </h1>
                        <p className="fade-in-up" style={{ margin: '0 auto 2.5rem', color: 'rgba(255,255,255,0.9)', animationDelay: '400ms' }}>
                            The premier marketplace connecting event planners with professionals in the event industry.
                            Discover DJs, photographers, and makeup artists and connect instantly.
                        </p>

                        <div className="search-container fade-in-up" style={{ margin: '0 auto 2.5rem', animationDelay: '800ms' }}>
                            <div className="search-input-group">
                                <Search size={20} color="#94a3b8" />
                                <input type="text" placeholder="DJ, Photographer, etc..." />
                            </div>
                            <div style={{ borderLeft: '1px solid #e2e8f0', padding: '0 1rem', height: '24px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Lagos, NG</span>
                            </div>
                            <Link to="/vendors" className="search-btn">
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section-padding bg-white" id="categories">
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore Top Categories</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Curated professionals for every aspect of your event</p>
                    </div>

                    <div className="category-slider">
                        <CategoryCard
                            title="DJs & Bands"
                            category="DJ"
                            desc="From Afrobeat to Jazz, find the perfect sound."
                            image="/dj.jpg"
                            delay="100"
                        />
                        <CategoryCard
                            title="Photography"
                            category="Photographer"
                            desc="Capture timeless moments with verified pros."
                            image="/photography.avif"
                            delay="200"
                        />
                        <CategoryCard
                            title="Makeup Artists"
                            category="Makeup Artist"
                            desc="Glam looks for weddings and parties."
                            image="/makeup.jpg"
                            delay="300"
                        />
                        <CategoryCard
                            title="MC / Hosts"
                            category="MC"
                            desc="Engage your audience with professional hosts."
                            image="/mc.webp"
                            delay="100"
                        />
                        <CategoryCard
                            title="Videography"
                            category="Videographer"
                            desc="Cinematic event coverage and editing."
                            image="/videogrpahy.jpg"
                            delay="200"
                        />
                        <CategoryCard
                            title="Influencers"
                            category="Influencer"
                            desc="Promote your event with top personalities."
                            image="/influencers.jpg"
                            delay="300"
                        />
                        <CategoryCard
                            title="Catering"
                            category="Catering"
                            desc="Delicious meals and seamless service."
                            image="/dj.jpg"
                            delay="100"
                        />
                        <CategoryCard
                            title="Event Planners"
                            category="Planner"
                            desc="Full-service planning for flawless events."
                            image="/mc.webp"
                            delay="200"
                        />
                    </div>
                </div>
            </section>

            {/* Featured Vendors */}
            <section className="section-padding bg-soft">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Professionals</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Hand-picked, top-rated vendors with guaranteed quality</p>
                        </div>
                        <Link to="/vendors" className="btn btn-primary hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            View All Vendors <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid-3">
                        {featuredVendors.length > 0 ? featuredVendors.map((vendor, index) => (
                            <VendorCard
                                key={vendor.id}
                                id={vendor.id}
                                name={vendor.business_name || vendor.name}
                                category={vendor.category}
                                rating={parseFloat(vendor.avg_rating).toFixed(1)}
                                reviews={vendor.review_count}
                                price={`₦${parseInt(vendor.starting_price || 0).toLocaleString()}`}
                                location={vendor.business_address?.split(',')[0] || 'Lagos'}
                                image={vendor.image ? (vendor.image && vendor.image.startsWith('http') ? vendor.image : `${API_URL.replace('/api', '')}/${vendor.image}`) : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75"}
                                className={`reveal delay-${index * 100}`}
                            />
                        )) : (
                            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Loading top professionals...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-padding bg-dark" id="how-it-works">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>How It Works</h2>
                        <p style={{ color: '#94a3b8' }}>Four simple steps to your perfect event</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '1rem'
                    }}>
                        <WorkStep
                            number="1"
                            icon={<Search />}
                            title="Search"
                            desc="Browse verified portfolios and read real reviews from past clients."
                            className="reveal"
                        />
                        <StepArrow />
                        <WorkStep
                            number="2"
                            icon={<MessageSquare />}
                            title="Chat"
                            desc="Message vendors directly to discuss your requirements, availability, and vision."
                            className="reveal delay-100"
                        />
                        <StepArrow />
                        <WorkStep
                            number="3"
                            icon={<Shield />}
                            title="Direct Connect"
                            desc="Finalize details and reach agreements with peace of mind through our verified network."
                            className="reveal delay-200"
                        />
                        <StepArrow />
                        <WorkStep
                            number="4"
                            icon={<Star />}
                            title="Review"
                            desc="After the party, share your experience to help others find the best talent."
                            className="reveal delay-300"
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem' }} className="reveal delay-400">
                        <Link to="/about" className="btn btn-primary hover-lift" style={{ display: 'inline-flex', padding: '0.8rem 2rem' }}>
                            Learn More About Us <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Organizers & Ticketing Section */}
            <section className="section-padding bg-soft" id="organizers-ticketing">
                <div className="container">
                    <div className="hero-grid" style={{ alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                                Built for <span className="text-gradient">Organizers & Event Hosts</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.75' }}>
                                Run your event from discovery to check-in with a platform designed for smooth planning, vendor coordination, and secure ticketing.
                            </p>
                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                                <FeaturePill icon={<Users size={18} />} title="Manage vendors and clients in one place" />
                                <FeaturePill icon={<Calendar size={18} />} title="Create and publish events with built-in ticketing" />
                                <FeaturePill icon={<QrCode size={18} />} title="Enable fast check-ins with scan-ready event access" />
                            </div>
                            <Link to={user ? '/dashboard?tab=events' : '/login'} className="btn btn-primary">Explore Organizer Tools</Link>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(235,70,65,0.08), rgba(15,23,42,0.04))',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0',
                                padding: '2rem',
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '0', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{ background: 'rgba(235,70,65,0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0' }}>
                                            <Calendar size={18} />
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Event Setup</h3>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Create events, add ticket tiers, and publish them in minutes.</p>
                                </div>
                                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '0', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{ background: 'rgba(235,70,65,0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0' }}>
                                            <QrCode size={18} />
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Ticketing & Check-In</h3>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sell tickets, track attendance, and verify entry with secure QR codes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Safety Section (Features) */}
            <section className="section-padding bg-[#fff]" id="features">
                <div className="container">
                    <div className="hero-grid">
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                background: 'var(--surface-hover)',
                                borderRadius: '0',
                                padding: '2rem',
                                border: '1px solid var(--glass-border)',
                                height: '100%',
                                minHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '1.5rem'
                            }}>
                                <TrustStep
                                    icon={<UserCheck size={24} />}
                                    title="1. Verified Vendors"
                                    text="Every vendor submits government ID and portfolio evidence."
                                />
                                <div style={{ height: '30px', borderLeft: '2px dashed #334155', marginLeft: '1.5rem' }}></div>
                                <TrustStep
                                    icon={<Lock size={24} />}
                                    title="2. Direct Engagement"
                                    text="Engage directly with vendors and manage your bookings independently."
                                />
                                <div style={{ height: '30px', borderLeft: '2px dashed #334155', marginLeft: '1.5rem' }}></div>
                                <TrustStep
                                    icon={<CheckCircle size={24} />}
                                    title="3. Quality Assurance"
                                    text="Verified reviews and ratings ensure you work with the best in the industry."
                                />
                            </div>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                                Trust is our <span className="text-gradient">Currency</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                The entertainment industry can be hard to navigate. We made it simple.
                                Finding quality vendors and clients is now easier than ever.
                            </p>
                            <Link to="/safety" className="btn btn-primary">Read our Safety Policy</Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Download App Section */}
            <section className="section-padding" style={{ backgroundColor: 'var(--primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-50%', left: '-10%', width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%'
                }}></div>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>

                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800', color: 'white' }}>Get the Enterra App</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', color: 'rgba(255,255,255,0.9)' }}>
                        Take Enterra with you everywhere. Manage your events, chat with vendors, and get instant notifications on the go.
                    </p>
                    <a
                        href="https://expo.dev/artifacts/eas/-2oxC1cFRBsrnODPIlDpSAoH386FBdFWFcDSwx7L5ss.apk"
                        className="btn btn-primary"
                        style={{
                            backgroundColor: 'white', color: 'var(--primary)', fontWeight: '800',
                            padding: '1rem 2rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)', textDecoration: 'none'
                        }}
                    >
                        <Download size={22} /> Download APK
                    </a>
                </div>
            </section>

        </div>
    );
};

// Sub-components
const CategoryCard = ({ title, desc, image, delay, category }) => (
    <Link
        to={`/vendors?category=${encodeURIComponent(category)}`}
        className={`category-slide-card reveal delay-${delay}`}
        style={{ textDecoration: 'none' }}
    >
        <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <img
                src={image}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                className="category-image"
            />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
                transition: 'opacity 0.3s'
            }}></div>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--text-primary)', fontWeight: '800' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{desc}</p>
        </div>
    </Link>
);

const TrustStep = ({ icon, title, text }) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{
            background: 'var(--surface-hover)',
            padding: '12px',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-light)'
        }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>
        </div>
    </div>
);

const FeaturePill = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.9rem 1rem', borderRadius: '0', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{title}</span>
    </div>
);

const WorkStep = ({ number, icon, title, desc, className }) => (
    <div className={`work-step ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-light)',
            marginBottom: '1.5rem',
            position: 'relative'
        }}>
            {React.cloneElement(icon, { size: 32 })}
            <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '28px',
                height: '28px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                border: '3px solid #0f172a'
            }}>
                {number}
            </div>
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: '#94a3b8', maxWidth: '250px' }}>{desc}</p>
    </div>
);

const StepArrow = () => (
    <div className="step-arrow" style={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        color: 'rgba(255,255,255,0.15)',
        paddingTop: '0'
    }}>
        <ChevronRight size={32} />
    </div>
);

const VendorCard = ({ id, name, category, rating, reviews, price, location, image, className }) => (
    <div className={`card group hover-lift ${className}`} style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
        <Link to={`/vendors/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img src={image} alt={name} className="category-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', padding: '0.25rem 0.75rem', borderRadius: '0', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                    {price}
                </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{category}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                        <Star size={16} fill="#fbbf24" />
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{rating}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <MapPin size={16} /> {location}
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        View Profile <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

export default Landing;
