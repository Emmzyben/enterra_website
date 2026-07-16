import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Globe, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import Loader from '../components/Loader';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationTypeFilter, setLocationTypeFilter] = useState('All');

  const categories = ['All', 'Concert', 'Party', 'Workshop', 'Seminar', 'Other'];

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      let queryParams = [];
      if (selectedCategory !== 'All') {
        queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (locationTypeFilter !== 'All') {
        queryParams.push(`location_type=${encodeURIComponent(locationTypeFilter.toLowerCase())}`);
      }
      if (searchTerm) {
        queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await fetch(`${API_URL}/events${queryString}`);
      const data = await response.json();

      if (data.status === 'success') {
        setEvents(data.data || []);
      } else {
        setError(data.message || 'Failed to load events.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, locationTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  // Helper to format date
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

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Search Header — compact strip */}
      <div style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
        <div className="container">
          {/* Title + search row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', margin: 0 }}>
              Events
            </h1>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
              {/* Search input */}
              <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', padding: '0 0.9rem', height: '38px', minWidth: 0 }}>
                <Search size={15} color="var(--text-muted)" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'transparent' }}
                />
              </div>

              {/* Format dropdown */}
              <div style={{ flex: '1 1 130px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', padding: '0 0.9rem', height: '38px', minWidth: 0 }}>
                <Globe size={15} color="var(--text-muted)" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
                <select
                  value={locationTypeFilter}
                  onChange={(e) => setLocationTypeFilter(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'transparent', cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="All">All Formats</option>
                  <option value="Physical">In-Person</option>
                  <option value="Online">Virtual</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 1.25rem', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>
                Search
              </button>
            </form>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.3rem 0.9rem',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'var(--primary)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  borderRadius: 0
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Events Catalog Area */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1.25rem', borderRadius: '0', marginBottom: '2rem', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <Loader size="lg" message="Discovering live events..." />
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '600' }}>
              Showing {events.length} upcoming event{events.length !== 1 ? 's' : ''}
            </p>

            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: 'white', border: '1px dashed var(--border-color)' }}>
                <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>No events found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try broadening your search criteria or checking another category.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}>
                {events.map(event => {
                  const bannerImg = event.banner_path
                    ? (event.banner_path && event.banner_path.startsWith('http') ? event.banner_path : `${API_URL.replace('/api', '')}/${event.banner_path}`)
                    : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';

                  return (
                    <div
                      key={event.id}
                      className="card event-hover-card"
                      style={{
                        padding: 0,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                        <img
                          src={bannerImg}
                          alt={event.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=75';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '4px 10px',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {event.category}
                        </div>
                        {event.location_type === 'online' && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#0f172a',
                            color: 'white',
                            padding: '4px 10px',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Globe size={12} /> Online
                          </div>
                        )}
                      </div>

                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)', lineHeights: '1.3' }}>
                          {event.title}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <Calendar size={14} color="var(--primary)" />
                            {formatDate(event.start_time)}
                          </span>

                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            <MapPin size={14} color="var(--primary)" />
                            {event.location}
                          </span>
                        </div>

                        <div style={{
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Organized by</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{event.organizer_name}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
                            View Tickets <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .event-hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default Events;
