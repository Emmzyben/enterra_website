import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Globe, CheckCircle, Clock, Search, AlertCircle } from 'lucide-react';
import API_URL from '../config';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/events/my-tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTickets(data.data || []);
      } else {
        setError(data.message || 'Failed to load tickets.');
      }
    } catch (err) {
      setError('Connection error. Failed to load your tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      showToast('Please log in to view your tickets.', 'info');
      navigate('/login');
      return;
    }
    fetchTickets();
  }, [user]);

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '6rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader size="lg" message="Retrieving your ticket vault..." />
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1000px', padding: '0 1.5rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              My Tickets
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Show these QR codes at the entry gate to check in.
            </p>
          </div>
          <Link to="/events" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} /> Find More Events
          </Link>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0', marginBottom: '2rem', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', border: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Ticket size={56} color="var(--text-muted)" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>No tickets booked yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.5' }}>
              You don't have any upcoming event registrations. Explore the catalog and book tickets for free or paid events!
            </p>
            <Link to="/events" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
              Browse Events Directory
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {tickets.map((t) => {
              const bannerImg = t.banner_path 
                ? (t.banner_path && t.banner_path.startsWith('http') ? t.banner_path : `${API_URL.replace('/api', '')}/${t.banner_path}`) 
                : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';

              // QR Code URL via free public API
              const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${t.ticket_code}`;

              return (
                <div
                  key={t.id}
                  className="ticket-stub"
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 2fr 1fr',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Left Section: Cover Art */}
                  <div style={{ position: 'relative', minHeight: '180px' }}>
                    <img
                      src={bannerImg}
                      alt={t.event_title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}></div>
                  </div>

                  {/* Middle Section: Ticket Details */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '2px dashed var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'var(--primary)', color: 'white', padding: '2px 8px', textTransform: 'uppercase' }}>
                          {t.ticket_name}
                        </span>
                        
                        {t.checked_in ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <CheckCircle size={10} /> Checked In
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Clock size={10} /> Active Pass
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>
                        {t.event_title}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} color="var(--primary)" /> {formatDate(t.start_time)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {t.location_type === 'online' ? <Globe size={14} color="var(--primary)" /> : <MapPin size={14} color="var(--primary)" />}
                          {t.location}
                        </span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Code: <strong>{t.ticket_code}</strong></span>
                      <span>Price: <strong>{parseFloat(t.price) === 0 ? 'Free' : `₦${parseInt(t.price).toLocaleString()}`}</strong></span>
                    </div>
                  </div>

                  {/* Right Section: QR Check-in */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: '#fafbfc' }}>
                    <div style={{ background: 'white', padding: '0.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                      <img
                        src={qrCodeUrl}
                        alt="Check-in QR Code"
                        style={{ width: '120px', height: '120px', display: 'block' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Scan to Check-In
                    </span>
                  </div>

                  {/* Glassmorphic ticket stub semi-circle cutouts */}
                  <div className="ticket-cutout-top" style={{ position: 'absolute', top: '-10px', right: 'calc(25% - 10px)', width: '20px', height: '20px', borderRadius: '50%', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}></div>
                  <div className="ticket-cutout-bottom" style={{ position: 'absolute', bottom: '-10px', right: 'calc(25% - 10px)', width: '20px', height: '20px', borderRadius: '50%', background: '#f8fafc', borderTop: '1px solid var(--border-color)' }}></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .ticket-stub {
          grid-template-columns: 1.2fr 2fr 1fr;
        }
        @media (max-width: 768px) {
          .ticket-stub {
            grid-template-columns: 1fr !important;
          }
          .ticket-stub > div:first-child {
            height: 150px !important;
            min-height: 150px !important;
          }
          .ticket-stub > div:nth-child(2) {
            border-right: none !important;
            border-bottom: 2px dashed var(--border-color) !important;
            padding: 1.25rem !important;
          }
          .ticket-stub > div:last-child {
            padding: 1.25rem !important;
          }
          .ticket-cutout-top, .ticket-cutout-bottom {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyTickets;
