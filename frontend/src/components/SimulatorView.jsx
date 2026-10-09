import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Activity, Volume2, Shield, Flame } from 'lucide-react';

export default function SimulatorView({ teams, fixtures, onMatchSaved }) {
  const [homeTeamId, setHomeTeamId] = useState(teams[0]?.id || 1);
  const [awayTeamId, setAwayTeamId] = useState(teams[1]?.id || 2);
  const [round, setRound] = useState(6);
  const [simSpeed, setSimSpeed] = useState(1); // 1 = normal (approx 35s), 2 = fast, 5 = ultra

  // Match Engine State
  const [matchState, setMatchState] = useState('IDLE'); // IDLE, RUNNING, PAUSED, FINISHED
  const [minute, setMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [ballZone, setBallZone] = useState('midfield'); // home_box, home_half, midfield, away_half, away_box
  const [commentary, setCommentary] = useState([]);
  const [events, setEvents] = useState([]);
  const [savedToDb, setSavedToDb] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Live In-Match Stats
  const [stats, setStats] = useState({
    homePossession: 50,
    awayPossession: 50,
    homeShots: 0,
    awayShots: 0,
    homeOnTarget: 0,
    awayOnTarget: 0,
    homeCorners: 0,
    awayCorners: 0,
    homeFouls: 0,
    awayFouls: 0,
  });

  const timerRef = useRef(null);
  const feedEndRef = useRef(null);

  const homeTeam = teams.find((t) => t.id === Number(homeTeamId)) || teams[0];
  const awayTeam = teams.find((t) => t.id === Number(awayTeamId)) || teams[1];

  // Auto-scroll commentary feed to latest
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentary]);

  const addCommentary = (min, text, type = 'normal') => {
    setCommentary((prev) => [...prev, { min, text, type, id: Date.now() + Math.random() }]);
  };

  const handleStart = () => {
    if (homeTeamId === awayTeamId) {
      alert('Please select two different clubs!');
      return;
    }
    if (matchState === 'IDLE' || matchState === 'FINISHED') {
      setMinute(0);
      setHomeScore(0);
      setAwayScore(0);
      setEvents([]);
      setSavedToDb(false);
      setStats({
        homePossession: 50,
        awayPossession: 50,
        homeShots: 0,
        awayShots: 0,
        homeOnTarget: 0,
        awayOnTarget: 0,
        homeCorners: 0,
        awayCorners: 0,
        homeFouls: 0,
        awayFouls: 0,
      });
      setCommentary([
        {
          min: 0,
          text: `Referee whistles! Kick-off between ${homeTeam.name} and ${awayTeam.name} at ${homeTeam.stadium}!`,
          type: 'highlight',
          id: Date.now(),
        },
      ]);
    }
    setMatchState('RUNNING');
  };

  const handlePause = () => {
    setMatchState('PAUSED');
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setMatchState('IDLE');
    setMinute(0);
    setHomeScore(0);
    setAwayScore(0);
    setEvents([]);
    setCommentary([]);
    setBallZone('midfield');
    setSavedToDb(false);
  };

  const handleSkipToEnd = () => {
    if (matchState === 'FINISHED') return;
    clearInterval(timerRef.current);
    // Simulate remaining minutes instantly
    let curMin = minute;
    let hScore = homeScore;
    let aScore = awayScore;
    let curEvents = [...events];
    let curStats = { ...stats };

    while (curMin < 90) {
      curMin += Math.floor(Math.random() * 4) + 2;
      if (curMin > 90) curMin = 90;

      const roll = Math.random();
      if (roll < 0.08) {
        // Goal home
        hScore++;
        const scorer = `${homeTeam.short_name} Striker`;
        curEvents.push({ minute: curMin, team_id: homeTeam.id, player_name: scorer, event_type: 'GOAL' });
        addCommentary(curMin, `⚽ GOAL! ${homeTeam.name} scores! Fantastic finish into the top corner!`, 'goal');
      } else if (roll < 0.15) {
        // Goal away
        aScore++;
        const scorer = `${awayTeam.short_name} Forward`;
        curEvents.push({ minute: curMin, team_id: awayTeam.id, player_name: scorer, event_type: 'GOAL' });
        addCommentary(curMin, `⚽ GOAL! ${awayTeam.name} strikes on the counter-attack!`, 'goal');
      }
    }

    setMinute(90);
    setHomeScore(hScore);
    setAwayScore(aScore);
    setEvents(curEvents);
    setMatchState('FINISHED');
    addCommentary(90, `Full-time whistle! Final score: ${homeTeam.name} ${hScore} - ${aScore} ${awayTeam.name}!`, 'highlight');
  };

  // Main Simulation Loop
  useEffect(() => {
    if (matchState !== 'RUNNING') {
      clearInterval(timerRef.current);
      return;
    }

    const intervalTime = Math.max(80, Math.floor(400 / simSpeed));

    timerRef.current = setInterval(() => {
      setMinute((prevMin) => {
        const nextMin = prevMin + 1;

        // Ball movement randomizer
        const zones = ['home_box', 'home_half', 'midfield', 'away_half', 'away_box'];
        const randomZone = zones[Math.floor(Math.random() * zones.length)];
        setBallZone(randomZone);

        // Stats updates
        setStats((prev) => {
          const shift = (Math.random() - 0.5) * 4;
          const newHomePoss = Math.min(75, Math.max(25, Math.round(prev.homePossession + shift)));
          return {
            ...prev,
            homePossession: newHomePoss,
            awayPossession: 100 - newHomePoss,
          };
        });

        // Event Generator
        const roll = Math.random();

        // 1. Home Goal (~2.5% chance per tick)
        if (roll < 0.024) {
          setHomeScore((s) => s + 1);
          setStats((prev) => ({
            ...prev,
            homeShots: prev.homeShots + 1,
            homeOnTarget: prev.homeOnTarget + 1,
          }));
          const scorerName = `${homeTeam.short_name} Star`;
          setEvents((prev) => [
            ...prev,
            { minute: nextMin, team_id: homeTeam.id, player_name: scorerName, event_type: 'GOAL' },
          ]);
          addCommentary(
            nextMin,
            `⚽ GOAL FOR ${homeTeam.name.toUpperCase()}! A brilliant build-up finds the bottom corner! (${homeScore + 1}-${awayScore})`,
            'goal'
          );
        }
        // 2. Away Goal (~2.2% chance per tick)
        else if (roll < 0.046) {
          setAwayScore((s) => s + 1);
          setStats((prev) => ({
            ...prev,
            awayShots: prev.awayShots + 1,
            awayOnTarget: prev.awayOnTarget + 1,
          }));
          const scorerName = `${awayTeam.short_name} Striker`;
          setEvents((prev) => [
            ...prev,
            { minute: nextMin, team_id: awayTeam.id, player_name: scorerName, event_type: 'GOAL' },
          ]);
          addCommentary(
            nextMin,
            `⚽ GOAL FOR ${awayTeam.name.toUpperCase()}! Stunner from outside the box leaves the keeper helpless! (${homeScore}-${awayScore + 1})`,
            'goal'
          );
        }
        // 3. Dangerous Shot
        else if (roll < 0.12) {
          const isHome = Math.random() > 0.5;
          const shootingTeam = isHome ? homeTeam : awayTeam;
          setStats((prev) => ({
            ...prev,
            [isHome ? 'homeShots' : 'awayShots']: prev[isHome ? 'homeShots' : 'awayShots'] + 1,
            [isHome ? 'homeOnTarget' : 'awayOnTarget']: prev[isHome ? 'homeOnTarget' : 'awayOnTarget'] + (Math.random() > 0.4 ? 1 : 0),
          }));
          addCommentary(nextMin, `🧤 Huge chance! ${shootingTeam.name} breaks through but the goalkeeper pulls off a flying save!`, 'chance');
        }
        // 4. Yellow Card
        else if (roll < 0.16) {
          const isHome = Math.random() > 0.5;
          const cardTeam = isHome ? homeTeam : awayTeam;
          setStats((prev) => ({
            ...prev,
            [isHome ? 'homeFouls' : 'awayFouls']: prev[isHome ? 'homeFouls' : 'awayFouls'] + 1,
          }));
          addCommentary(nextMin, `🟨 Yellow Card! Tactical foul in midfield by ${cardTeam.name} to stop the break.`, 'card');
        }
        // 5. Corner Kick
        else if (roll < 0.22) {
          const isHome = Math.random() > 0.5;
          setStats((prev) => ({
            ...prev,
            [isHome ? 'homeCorners' : 'awayCorners']: prev[isHome ? 'homeCorners' : 'awayCorners'] + 1,
          }));
          addCommentary(nextMin, `🚩 Corner kick awarded to ${isHome ? homeTeam.name : awayTeam.name}. Crossed into a crowded box!`, 'normal');
        }
        // Halftime marker
        if (nextMin === 45) {
          addCommentary(45, `⏱️ Half-Time! The referee blows for the interval. Current score: ${homeTeam.short_name} ${homeScore} - ${awayScore} ${awayTeam.short_name}.`, 'highlight');
        }

        // Full-time trigger
        if (nextMin >= 90) {
          clearInterval(timerRef.current);
          setMatchState('FINISHED');
          addCommentary(90, `🏁 FULL TIME! Thrilling match finishes ${homeTeam.name} ${homeScore} - ${awayScore} ${awayTeam.name}!`, 'highlight');
          return 90;
        }

        return nextMin;
      });
    }, intervalTime);

    return () => clearInterval(timerRef.current);
  }, [matchState, simSpeed, homeTeam, awayTeam, homeScore, awayScore]);

  // Save Final Result to MySQL Database
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      const payload = {
        round: Number(round),
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        home_score: homeScore,
        away_score: awayScore,
        match_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        venue: homeTeam.stadium,
        scorers: events.map((e) => ({
          team_id: e.team_id,
          player_name: e.player_name,
          minute: e.minute,
          event_type: e.event_type,
        })),
      };

      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to record match into database');

      setSavedToDb(true);
      onMatchSaved('Simulated match recorded to MySQL! Standings and past results updated.');
    } catch (err) {
      alert('Error saving match: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="simulator-container">
      {/* View Header */}
      <div className="view-header">
        <div className="view-title">
          <h2>
            <Activity size={28} color="#10b981" />
            Live Match Simulator & Broadcast Arena
          </h2>
          <p>Experience animated minute-by-minute Premier League drama with live commentary and real-time stats</p>
        </div>
      </div>

      {/* Match Setup Controls */}
      <div className="filter-bar" style={{ gap: '1.25rem' }}>
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Home:</span>
          <select
            className="filter-select"
            disabled={matchState === 'RUNNING'}
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

        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Away:</span>
          <select
            className="filter-select"
            disabled={matchState === 'RUNNING'}
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

        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Speed:</span>
          <select
            className="filter-select"
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
          >
            <option value="1">1x Normal</option>
            <option value="2">2x Fast</option>
            <option value="5">5x Ultra Speed</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {matchState !== 'RUNNING' ? (
            <button className="btn-record" onClick={handleStart}>
              <Play size={15} />
              {matchState === 'PAUSED' ? 'Resume Match' : 'Kick Off'}
            </button>
          ) : (
            <button className="btn-secondary" onClick={handlePause}>
              <Pause size={15} /> Pause
            </button>
          )}

          {matchState === 'RUNNING' && (
            <button className="btn-secondary" onClick={handleSkipToEnd}>
              <FastForward size={15} /> Skip to 90'
            </button>
          )}

          <button className="btn-secondary" onClick={handleReset}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* Broadcast Scoreboard Banner */}
      <div
        style={{
          background: 'linear-gradient(180deg, #131d2e 0%, #0d1522 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem' }}>
          {/* Home Club */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={homeTeam.logo}
              alt={homeTeam.name}
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t43.png'; }}
            />
            <div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800 }}>{homeTeam.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {homeTeam.stadium}</p>
            </div>
          </div>

          {/* Central Live Score Box */}
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: matchState === 'RUNNING' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${matchState === 'RUNNING' ? '#ef4444' : 'var(--border-subtle)'}`,
                padding: '0.25rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: matchState === 'RUNNING' ? '#f87171' : 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              {matchState === 'RUNNING' && <span className="ticker-pulse" style={{ background: '#ef4444' }}></span>}
              {matchState === 'IDLE' && 'READY FOR KICK-OFF'}
              {matchState === 'RUNNING' && `LIVE ${minute}'`}
              {matchState === 'PAUSED' && `PAUSED ${minute}'`}
              {matchState === 'FINISHED' && 'FULL TIME'}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 800, color: 'white', letterSpacing: '4px', lineHeight: 1 }}>
              {homeScore} : {awayScore}
            </div>
          </div>

          {/* Away Club */}
          <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
            <img
              src={awayTeam.logo}
              alt={awayTeam.name}
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/badges/50/t3.png'; }}
            />
            <div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800 }}>{awayTeam.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Away Supporters</p>
            </div>
          </div>
        </div>

        {/* Save Match Button (When Finished) */}
        {matchState === 'FINISHED' && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Match complete! Would you like to record this result into your MySQL database?
            </span>
            <button
              className="btn-record"
              onClick={handleSaveToDatabase}
              disabled={savedToDb || isSaving}
            >
              <CheckCircle2 size={16} />
              {savedToDb ? 'Saved to MySQL & Standings Updated!' : isSaving ? 'Saving...' : 'Save to MySQL & Update Standings'}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Animated Pitch & Live Commentary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Visual Pitch & Live In-Match Stats */}
        <div>
          {/* Animated 2D Pitch Widget */}
          <div
            style={{
              background: 'radial-gradient(ellipse at center, #0f5132 0%, #063520 100%)',
              border: '3px solid rgba(255,255,255,0.2)',
              borderRadius: '14px',
              padding: '1.5rem',
              position: 'relative',
              height: '240px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Center Line and Circle */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(255,255,255,0.25)' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90px', height: '90px', border: '2px solid rgba(255,255,255,0.25)', borderRadius: '50%' }}></div>

            {/* Penalty boxes */}
            <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '50px', border: '2px solid rgba(255,255,255,0.25)', borderLeft: 'none' }}></div>
            <div style={{ position: 'absolute', right: 0, top: '25%', bottom: '25%', width: '50px', border: '2px solid rgba(255,255,255,0.25)', borderRight: 'none' }}></div>

            {/* Team Badges on Pitch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10, opacity: 0.8 }}>
              <span style={{ fontWeight: 800, color: 'white', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                {homeTeam.short_name}
              </span>
              <span style={{ fontWeight: 800, color: 'white', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                {awayTeam.short_name}
              </span>
            </div>

            {/* Animated Ball Indicator */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left:
                  ballZone === 'home_box' ? '8%' :
                  ballZone === 'home_half' ? '28%' :
                  ballZone === 'midfield' ? '50%' :
                  ballZone === 'away_half' ? '72%' : '92%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.9), 0 0 30px rgba(16, 185, 129, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                }}
              >
                ⚽
              </div>
              <span style={{ fontSize: '0.68rem', color: '#6ee7b7', fontWeight: 800, background: 'rgba(0,0,0,0.7)', padding: '0.1rem 0.4rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                {ballZone === 'home_box' ? `${homeTeam.short_name} Box` :
                 ballZone === 'home_half' ? `${homeTeam.short_name} Half` :
                 ballZone === 'midfield' ? 'Midfield Battle' :
                 ballZone === 'away_half' ? `${awayTeam.short_name} Half` : `${awayTeam.short_name} Box`}
              </span>
            </div>

            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {homeTeam.stadium} Pitch
              </span>
            </div>
          </div>

          {/* Live In-Match Statistics Box */}
          <div className="table-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} color="#10b981" />
              Live In-Match Head-to-Head Statistics
            </h4>

            {/* Possession */}
            <div className="stat-row">
              <div className="stat-header">
                <span style={{ fontWeight: 700 }}>{stats.homePossession}%</span>
                <span style={{ color: 'var(--text-muted)' }}>Possession</span>
                <span style={{ fontWeight: 700 }}>{stats.awayPossession}%</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${stats.homePossession}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${stats.awayPossession}%` }}></div>
              </div>
            </div>

            {/* Total Shots */}
            <div className="stat-row">
              <div className="stat-header">
                <span style={{ fontWeight: 700 }}>{stats.homeShots}</span>
                <span style={{ color: 'var(--text-muted)' }}>Total Shots</span>
                <span style={{ fontWeight: 700 }}>{stats.awayShots}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${((stats.homeShots / ((stats.homeShots + stats.awayShots) || 1)) * 100)}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${((stats.awayShots / ((stats.homeShots + stats.awayShots) || 1)) * 100)}%` }}></div>
              </div>
            </div>

            {/* Shots on Target */}
            <div className="stat-row">
              <div className="stat-header">
                <span style={{ fontWeight: 700 }}>{stats.homeOnTarget}</span>
                <span style={{ color: 'var(--text-muted)' }}>Shots On Target</span>
                <span style={{ fontWeight: 700 }}>{stats.awayOnTarget}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${((stats.homeOnTarget / ((stats.homeOnTarget + stats.awayOnTarget) || 1)) * 100)}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${((stats.awayOnTarget / ((stats.homeOnTarget + stats.awayOnTarget) || 1)) * 100)}%` }}></div>
              </div>
            </div>

            {/* Corners */}
            <div className="stat-row">
              <div className="stat-header">
                <span style={{ fontWeight: 700 }}>{stats.homeCorners}</span>
                <span style={{ color: 'var(--text-muted)' }}>Corners</span>
                <span style={{ fontWeight: 700 }}>{stats.awayCorners}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${((stats.homeCorners / ((stats.homeCorners + stats.awayCorners) || 1)) * 100)}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${((stats.awayCorners / ((stats.homeCorners + stats.awayCorners) || 1)) * 100)}%` }}></div>
              </div>
            </div>

            {/* Fouls */}
            <div className="stat-row" style={{ marginBottom: 0 }}>
              <div className="stat-header">
                <span style={{ fontWeight: 700 }}>{stats.homeFouls}</span>
                <span style={{ color: 'var(--text-muted)' }}>Fouls Committed</span>
                <span style={{ fontWeight: 700 }}>{stats.awayFouls}</span>
              </div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${((stats.homeFouls / ((stats.homeFouls + stats.awayFouls) || 1)) * 100)}%` }}></div>
                <div className="stat-bar-away" style={{ width: `${((stats.awayFouls / ((stats.homeFouls + stats.awayFouls) || 1)) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Commentary Stream */}
        <div className="table-card" style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
          <div className="table-toolbar" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <Volume2 size={16} color="#10b981" />
              Live Match Commentary
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              {commentary.length} updates
            </span>
          </div>

          <div
            style={{
              padding: '1.25rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {commentary.map((c) => {
              let badgeColor = 'rgba(255,255,255,0.06)';
              let textColor = 'var(--text-main)';
              let borderStyle = '1px solid var(--border-subtle)';

              if (c.type === 'goal') {
                badgeColor = 'rgba(16, 185, 129, 0.2)';
                textColor = '#6ee7b7';
                borderStyle = '1px solid #10b981';
              } else if (c.type === 'highlight') {
                badgeColor = 'rgba(59, 130, 246, 0.15)';
                textColor = '#93c5fd';
                borderStyle = '1px solid #3b82f6';
              } else if (c.type === 'card') {
                badgeColor = 'rgba(245, 158, 11, 0.15)';
                textColor = '#fde68a';
              }

              return (
                <div
                  key={c.id}
                  style={{
                    background: badgeColor,
                    border: borderStyle,
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: 'var(--accent-green)',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      flexShrink: 0,
                    }}
                  >
                    {c.min}'
                  </span>
                  <span style={{ color: textColor, lineHeight: 1.4, flex: 1 }}>{c.text}</span>
                </div>
              );
            })}

            {commentary.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                Click <strong>"Kick Off"</strong> to begin live match commentary!
              </div>
            )}
            <div ref={feedEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
