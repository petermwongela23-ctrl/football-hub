import React from 'react';
import { Calendar, Clock, MapPin, PlayCircle } from 'lucide-react';

export default function FixturesView({ fixtures, onRecordFixtureScore }) {
  return (
    <div className="fixtures-container">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Calendar size={28} color="#3b82f6" />
            Upcoming Fixtures & Schedule
          </h2>
          <p>Scheduled Premier League clashes, stadiums, and kick-off times</p>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="matches-grid">
        {fixtures && fixtures.map((f) => (
          <div key={f.id} className="match-card">
            <div className="match-card-header">
              <span className="round-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                Round {f.round} • UPCOMING
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} />
                {new Date(f.match_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="match-teams-row">
              <div className="match-team">
                <img
                  src={f.home_team.logo}
                  alt={f.home_team.name}
                  className="match-team-logo"
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
                />
                <span className="match-team-name">{f.home_team.name}</span>
              </div>

              <div
                className="match-score-pill"
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0px' }}
              >
                VS
              </div>

              <div className="match-team away">
                <img
                  src={f.away_team.logo}
                  alt={f.away_team.name}
                  className="match-team-logo"
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t3.png'; }}
                />
                <span className="match-team-name">{f.away_team.name}</span>
              </div>
            </div>

            <div className="match-card-events" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} color="#94a3b8" />
              <span>
                {new Date(f.match_date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="match-card-footer">
              <span className="venue-text">
                <MapPin size={13} /> {f.venue}
              </span>
              <button
                className="btn-secondary"
                onClick={() => onRecordFixtureScore(f)}
                title="Simulate / Record result for this match"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', color: 'var(--accent-green)' }}
              >
                <PlayCircle size={14} /> Record Score
              </button>
            </div>
          </div>
        ))}

        {(!fixtures || fixtures.length === 0) && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <Calendar size={40} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Upcoming Fixtures Scheduled</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              All current round fixtures have concluded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
