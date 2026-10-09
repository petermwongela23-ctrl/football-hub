import React, { useState, useMemo } from 'react';
import { History, Search, Filter, X, Eye, Calendar } from 'lucide-react';

export default function ResultsView({ pastResults, teams, onSelectMatch }) {
  const [selectedRound, setSelectedRound] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique rounds from results
  const availableRounds = useMemo(() => {
    if (!pastResults) return [];
    const set = new Set();
    pastResults.forEach((m) => set.add(m.round));
    return Array.from(set).sort((a, b) => a - b);
  }, [pastResults]);

  // Filter results
  const filteredMatches = useMemo(() => {
    if (!pastResults) return [];
    return pastResults.filter((m) => {
      // Round filter
      if (selectedRound !== 'ALL' && m.round !== Number(selectedRound)) {
        return false;
      }
      // Team filter
      if (
        selectedTeam !== 'ALL' &&
        m.home_team_id !== Number(selectedTeam) &&
        m.away_team_id !== Number(selectedTeam)
      ) {
        return false;
      }
      // Search term (team name, code, venue, scorer name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const teamMatch =
          m.home_team.name.toLowerCase().includes(q) ||
          m.away_team.name.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q);
        const scorerMatch = m.events && m.events.some((e) => e.player_name.toLowerCase().includes(q));
        if (!teamMatch && !scorerMatch) return false;
      }
      return true;
    });
  }, [pastResults, selectedRound, selectedTeam, searchQuery]);

  const hasActiveFilters = selectedRound !== 'ALL' || selectedTeam !== 'ALL' || searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedRound('ALL');
    setSelectedTeam('ALL');
    setSearchQuery('');
  };

  return (
    <div className="results-container">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <History size={28} color="#10b981" />
            Past Match Results
          </h2>
          <p>Explore historical scores, goal scorers, and match center statistics</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar">
        {/* Round Filter Buttons */}
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Round:</span>
          <select
            className="filter-select"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
          >
            <option value="ALL">All Rounds</option>
            {availableRounds.map((r) => (
              <option key={r} value={r}>
                Round {r}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Club:</span>
          <select
            className="filter-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="ALL">All Clubs</option>
            {teams &&
              teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by club, scorer (e.g. Haaland, Salah), or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button className="btn-secondary" onClick={handleClearFilters}>
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing <strong>{filteredMatches.length}</strong> match result{filteredMatches.length === 1 ? '' : 's'}
      </div>

      {/* Matches Grid */}
      <div className="matches-grid">
        {filteredMatches.map((m) => (
          <div key={m.id} className="match-card">
            <div className="match-card-header">
              <span className="round-badge">Round {m.round}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                {new Date(m.match_date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Scoreboard */}
            <div className="match-teams-row">
              <div className="match-team">
                <img
                  src={m.home_team.logo}
                  alt={m.home_team.name}
                  className="match-team-logo"
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
                />
                <span className="match-team-name">{m.home_team.name}</span>
              </div>

              <div className="match-score-pill">
                {m.home_score} - {m.away_score}
              </div>

              <div className="match-team away">
                <img
                  src={m.away_team.logo}
                  alt={m.away_team.name}
                  className="match-team-logo"
                  onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t3.png'; }}
                />
                <span className="match-team-name">{m.away_team.name}</span>
              </div>
            </div>

            {/* Goals & Events */}
            <div className="match-card-events">
              {m.events && m.events.length > 0 ? (
                m.events.map((e, idx) => (
                  <span key={idx} className="event-chip">
                    {e.event_type === 'GOAL' && '⚽'}
                    {e.event_type === 'PENALTY' && '🎯'}
                    {e.event_type === 'YELLOW_CARD' && '🟨'}
                    {e.event_type === 'RED_CARD' && '🟥'}
                    <strong>{e.player_name}</strong> ({e.minute}')
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-subtle)' }}>No disciplinary or goal events recorded</span>
              )}
            </div>

            {/* Footer */}
            <div className="match-card-footer">
              <span className="venue-text">📍 {m.venue}</span>
              <button className="btn-match-center" onClick={() => onSelectMatch(m)}>
                <Eye size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Match Center
              </button>
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <History size={40} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Matches Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              No past results match your current filter criteria.
            </p>
            <button className="btn-record" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
