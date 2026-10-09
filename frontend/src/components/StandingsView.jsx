import React, { useState, useMemo } from 'react';
import { Trophy, ArrowUpDown, Search, Info } from 'lucide-react';

export default function StandingsView({ standings, onSelectTeam }) {
  const [sortField, setSortField] = useState('position'); // position, points, gd, gf, won, team_name
  const [sortDirection, setSortDirection] = useState('asc'); // asc or desc
  const [searchFilter, setSearchFilter] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Default to descending for numbers, ascending for names and position
      if (field === 'team_name' || field === 'position') {
        setSortDirection('asc');
      } else {
        setSortDirection('desc');
      }
    }
  };

  const processedStandings = useMemo(() => {
    if (!standings) return [];
    let list = [...standings];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (t) =>
          t.team_name.toLowerCase().includes(q) ||
          t.team_code.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        if (sortDirection === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      }

      if (sortDirection === 'asc') {
        return valA - valB;
      }
      return valB - valA;
    });

    return list;
  }, [standings, sortField, sortDirection, searchFilter]);

  const totalTeams = standings ? standings.length : 0;

  return (
    <div className="standings-container">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Trophy size={28} color="#f59e0b" />
            Official League Standings
          </h2>
          <p>Complete rankings from first (1st) to last ({totalTeams}th) • Real-time updated</p>
        </div>

        {/* Quick Filter */}
        <div className="search-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search club in table..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        {/* Toolbar & Legend */}
        <div className="table-toolbar">
          <div className="table-legend">
            <div className="legend-item">
              <span className="legend-indicator indicator-ucl"></span>
              <span>1 - 4: UEFA Champions League</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator indicator-uel"></span>
              <span>5: UEFA Europa League</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator indicator-rel"></span>
              <span>18 - 20: Relegation</span>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={14} /> Click column headers to sort • Click row for squad details
          </div>
        </div>

        {/* Standings Table */}
        <div className="standings-table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th
                  className="sortable"
                  style={{ width: '60px', textAlign: 'center' }}
                  onClick={() => handleSort('position')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    Pos <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('team_name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Club <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="sortable" style={{ textAlign: 'center' }} onClick={() => handleSort('played')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    P <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="sortable" style={{ textAlign: 'center' }} onClick={() => handleSort('won')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    W <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>D</th>
                <th style={{ textAlign: 'center' }}>L</th>
                <th className="sortable" style={{ textAlign: 'center' }} onClick={() => handleSort('goals_for')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    GF <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>GA</th>
                <th className="sortable" style={{ textAlign: 'center' }} onClick={() => handleSort('goal_difference')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    GD <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="sortable" style={{ textAlign: 'center', color: '#10b981' }} onClick={() => handleSort('points')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    PTS <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>Recent Form</th>
              </tr>
            </thead>

            <tbody>
              {processedStandings.map((t) => {
                let zoneClass = '';
                if (t.position <= 4) zoneClass = 'ucl';
                else if (t.position === 5) zoneClass = 'uel';
                else if (t.position >= 18) zoneClass = 'rel';

                return (
                  <tr
                    key={t.team_id}
                    onClick={() => onSelectTeam(t.team_id)}
                    style={{ cursor: 'pointer' }}
                    title={`Click to view ${t.team_name} squad & details`}
                  >
                    <td className={`pos-cell ${zoneClass}`}>
                      {t.position}
                    </td>

                    <td>
                      <div className="team-cell">
                        <img
                          src={t.team_logo}
                          alt={t.team_name}
                          className="table-logo"
                          onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
                        />
                        <div>
                          <span className="team-name-text">{t.team_name}</span>
                          <span className="team-short-code">{t.team_code}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t.played}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{t.won}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t.drawn}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t.lost}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t.goals_for}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t.goals_against}</td>

                    <td
                      style={{ textAlign: 'center' }}
                      className={`gd-cell ${
                        t.goal_difference > 0
                          ? 'gd-positive'
                          : t.goal_difference < 0
                          ? 'gd-negative'
                          : 'gd-zero'
                      }`}
                    >
                      {t.goal_difference > 0 ? `+${t.goal_difference}` : t.goal_difference}
                    </td>

                    <td style={{ textAlign: 'center' }} className="pts-cell">
                      {t.points}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div className="form-badges" style={{ justifyContent: 'center' }}>
                        {t.form && t.form.length > 0 ? (
                          t.form.map((res, i) => (
                            <span key={i} className={`form-badge ${res}`} title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}>
                              {res}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {processedStandings.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No teams found matching "{searchFilter}"
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
