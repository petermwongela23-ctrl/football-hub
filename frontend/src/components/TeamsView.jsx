import React, { useState, useMemo } from 'react';
import { Shield, Search, Users, MapPin, Calendar } from 'lucide-react';

export default function TeamsView({ teams, onSelectTeam }) {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    if (!searchFilter.trim()) return teams;
    const q = searchFilter.toLowerCase();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.manager.toLowerCase().includes(q)
    );
  }, [teams, searchFilter]);

  return (
    <div className="teams-container">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Shield size={28} color="#10b981" />
            Clubs Directory
          </h2>
          <p>Official 20-club directory, managers, stadiums, and squad rosters</p>
        </div>

        <div className="search-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search clubs, managers, cities..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="teams-grid">
        {filteredTeams.map((team) => (
          <div key={team.id} className="club-card">
            <img
              src={team.logo}
              alt={team.name}
              className="club-card-logo"
              onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
            />

            <h3 className="club-card-name">{team.name}</h3>
            <div className="club-card-manager">👔 {team.manager}</div>

            <div className="club-card-info">
              <div>
                <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {team.stadium} • {team.city}
              </div>
              <div>
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Founded {team.founded} ({team.code})
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onSelectTeam(team.id)}
            >
              <Users size={14} /> View Squad & Profile
            </button>
          </div>
        ))}

        {filteredTeams.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No clubs found matching "{searchFilter}"
          </div>
        )}
      </div>
    </div>
  );
}
