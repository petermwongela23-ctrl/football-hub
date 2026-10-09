import React from 'react';
import { X, Calendar, MapPin, Award, Activity } from 'lucide-react';

export default function MatchModal({ match, onClose }) {
  if (!match) return null;

  const stats = match.stats || {
    home_possession: 50,
    away_possession: 50,
    home_shots: 12,
    away_shots: 10,
    home_shots_on_target: 5,
    away_shots_on_target: 4,
    home_corners: 6,
    away_corners: 4,
    home_fouls: 10,
    away_fouls: 12,
  };

  const homeEvents = match.events ? match.events.filter((e) => e.team_id === match.home_team_id) : [];
  const awayEvents = match.events ? match.events.filter((e) => e.team_id === match.away_team_id) : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#10b981" />
            <h3>Official Match Center</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Match Score Headline */}
          <div style={{ background: '#0a0e17', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Round {match.round} • {new Date(match.match_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={match.home_team.logo}
                  alt={match.home_team.name}
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
                />
                <strong style={{ color: 'white', fontSize: '1.05rem' }}>{match.home_team.name}</strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.4rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '4px' }}>
                  {match.home_score} - {match.away_score}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }}>FINAL</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img
                  src={match.away_team.logo}
                  alt={match.away_team.name}
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t3.png'; }}
                />
                <strong style={{ color: 'white', fontSize: '1.05rem' }}>{match.away_team.name}</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '1rem' }}>
              <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
              {match.venue}
            </div>
          </div>

          {/* Goals & Key Events Timeline */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              Match Events & Timeline
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{match.home_team.short_name} Events</strong>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {homeEvents.map((e, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem' }}>
                      {e.event_type === 'GOAL' && '⚽ '}
                      {e.event_type === 'PENALTY' && '🎯 '}
                      {e.event_type === 'YELLOW_CARD' && '🟨 '}
                      {e.event_type === 'RED_CARD' && '🟥 '}
                      <span style={{ color: 'white', fontWeight: 600 }}>{e.player_name}</span>{' '}
                      <span style={{ color: 'var(--accent-green)' }}>{e.minute}'</span>
                    </div>
                  ))}
                  {homeEvents.length === 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>None</span>
                  )}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{match.away_team.short_name} Events</strong>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {awayEvents.map((e, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem' }}>
                      {e.event_type === 'GOAL' && '⚽ '}
                      {e.event_type === 'PENALTY' && '🎯 '}
                      {e.event_type === 'YELLOW_CARD' && '🟨 '}
                      {e.event_type === 'RED_CARD' && '🟥 '}
                      <span style={{ color: 'white', fontWeight: 600 }}>{e.player_name}</span>{' '}
                      <span style={{ color: 'var(--accent-green)' }}>{e.minute}'</span>
                    </div>
                  ))}
                  {awayEvents.length === 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Match Stats Comparison */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 700 }}>
              Match Statistics
            </h4>

            {/* Possession */}
            <div className="stat-row">
              <div className="stat-header">
                <span>{stats.home_possession}%</span>
                <span style={{ color: 'var(--text-muted)' }}>Ball Possession</span>
                <span>{stats.away_possession}%</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${stats.home_possession}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${stats.away_possession}%` }}></div>
              </div>
            </div>

            {/* Shots */}
            <div className="stat-row">
              <div className="stat-header">
                <span>{stats.home_shots}</span>
                <span style={{ color: 'var(--text-muted)' }}>Total Shots</span>
                <span>{stats.away_shots}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${(stats.home_shots / ((stats.home_shots + stats.away_shots) || 1)) * 100}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${(stats.away_shots / ((stats.home_shots + stats.away_shots) || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Shots on Target */}
            <div className="stat-row">
              <div className="stat-header">
                <span>{stats.home_shots_on_target}</span>
                <span style={{ color: 'var(--text-muted)' }}>Shots On Target</span>
                <span>{stats.away_shots_on_target}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${(stats.home_shots_on_target / ((stats.home_shots_on_target + stats.away_shots_on_target) || 1)) * 100}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${(stats.away_shots_on_target / ((stats.home_shots_on_target + stats.away_shots_on_target) || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Corners */}
            <div className="stat-row">
              <div className="stat-header">
                <span>{stats.home_corners}</span>
                <span style={{ color: 'var(--text-muted)' }}>Corner Kicks</span>
                <span>{stats.away_corners}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${(stats.home_corners / ((stats.home_corners + stats.away_corners) || 1)) * 100}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${(stats.away_corners / ((stats.home_corners + stats.away_corners) || 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Fouls */}
            <div className="stat-row">
              <div className="stat-header">
                <span>{stats.home_fouls}</span>
                <span style={{ color: 'var(--text-muted)' }}>Fouls Committed</span>
                <span>{stats.away_fouls}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${(stats.home_fouls / ((stats.home_fouls + stats.away_fouls) || 1)) * 100}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${(stats.away_fouls / ((stats.home_fouls + stats.away_fouls) || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
