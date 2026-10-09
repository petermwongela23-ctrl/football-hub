import React from 'react';
import { X, Heart, Calendar, User, Tag } from 'lucide-react';

export default function PhotoModal({ photo, onClose, onLike }) {
  if (!photo) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              {photo.category}
            </span>
            <h3 style={{ color: 'white', fontSize: '1.15rem' }}>{photo.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1rem 1.5rem 1.5rem' }}>
          {/* Full Photo Image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', maxHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
            <img
              src={photo.image_url}
              alt={photo.title}
              style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Details & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {photo.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} /> Uploaded by <strong>{photo.uploader_name}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {new Date(photo.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <button
              className="btn-secondary"
              onClick={() => onLike(photo.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.1rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <Heart size={16} fill="#f43f5e" />
              <strong style={{ fontSize: '0.95rem' }}>{photo.likes} Likes</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
