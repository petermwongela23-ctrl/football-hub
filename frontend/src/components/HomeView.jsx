import React from 'react';
import { Trophy, ArrowRight, Activity, Calendar, Shield, Flame } from 'lucide-react';

export default function HomeView({ standings, pastResults, fixtures, topScorers, onSelectMatch, onSelectTeam, onNavigate }) {
  // Spotlight match is the most recent or highest profile past match
  const spotlightMatch = pastResults && pastResults.length > 0 ? pastResults[0] : null;
  const nextFixture = fixtures && fixtures.length > 0 ? fixtures[0] : null;
  const topTeams = standings ? standings.slice(0, 5) : [];
  const bottomTeams = standings ? standings.slice(17, 20) : [];
  const leaders = topScorers ? topScorers.slice(0, 3) : [];

  return (
    <div className="home-container">
      {/* Hero Match Spotlight */}
      {spotlightMatch && (
        <div className="hero-spotlight">
          <div className="hero-tag">
            <Activity size={13} />
            Featured Match of the Week • Round {spotlightMatch.round}
          </div>

          <div className="spotlight-match">
            <div className="spotlight-team">
              <img
                src={spotlightMatch.home_team.logo}
                alt={spotlightMatch.home_team.name}
                className="spotlight-logo"
                onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
              />
              <div>
                <h3 className="spotlight-team-name">{spotlightMatch.home_team.name}</h3>
                <p className="spotlight-venue">{spotlightMatch.venue}</p>
              </div>
            </div>

            <div className="spotlight-score-box">
              <div className="spotlight-score">
                {spotlightMatch.home_score} - {spotlightMatch.away_score}
              </div>
              <div className="spotlight-status">FINAL SCORE</div>
            </div>

            <div className="spotlight-team away">
              <img
                src={spotlightMatch.away_team.logo}
                alt={spotlightMatch.away_team.name}
                className="spotlight-logo"
                onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t3.png'; }}
              />
              <div>
                <h3 className="spotlight-team-name">{spotlightMatch.away_team.name}</h3>
                <p className="spotlight-venue">{new Date(spotlightMatch.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <div className="hero-scorers">
              {spotlightMatch.events && spotlightMatch.events.length > 0 ? (
                <div>
                  ⚽ Key Moments:{' '}
                  {spotlightMatch.events.slice(0, 3).map((e, idx) => (
                    <span key={idx} style={{ marginRight: '0.75rem' }}>
                      <strong>{e.player_name}</strong> ({e.minute}')
                    </span>
                  ))}
                </div>
              ) : (
                <span>High intensity match with dominant midfield battle.</span>
              )}
            </div>

            <button className="btn-record" onClick={() => onSelectMatch(spotlightMatch)}>
              View Match Center
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Standings Preview & Recent Matches */}
      <div className="home-grid">
        {/* Left Column: Recent Past Results */}
        <div>
          <div className="view-header" style={{ marginBottom: '1rem' }}>
            <div className="view-title">
              <h2>Recent Match Results</h2>
              <p>Scores and details from recent game weeks</p>
            </div>
            <button className="btn-secondary" onClick={() => onNavigate('results')}>
              View All Past Results <ArrowRight size={14} />
            </button>
          </div>

          <div className="matches-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {pastResults && pastResults.slice(1, 5).map((m) => (
              <div key={m.id} className="match-card">
                <div className="match-card-header">
                  <span className="round-badge">Round {m.round}</span>
                  <span>{new Date(m.match_date).toLocaleDateString()}</span>
                </div>

                <div className="match-teams-row">
                  <div className="match-team">
                    <img src={m.home_team.logo} alt={m.home_team.short_name} className="match-team-logo" />
                    <span className="match-team-name">{m.home_team.short_name}</span>
                  </div>
                  <div className="match-score-pill">
                    {m.home_score} : {m.away_score}
                  </div>
                  <div className="match-team away">
                    <img src={m.away_team.logo} alt={m.away_team.short_name} className="match-team-logo" />
                    <span className="match-team-name">{m.away_team.short_name}</span>
                  </div>
                </div>

                <div className="match-card-events">
                  {m.events && m.events.filter(e => e.event_type === 'GOAL').slice(0, 2).map((ev, i) => (
                    <span key={i} className="event-chip">
                      ⚽ {ev.player_name} ({ev.minute}')
                    </span>
                  ))}
                  {(!m.events || m.events.length === 0) && (
                    <span style={{ color: 'var(--text-subtle)' }}>No goals recorded</span>
                  )}
                </div>

                <div className="match-card-footer">
                  <span className="venue-text">{m.venue}</span>
                  <button className="btn-match-center" onClick={() => onSelectMatch(m)}>
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Big Match Promo */}
          {nextFixture && (
            <div style={{ marginTop: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ Next Fixture Coming Up • Round {nextFixture.round}
                </span>
                <h4 style={{ fontSize: '1.15rem', color: 'white', marginTop: '0.25rem' }}>
                  {nextFixture.home_team.name} vs {nextFixture.away_team.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  📍 {nextFixture.venue} • {new Date(nextFixture.match_date).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button className="btn-secondary" onClick={() => onNavigate('fixtures')}>
                <Calendar size={15} /> All Fixtures
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Standings Quick Preview & Golden Boot */}
        <div>
          {/* Quick Table */}
          <div className="table-card" style={{ marginBottom: '1.5rem' }}>
            <div className="table-toolbar">
              <div style={{ fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Trophy size={16} color="#f59e0b" />
                Table Snapshot
              </div>
              <button
                className="btn-secondary"
                onClick={() => onNavigate('standings')}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                Full 1st-Last Table →
              </button>
            </div>

            <table className="standings-table">
              <thead>
                <tr>
                  <th style={{ width: '38px', textAlign: 'center' }}>Pos</th>
                  <th>Club</th>
                  <th style={{ textAlign: 'center' }}>P</th>
                  <th style={{ textAlign: 'center' }}>GD</th>
                  <th style={{ textAlign: 'center' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {topTeams.map((team) => (
                  <tr key={team.team_id} onClick={() => onSelectTeam(team.team_id)} style={{ cursor: 'pointer' }}>
                    <td className={`pos-cell ${team.position <= 4 ? 'ucl' : ''}`}>{team.position}</td>
                    <td>
                      <div className="team-cell">
                        <img src={team.team_logo} alt={team.team_name} className="table-logo" />
                        <span className="team-name-text" style={{ fontSize: '0.85rem' }}>{team.team_name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{team.played}</td>
                    <td style={{ textAlign: 'center' }} className={`gd-cell ${team.goal_difference > 0 ? 'gd-positive' : team.goal_difference < 0 ? 'gd-negative' : 'gd-zero'}`}>
                      {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                    </td>
                    <td style={{ textAlign: 'center' }} className="pts-cell">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom 3 Relegation Watch */}
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(239, 68, 68, 0.08)', borderTop: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.75rem', color: '#fca5a5' }}>
              🔻 <strong>Relegation Zone:</strong>{' '}
              {bottomTeams.map((t, idx) => (
                <span key={t.team_id}>
                  {t.position}. {t.team_name} ({t.points} pts){idx < bottomTeams.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Golden Boot Leaders */}
          <div className="table-card">
            <div className="table-toolbar">
              <div style={{ fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Flame size={16} color="#10b981" />
                Golden Boot Race
              </div>
              <button
                className="btn-secondary"
                onClick={() => onNavigate('scorers')}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                All Scorers →
              </button>
            </div>

            <div style={{ padding: '1rem' }}>
              {leaders.map((p, idx) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < leaders.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, color: idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)', width: '20px' }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.88rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.team_name} • {p.position}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-green)', fontSize: '1.1rem' }}>
                      {p.goals} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>goals</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
