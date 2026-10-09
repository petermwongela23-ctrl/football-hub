import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import StandingsView from './components/StandingsView';
import ResultsView from './components/ResultsView';
import FixturesView from './components/FixturesView';
import TeamsView from './components/TeamsView';
import ScorersView from './components/ScorersView';
import GalleryView from './components/GalleryView';
import SimulatorView from './components/SimulatorView';
import MatchModal from './components/MatchModal';
import TeamModal from './components/TeamModal';
import AddMatchModal from './components/AddMatchModal';
import DbModal from './components/DbModal';
import UploadPhotoModal from './components/UploadPhotoModal';
import PhotoModal from './components/PhotoModal';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [standings, setStandings] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);

  // Modal States
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [fixtureToRecord, setFixtureToRecord] = useState(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Status & Notification
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchAllData = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const [standingsRes, resultsRes, fixturesRes, teamsRes, scorersRes, photosRes, statusRes] = await Promise.all([
        fetch('/api/standings').then((r) => r.json()),
        fetch('/api/results').then((r) => r.json()),
        fetch('/api/fixtures').then((r) => r.json()),
        fetch('/api/teams').then((r) => r.json()),
        fetch('/api/stats/top-scorers').then((r) => r.json()),
        fetch('/api/photos').then((r) => r.json()),
        fetch('/api/db/status').then((r) => r.json()),
      ]);

      if (Array.isArray(standingsRes)) setStandings(standingsRes);
      if (Array.isArray(resultsRes)) setPastResults(resultsRes);
      if (Array.isArray(fixturesRes)) setFixtures(fixturesRes);
      if (Array.isArray(teamsRes)) setTeams(teamsRes);
      if (Array.isArray(scorersRes)) setTopScorers(scorersRes);
      if (Array.isArray(photosRes)) setPhotos(photosRes);
      if (statusRes) setDbStatus(statusRes);
    } catch (err) {
      console.error('Error loading football data:', err);
      showToast('⚠️ Could not connect to API backend. Please ensure the Go server is running.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRecordFixtureScore = (fixture) => {
    setFixtureToRecord(fixture);
    setIsAddMatchOpen(true);
  };

  const handleMatchCreated = (msg) => {
    showToast(msg || 'Match recorded successfully!');
    fetchAllData(true);
  };

  const handlePhotoUploaded = (msg) => {
    showToast(msg || 'Picture added successfully!');
    fetchAllData(true);
  };

  const handleLikePhoto = async (photoId) => {
    try {
      const res = await fetch(`/api/photos/${photoId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, likes: data.likes } : p))
        );
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto((prev) => ({ ...prev, likes: data.likes }));
        }
      }
    } catch (err) {
      console.error('Error liking photo:', err);
    }
  };

  const handleDbUpdated = (newStatus) => {
    setDbStatus(newStatus);
    showToast(`✅ Database updated: Connected to ${newStatus.database}`);
    fetchAllData(true);
  };

  return (
    <div className="app-container">
      {/* Toast alert */}
      {toastMessage && <div className="toast-notice">{toastMessage}</div>}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddMatch={() => {
          setFixtureToRecord(null);
          setIsAddMatchOpen(true);
        }}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        dbStatus={dbStatus}
        onRefresh={() => fetchAllData(true)}
        isRefreshing={isRefreshing}
        pastMatches={pastResults}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚽</div>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Loading Premier League Data...</h3>
            <p>Fetching clubs, past results, and live standings</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                standings={standings}
                pastResults={pastResults}
                fixtures={fixtures}
                topScorers={topScorers}
                onSelectMatch={(m) => setSelectedMatch(m)}
                onSelectTeam={(id) => setSelectedTeamId(id)}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'standings' && (
              <StandingsView
                standings={standings}
                onSelectTeam={(id) => setSelectedTeamId(id)}
              />
            )}

            {activeTab === 'results' && (
              <ResultsView
                pastResults={pastResults}
                teams={teams}
                onSelectMatch={(m) => setSelectedMatch(m)}
              />
            )}

            {activeTab === 'fixtures' && (
              <FixturesView
                fixtures={fixtures}
                onRecordFixtureScore={handleRecordFixtureScore}
              />
            )}

            {activeTab === 'teams' && (
              <TeamsView
                teams={teams}
                onSelectTeam={(id) => setSelectedTeamId(id)}
              />
            )}

            {activeTab === 'scorers' && (
              <ScorersView topScorers={topScorers} />
            )}

            {activeTab === 'gallery' && (
              <GalleryView
                photos={photos}
                onOpenUpload={() => setIsUploadPhotoOpen(true)}
                onSelectPhoto={(ph) => setSelectedPhoto(ph)}
                onLikePhoto={handleLikePhoto}
              />
            )}

            {activeTab === 'simulator' && (
              <SimulatorView
                teams={teams}
                fixtures={fixtures}
                onMatchSaved={(msg) => {
                  showToast(msg);
                  fetchAllData(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {selectedTeamId && (
        <TeamModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onLike={handleLikePhoto}
        />
      )}

      {isAddMatchOpen && (
        <AddMatchModal
          teams={teams}
          initialFixture={fixtureToRecord}
          onClose={() => {
            setIsAddMatchOpen(false);
            setFixtureToRecord(null);
          }}
          onMatchCreated={handleMatchCreated}
        />
      )}

      {isUploadPhotoOpen && (
        <UploadPhotoModal
          onClose={() => setIsUploadPhotoOpen(false)}
          onPhotoUploaded={handlePhotoUploaded}
        />
      )}

      {isDbModalOpen && (
        <DbModal
          dbStatus={dbStatus}
          onClose={() => setIsDbModalOpen(false)}
          onDbUpdated={handleDbUpdated}
        />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: '#090d15', padding: '2rem 1.25rem', marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: 'white' }}>PITCHPULSE</span> • Premier Football Hub
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
            <span onClick={() => setActiveTab('standings')} style={{ cursor: 'pointer', color: 'var(--accent-green)' }}>Standings (1st-Last)</span>
            <span onClick={() => setActiveTab('results')} style={{ cursor: 'pointer' }}>Past Results</span>
            <span onClick={() => setActiveTab('fixtures')} style={{ cursor: 'pointer' }}>Fixtures</span>
            <span onClick={() => setActiveTab('gallery')} style={{ cursor: 'pointer' }}>Photo Gallery</span>
            <span onClick={() => setIsDbModalOpen(true)} style={{ cursor: 'pointer' }}>MySQL Database</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Powered by React, Go (Golang) & MySQL Server
          </div>
        </div>
      </footer>
    </div>
  );
}
