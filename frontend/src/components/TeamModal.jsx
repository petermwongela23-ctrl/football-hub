import React, { useEffect, useState } from 'react';
import { X, Shield, MapPin, User, Calendar, Award } from 'lucide-react';

export default function TeamModal({ teamId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    fetch(`/api/teams/${teamId}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching team:', err);
        setLoading(false);
      });
  }, [teamId]);

  if (!teamId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="#10b981" />
            <h3>Club Profile & Squad Roster</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading club information...
            </div>
          ) : data && data.team ? (
            <>
              {/* Club Header Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#0a0e17', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <img
                  src={data.team.logo}
                  alt={data.team.name}
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
                />
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.35rem', fontWeight: 800 }}>{data.team.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600, marginTop: '2px' }}>
                    Manager: {data.team.manager}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    📍 {data.team.stadium} • {data.team.city} • Est. {data.team.founded}
                  </div>
                </div>
              </div>

              {/* Squad List */}
              <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '0.85rem', fontWeight: 700 }}>
                Squad Players & Key Stars
              </h4>

              {data.squad && data.squad.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {data.squad.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-card)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.photo}
                          alt={p.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            #{p.number} • {p.position} • {p.nationality}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 800, fontSize: '0.95rem' }}>
                          {p.goals} <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>goals</span>
                        </span>
                        <span style={{ marginLeft: '0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {p.assists} assists
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No rostered players registered in this squad profile yet.
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--accent-red)' }}>
              Could not load team details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
