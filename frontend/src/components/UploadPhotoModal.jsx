import React, { useState } from 'react';
import { X, Upload, Image, Link, CheckCircle2 } from 'lucide-react';

export default function UploadPhotoModal({ onClose, onPhotoUploaded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Match Action');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle local file selection and convert to Base64 data URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file size must be less than 8MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
      if (!title) {
        // Default title from file name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please choose an image file or provide an image URL');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          image_url: imageUrl,
          description,
          uploader_name: uploaderName || 'Football Fan',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload picture');
      }

      onPhotoUploaded('Picture added to gallery successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="#10b981" />
            <h3 style={{ color: 'white' }}>Add Picture to Football Gallery</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Mode Switcher: Local File or Image URL */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '8px' }}>
            <button
              type="button"
              className={`btn-secondary ${uploadMode === 'file' ? 'active' : ''}`}
              style={{
                flex: 1,
                justifyContent: 'center',
                background: uploadMode === 'file' ? 'var(--accent-green)' : 'transparent',
                color: uploadMode === 'file' ? '#042f22' : 'var(--text-muted)',
                fontWeight: 700,
              }}
              onClick={() => setUploadMode('file')}
            >
              <Upload size={14} /> Upload from Computer
            </button>
            <button
              type="button"
              className={`btn-secondary ${uploadMode === 'url' ? 'active' : ''}`}
              style={{
                flex: 1,
                justifyContent: 'center',
                background: uploadMode === 'url' ? 'var(--accent-green)' : 'transparent',
                color: uploadMode === 'url' ? '#042f22' : 'var(--text-muted)',
                fontWeight: 700,
              }}
              onClick={() => setUploadMode('url')}
            >
              <Link size={14} /> Paste Image Link / URL
            </button>
          </div>

          {/* Image Input Area */}
          {uploadMode === 'file' ? (
            <div className="form-group">
              <label className="form-label">Select Image File</label>
              <label
                style={{
                  border: '2px dashed var(--border-active)',
                  borderRadius: '10px',
                  padding: '1.75rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  background: 'rgba(16, 185, 129, 0.03)',
                  transition: 'all 0.2s',
                }}
              >
                <Upload size={32} color="#10b981" />
                <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                  Click to browse or drop an image here
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Supports PNG, JPG, JPEG, WebP, GIF (up to 8MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Image Web URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          )}

          {/* Live Preview Box */}
          {imageUrl && (
            <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <span className="form-label" style={{ textAlign: 'left' }}>Preview</span>
              <div style={{ maxHeight: '220px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#000', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ maxHeight: '220px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                  onError={() => setError('Invalid image URL or unable to load preview.')}
                />
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Picture Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Haaland Wonder Goal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Match Action">Match Action</option>
                <option value="Stadiums">Stadiums</option>
                <option value="Fans & Atmosphere">Fans & Atmosphere</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Team Photos">Team Photos</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Uploader / Photographer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name (e.g. Peter)"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brief Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Details, stadium, or match context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-record" disabled={isSubmitting || !imageUrl}>
              <Upload size={14} />
              {isSubmitting ? 'Saving Picture...' : 'Add Picture to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
