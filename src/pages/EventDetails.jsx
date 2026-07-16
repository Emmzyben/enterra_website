import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, User, Tag, Mail, AlertTriangle, ShieldCheck, Ticket, Plus, Minus } from 'lucide-react';
import API_URL from '../config';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking states
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState(user?.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/events/${id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setEvent(data.data);
        if (data.data.tickets && data.data.tickets.length > 0) {
          // Default to first ticket tier
          setSelectedTier(data.data.tickets[0]);
        }
      } else {
        setError(data.message || 'Event not found.');
      }
    } catch (err) {
      setError('Connection error. Failed to load event details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Sync user info if user logs in/changes
  useEffect(() => {
    if (user) {
      setAttendeeName(user.name);
      setAttendeeEmail(user.email);
    }
  }, [user]);

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setQuantity(1); // Reset quantity on tier change
  };

  const handleIncrement = () => {
    if (selectedTier && quantity < (selectedTier.capacity - selectedTier.sold_count)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // RSVP / Free Ticket Flow
  const handleFreeRegistration = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch(`${API_URL}/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticket_tier_id: selectedTier.id,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        showToast('Registration successful! Your free ticket is ready.', 'success');
        navigate('/dashboard?tab=tickets');
      } else {
        showToast(data.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
      console.error(err);
    } finally {
      setBookingLoading(false);
      setShowRsvpModal(false);
    }
  };

  // Paid Checkout Flow
  const handlePaidCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!attendeeName || !attendeeEmail) {
      showToast('Please provide a name and email for the tickets.', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Initiate paid checkout session
      const response = await fetch(`${API_URL}/events/${id}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticket_tier_id: selectedTier.id,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          quantity: quantity
        })
      });

      const checkoutData = await response.json();
      if (checkoutData.status !== 'success') {
        showToast(checkoutData.message || 'Checkout failed.', 'error');
        setBookingLoading(false);
        return;
      }

      const { payment_reference, amount } = checkoutData.data;

      // 2. Simulate Paystack popup checkout (similar to Wallet.jsx dummy simulation)
      showToast(`Launching Paystack Checkout Simulator (₦${amount.toLocaleString()})...`, 'info');
      
      setTimeout(async () => {
        // Post reference verification
        try {
          const verifyResponse = await fetch(`${API_URL}/events/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reference: payment_reference })
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.status === 'success') {
            showToast('Payment successful! Your tickets have been issued.', 'success');
            navigate('/dashboard?tab=tickets');
          } else {
            showToast(verifyData.message || 'Payment verification failed.', 'error');
          }
        } catch (verifyErr) {
          showToast('Connection error during payment verification.', 'error');
          console.error(verifyErr);
        } finally {
          setBookingLoading(false);
        }
      }, 2000);

    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
      console.error(err);
      setBookingLoading(false);
    }
  };

  const handleBookTickets = () => {
    if (!user) {
      showToast('Please log in to book tickets.', 'info');
      navigate('/login');
      return;
    }

    if (parseFloat(selectedTier.price) === 0) {
      setShowRsvpModal(true);
    } else {
      handlePaidCheckout();
    }
  };

  // Formats date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '6rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader size="lg" message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ paddingTop: '6rem', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Event Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error || 'This event does not exist or has been removed.'}</p>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const bannerImg = event.banner_path 
    ? (event.banner_path && event.banner_path.startsWith('http') ? event.banner_path : `${API_URL.replace('/api', '')}/${event.banner_path}`) 
    : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80';

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '4.5rem', paddingBottom: '4rem' }}>
      {/* Event Header Banner */}
      <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        <img
          src={bannerImg}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 10%, rgba(15, 23, 42, 0.3) 100%)' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0', color: 'white', padding: '0 1.5rem' }}>
          <span style={{ background: 'var(--primary)', padding: '4px 12px', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1rem' }}>
            {event.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)', letterSpacing: '-1px',color: 'white' }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.95rem', opacity: '0.9' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> {formatDate(event.start_time)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {event.location_type === 'online' ? <Globe size={18} /> : <MapPin size={18} />}
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Description & Organizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>About this Event</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line', margin: 0 }}>
                {event.description}
              </p>
            </div>

            <div className="panel" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px 0', fontWeight: '700' }}>Organizer</h4>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 4px 0' }}>{event.organizer_name}</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Mail size={14} /> {event.organizer_email}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Tickets widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="panel" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={20} color="var(--primary)" /> Select Tickets
              </h3>

              {event.tickets && event.tickets.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {event.tickets.map((ticket) => {
                    const remaining = ticket.capacity - ticket.sold_count;
                    const isSoldOut = remaining <= 0;
                    const isSelected = selectedTier?.id === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => !isSoldOut && handleSelectTier(ticket)}
                        style={{
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(235, 70, 65, 0.01)' : 'white',
                          padding: '1.25rem',
                          borderRadius: '0',
                          cursor: isSoldOut ? 'not-allowed' : 'pointer',
                          opacity: isSoldOut ? '0.6' : '1',
                          position: 'relative',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>{ticket.ticket_name}</h4>
                          <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>
                            {parseFloat(ticket.price) === 0 ? 'FREE' : `₦${parseInt(ticket.price).toLocaleString()}`}
                          </span>
                        </div>

                        {ticket.description && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{ticket.description}</p>
                        )}

                        <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                          {isSoldOut ? (
                            <span style={{ color: '#ef4444' }}>Sold Out</span>
                          ) : remaining <= 5 ? (
                            <span style={{ color: '#f59e0b' }}>Only {remaining} left!</span>
                          ) : (
                            <span style={{ color: '#10b981' }}>{remaining} tickets available</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No ticket configurations available.</p>
              )}

              {/* Quantity Counter for Paid Tickets */}
              {selectedTier && parseFloat(selectedTier.price) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      style={{ background: 'white', border: '1px solid #e2e8f0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= (selectedTier.capacity - selectedTier.sold_count)}
                      style={{ background: 'white', border: '1px solid #e2e8f0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Ticket Holder Details for Logged In User */}
              {user && selectedTier && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ticket Holder Details</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Name on Ticket"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      style={{ padding: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                    />
                    <input
                      type="email"
                      placeholder="Attendee Email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      style={{ padding: '0.6rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Subtotal Panel */}
              {selectedTier && parseFloat(selectedTier.price) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Subtotal</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ₦{(parseFloat(selectedTier.price) * quantity).toLocaleString()}
                  </span>
                </div>
              )}

              <button
                onClick={handleBookTickets}
                disabled={bookingLoading || !selectedTier || (selectedTier.capacity - selectedTier.sold_count) <= 0}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', fontWeight: '700', borderRadius: '0' }}
              >
                {bookingLoading ? 'Processing Booking...' : 
                 !selectedTier ? 'Select Ticket Tier' :
                 (selectedTier.capacity - selectedTier.sold_count) <= 0 ? 'Sold Out' :
                 parseFloat(selectedTier.price) === 0 ? 'RSVP for Free' : `Purchase Ticket(s)`}
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem', color: '#166534', background: '#f0fdf4', padding: '0.75rem', fontSize: '0.8rem', fontWeight: '500' }}>
                <ShieldCheck size={16} /> Secure checkout and verified entry codes.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free RSVP Modal */}
      {showRsvpModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, padding: '1rem' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', background: 'white' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>Free Event Registration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Register for a free ticket tier: <strong>{selectedTier?.ticket_name}</strong>
            </p>

            <form onSubmit={handleFreeRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRsvpModal(false)}
                  style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem', fontWeight: '700', borderRadius: '0' }}
                >
                  {bookingLoading ? 'Registering...' : 'Confirm RSVP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          .details-grid > div:last-child {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetails;
