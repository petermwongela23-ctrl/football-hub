package handlers_test

import (
	"bytes"
	"encoding/json"
	"football-backend/db"
	"football-backend/handlers"
	"football-backend/models"
	"net/http"
	"net/http/httptest"
	"testing"
)

func init() {
	// Initialize in-memory store for tests
	db.InitStore("", 0, "", "", "")
}

func TestStandings(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/standings", nil)
	w := httptest.NewRecorder()

	handlers.GetStandingsHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}

	var standings []models.Standing
	if err := json.Unmarshal(w.Body.Bytes(), &standings); err != nil {
		t.Fatalf("Failed to parse standings: %v", err)
	}

	if len(standings) != 20 {
		t.Errorf("Expected 20 teams in standings (1st to last), got %d", len(standings))
	}

	// Verify position 1 is 1, position 2 is 2, etc.
	for i, s := range standings {
		if s.Position != i+1 {
			t.Errorf("Expected team %s at position %d, got %d", s.TeamName, i+1, s.Position)
		}
	}

	// Verify points order (1st team points >= last team points)
	if standings[0].Points < standings[len(standings)-1].Points {
		t.Errorf("1st place points (%d) should be >= last place points (%d)", standings[0].Points, standings[len(standings)-1].Points)
	}
}

func TestPastResults(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/results?round=1", nil)
	w := httptest.NewRecorder()

	handlers.GetResultsHandler(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status 200, got %d", w.Code)
	}

	var results []models.Match
	if err := json.Unmarshal(w.Body.Bytes(), &results); err != nil {
		t.Fatalf("Failed to parse results: %v", err)
	}

	if len(results) == 0 {
		t.Fatalf("Expected past results for round 1, got 0")
	}

	for _, m := range results {
		if m.Status != "FINISHED" {
			t.Errorf("Expected match to be FINISHED, got %s", m.Status)
		}
		if m.HomeScore == nil || m.AwayScore == nil {
			t.Errorf("Expected scores to be present for past match id %d", m.ID)
		}
	}
}

func TestCreateMatch(t *testing.T) {
	payload := models.CreateMatchRequest{
		Round:      5,
		HomeTeamID: 1, // Man City
		AwayTeamID: 3, // Liverpool
		HomeScore:  3,
		AwayScore:  1,
		MatchDate:  "2026-09-23 18:00",
		Venue:      "Etihad Stadium",
	}

	body, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/api/matches", bytes.NewReader(body))
	w := httptest.NewRecorder()

	handlers.CreateMatchHandler(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected status 201, got %d: %s", w.Code, w.Body.String())
	}
}
