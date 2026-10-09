import React, { useState, useMemo } from 'react';
import { Camera, Upload, Search, Heart, Eye, Filter } from 'lucide-react';

export default function GalleryView({ photos, onOpenUpload, onSelectPhoto, onLikePhoto }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Match Action', 'Stadiums', 'Fans & Atmosphere', 'Celebrations', 'Team Photos'];

  const filteredPhotos = useMemo(() => {
    if (!photos) return [];
    return photos.filter((p) => {
      if (activeCategory !== 'ALL' && p.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.uploader_name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [photos, activeCategory, searchQuery]);

  return (
    <div className="gallery-container">
      {/* View Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Camera size={28} color="#10b981" />
            Football Media & Photo Gallery
          </h2>
          <p>Explore stunning match moments, iconic stadiums, and upload your own matchday pictures</p>
        </div>

        <button className="btn-record" onClick={onOpenUpload}>
          <Upload size={16} />
          Upload Picture
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar">
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`nav-btn ${activeCategory === cat ? 'active' : ''}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'ALL' ? 'All Pictures' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-wrapper" style={{ maxWidth: '280px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search pictures, stadiums, fans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Photo Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem',
        }}
      >
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="club-card"
            style={{
              padding: '0',
              overflow: 'hidden',
              alignItems: 'stretch',
              textAlign: 'left',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => onSelectPhoto(photo)}
          >
            {/* Image Container with Hover Zoom */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#0a0e17' }}>
              <img
                src={photo.image_url}
                alt={photo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'; }}
              />

              {/* Category Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(11, 15, 23, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: 'var(--accent-green)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {photo.category}
              </div>

              {/* Quick Like Button on Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLikePhoto(photo.id);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(11, 15, 23, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '0.25rem 0.6rem',
                  color: '#f43f5e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <Heart size={13} fill="#f43f5e" />
                <span>{photo.likes}</span>
              </button>
            </div>

            {/* Photo Info Content */}
            <div style={{ padding: '1.1rem 1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>
                {photo.title}
              </h3>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                  marginBottom: '0.85rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {photo.description || 'Matchday snapshot.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-subtle)',
                }}
              >
                <span>By {photo.uploader_name}</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Eye size={12} /> View Full
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredPhotos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <Camera size={40} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Pictures Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Be the first to upload a football picture to this category!
            </p>
            <button className="btn-record" onClick={onOpenUpload}>
              <Upload size={15} /> Upload Picture Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
