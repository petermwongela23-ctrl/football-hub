import React from 'react';
import { Trophy, Calendar, History, Shield, Flame, PlusCircle, Database, RefreshCw, Camera, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddMatch, onOpenDbModal, dbStatus, onRefresh, isRefreshing, pastMatches }) {
  // Recent 6 matches for ticker
  const tickerMatches = pastMatches ? pastMatches.slice(0, 6) : [];

  return (
    <header className="navbar-wrapper">
      {/* Live Match Ticker */}
      <div className="ticker-container">
        <div className="ticker-label">
          <span className="ticker-pulse"></span>
          LATEST SCORES
        </div>
        <div className="ticker-items">
          {tickerMatches.map((m) => (
            <div key={m.id} className="ticker-card" onClick={() => setActiveTab('results')}>
              <span>{m.home_team.short_name}</span>
              <span className="ticker-score">{m.home_score} - {m.away_score}</span>
              <span>{m.away_team.short_name}</span>
            </div>
          ))}
          {tickerMatches.length === 0 && (
            <span style={{ color: 'var(--text-subtle)' }}>Loading scores ticker...</span>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => setActiveTab('home')}>
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div className="brand-text">
              <h1>PITCHPULSE</h1>
              <span>PREMIER FOOTBALL HUB</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="nav-links">
            <button
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Overview
            </button>
            <button
              className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              <Trophy size={16} />
              Standings (1st-Last)
            </button>
            <button
              className={`nav-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <History size={16} />
              Past Results
            </button>
            <button
              className={`nav-btn ${activeTab === 'fixtures' ? 'active' : ''}`}
              onClick={() => setActiveTab('fixtures')}
            >
              <Calendar size={16} />
              Fixtures
            </button>
            <button
              className={`nav-btn ${activeTab === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              <Shield size={16} />
              Clubs
            </button>
            <button
              className={`nav-btn ${activeTab === 'scorers' ? 'active' : ''}`}
              onClick={() => setActiveTab('scorers')}
            >
              <Flame size={16} />
              Top Scorers
            </button>
            <button
              className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <Camera size={16} />
              Gallery
            </button>
            <button
              className={`nav-btn ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulator')}
              style={{
                color: activeTab === 'simulator' ? '#042f22' : '#38bdf8',
                borderColor: activeTab === 'simulator' ? 'transparent' : 'rgba(56, 189, 248, 0.3)',
              }}
            >
              <Zap size={16} color={activeTab === 'simulator' ? '#042f22' : '#38bdf8'} />
              Simulator
            </button>
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            <button
              className="db-pill"
              onClick={onOpenDbModal}
              title={dbStatus?.connected ? `Connected to MySQL (${dbStatus.database})` : 'Click to configure MySQL connection'}
            >
              <span className={`db-dot ${dbStatus?.connected ? 'connected' : 'memory'}`}></span>
              <Database size={14} />
              <span>{dbStatus?.connected ? 'MySQL Active' : 'DB Settings'}</span>
            </button>

            <button
              className="btn-secondary"
              onClick={onRefresh}
              title="Refresh all data"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            </button>

            <button className="btn-record" onClick={onOpenAddMatch}>
              <PlusCircle size={16} />
              Record Match
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
