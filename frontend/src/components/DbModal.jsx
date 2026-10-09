import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, ShieldCheck, Server } from 'lucide-react';

export default function DbModal({ dbStatus, onClose, onDbUpdated }) {
  const [host, setHost] = useState(dbStatus?.host || 'localhost');
  const [port, setPort] = useState(dbStatus?.port || 3306);
  const [user, setUser] = useState(dbStatus?.user || 'root');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState(dbStatus?.database || 'footballdb');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setTesting(true);
    setResult(null);

    try {
      const res = await fetch('/api/db/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host,
          port: Number(port),
          user,
          password,
          database,
        }),
      });

      const data = await res.json();
      setResult(data);
      if (data.success) {
        onDbUpdated(data.status);
      }
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} color="#10b981" />
            <h3 style={{ color: 'white' }}>MySQL Database Integration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Status Box */}
          <div
            style={{
              background: dbStatus?.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${dbStatus?.connected ? '#10b981' : '#f59e0b'}`,
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            {dbStatus?.connected ? (
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <strong style={{ color: dbStatus?.connected ? '#10b981' : '#f59e0b', fontSize: '0.95rem' }}>
                {dbStatus?.connected
                  ? `Connected to MySQL: ${dbStatus.database}`
                  : 'Operating in Fast Standalone Data Mode'}
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {dbStatus?.message || 'Connect to your MySQL server to persist changes.'}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            MySQL Server is detected on your Windows machine at <code style={{ color: 'var(--accent-green)' }}>localhost:3306</code>. Enter your MySQL credentials below to connect. Tables (<code style={{ color: 'white' }}>teams, matches, match_events, players</code>) and seed data will be automatically created.
          </p>

          <form onSubmit={handleConnect}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Host</label>
                <input
                  type="text"
                  className="form-control"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Port</label>
                <input
                  type="number"
                  className="form-control"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter MySQL password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Database Name</label>
              <input
                type="text"
                className="form-control"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                required
              />
            </div>

            {result && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  background: result.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`,
                  color: result.success ? '#6ee7b7' : '#fca5a5',
                }}
              >
                {result.success ? result.message : `Connection failed: ${result.error}`}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn-record" disabled={testing}>
                <Server size={15} />
                {testing ? 'Testing Connection...' : 'Connect to MySQL'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
