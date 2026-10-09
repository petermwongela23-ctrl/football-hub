import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddMatchModal({ teams, initialFixture, onClose, onMatchCreated }) {
  const [round, setRound] = useState(initialFixture ? initialFixture.round : 6);
  const [homeTeamId, setHomeTeamId] = useState(initialFixture ? initialFixture.home_team_id : (teams[0]?.id || 1));
  const [awayTeamId, setAwayTeamId] = useState(initialFixture ? initialFixture.away_team_id : (teams[1]?.id || 2));
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [venue, setVenue] = useState(initialFixture ? initialFixture.venue : '');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));
  const [scorers, setScorers] = useState([
    { team_id: initialFixture ? initialFixture.home_team_id : (teams[0]?.id || 1), player_name: '', minute: 24, event_type: 'GOAL' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddScorer = () => {
    setScorers([
      ...scorers,
      { team_id: Number(homeTeamId), player_name: '', minute: 60, event_type: 'GOAL' }
    ]);
  };

  const handleRemoveScorer = (index) => {
    setScorers(scorers.filter((_, idx) => idx !== index));
  };

  const handleScorerChange = (index, field, value) => {
    const updated = [...scorers];
    updated[index][field] = field === 'team_id' || field === 'minute' ? Number(value) : value;
    setScorers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(homeTeamId) === Number(awayTeamId)) {
      setError('Home team and Away team must be different clubs.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      round: Number(round),
      home_team_id: Number(homeTeamId),
      away_team_id: Number(awayTeamId),
      home_score: Number(homeScore),
      away_score: Number(awayScore),
      match_date: matchDate.replace('T', ' '),
      venue: venue || undefined,
      scorers: scorers.filter((s) => s.player_name.trim() !== ''),
    };

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit match');
      }

      onMatchCreated('Match result recorded and standings updated successfully!');
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
          <h3 style={{ color: 'white' }}>Record New Match Result</h3>
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

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Round / Matchday</label>
              <input
                type="number"
                min="1"
                max="38"
                className="form-control"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Match Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Home Team</label>
              <select
                className="form-control"
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Away Team</label>
              <select
                className="form-control"
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Home Score</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Away Score</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Stadium / Venue (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Leave blank to use home stadium default"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          {/* Goal Scorers Section */}
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Goal Scorers & Key Events (Optional)</label>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddScorer}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                <Plus size={13} /> Add Scorer
              </button>
            </div>

            {scorers.map((s, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <select
                  className="form-control"
                  style={{ padding: '0.45rem', fontSize: '0.8rem' }}
                  value={s.team_id}
                  onChange={(e) => handleScorerChange(idx, 'team_id', e.target.value)}
                >
                  <option value={homeTeamId}>Home Team</option>
                  <option value={awayTeamId}>Away Team</option>
                </select>

                <input
                  type="text"
                  placeholder="Player Name (e.g. Haaland)"
                  className="form-control"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
                  value={s.player_name}
                  onChange={(e) => handleScorerChange(idx, 'player_name', e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Min"
                  min="1"
                  max="120"
                  className="form-control"
                  style={{ padding: '0.45rem', fontSize: '0.8rem' }}
                  value={s.minute}
                  onChange={(e) => handleScorerChange(idx, 'minute', e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => handleRemoveScorer(idx)}
                  className="btn-secondary"
                  style={{ padding: '0.45rem', color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-record" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Submit & Update Standings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
