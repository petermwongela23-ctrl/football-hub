import React, { useState, useMemo } from 'react';
import { Flame, Award, Search, Filter } from 'lucide-react';

export default function ScorersView({ topScorers }) {
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScorers = useMemo(() => {
    if (!topScorers) return [];
    return topScorers.filter((p) => {
      if (positionFilter !== 'ALL' && p.position !== positionFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.team_name.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [topScorers, positionFilter, searchQuery]);

  // Podium top 3 (unfiltered top 3 for the championship podium)
  const podium = topScorers ? topScorers.slice(0, 3) : [];

  return (
    <div className="scorers-container">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Flame size={28} color="#10b981" />
            Top Goal Scorers & Playmakers
          </h2>
          <p>The race for the Golden Boot and season individual statistics</p>
        </div>
      </div>

      {/* Podium Top 3 */}
      {podium.length >= 3 && (
        <div className="podium-container">
          {/* 2nd Place */}
          <div className="podium-card" style={{ borderColor: '#94a3b8' }}>
            <div className="podium-rank" style={{ background: '#94a3b8', color: '#0f172a' }}>2</div>
            <img src={podium[1].photo} alt={podium[1].name} className="podium-photo" />
            <h4 style={{ color: 'white', fontWeight: 700 }}>{podium[1].name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{podium[1].team_name}</p>
            <div className="podium-goals">{podium[1].goals}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              {podium[1].assists} Assists • {podium[1].nationality}
            </div>
          </div>

          {/* 1st Place (Winner) */}
          <div className="podium-card first">
            <div className="podium-rank">👑 1</div>
            <img
              src={podium[0].photo}
              alt={podium[0].name}
              className="podium-photo"
              style={{ width: '85px', height: '85px', borderColor: 'var(--accent-gold)' }}
            />
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{podium[0].name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>{podium[0].team_name}</p>
            <div className="podium-goals" style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>
              {podium[0].goals}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {podium[0].assists} Assists • {podium[0].nationality}
            </div>
          </div>

          {/* 3rd Place */}
          <div className="podium-card" style={{ borderColor: '#d97706' }}>
            <div className="podium-rank" style={{ background: '#b45309', color: 'white' }}>3</div>
            <img src={podium[2].photo} alt={podium[2].name} className="podium-photo" />
            <h4 style={{ color: 'white', fontWeight: 700 }}>{podium[2].name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{podium[2].team_name}</p>
            <div className="podium-goals">{podium[2].goals}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              {podium[2].assists} Assists • {podium[2].nationality}
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="filter-bar">
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Position:</span>
          <select
            className="filter-select"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="ALL">All Positions</option>
            <option value="FW">Forwards (FW)</option>
            <option value="MF">Midfielders (MF)</option>
            <option value="DF">Defenders (DF)</option>
          </select>
        </div>

        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search player, club, or nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="table-card">
        <div className="standings-table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
                <th>Player</th>
                <th>Club</th>
                <th style={{ textAlign: 'center' }}>Pos</th>
                <th style={{ textAlign: 'center' }}>Nation</th>
                <th style={{ textAlign: 'center', color: 'var(--accent-green)' }}>Goals</th>
                <th style={{ textAlign: 'center' }}>Assists</th>
                <th style={{ textAlign: 'center' }}>🟨 Yellow</th>
                <th style={{ textAlign: 'center' }}>🟥 Red</th>
              </tr>
            </thead>
            <tbody>
              {filteredScorers.map((p, idx) => (
                <tr key={p.id}>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.photo}
                        alt={p.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ color: 'white' }}>{p.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>#{p.number}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.team_name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {p.position}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{p.nationality}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-green)' }}>
                    {p.goals}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.assists}</td>
                  <td style={{ textAlign: 'center', color: '#facc15' }}>{p.yellow_cards}</td>
                  <td style={{ textAlign: 'center', color: '#f87171' }}>{p.red_cards}</td>
                </tr>
              ))}

              {filteredScorers.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No players found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
