package handlers

import (
	"encoding/json"
	"football-backend/db"
	"football-backend/models"
	"net/http"
	"strconv"
	"strings"
)

func JSONResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func JSONError(w http.ResponseWriter, status int, message string) {
	JSONResponse(w, status, map[string]string{"error": message})
}

// GET /api/standings
func GetStandingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	standings := db.GlobalStore.GetStandings()
	JSONResponse(w, http.StatusOK, standings)
}

// GET /api/results?round=X&team_id=Y&q=Z
func GetResultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	q := r.URL.Query()
	round, _ := strconv.Atoi(q.Get("round"))
	teamID, _ := strconv.Atoi(q.Get("team_id"))
	searchQuery := q.Get("q")

	results := db.GlobalStore.GetPastResults(round, teamID, searchQuery)
	JSONResponse(w, http.StatusOK, results)
}

// GET /api/fixtures
func GetFixturesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	fixtures := db.GlobalStore.GetUpcomingFixtures()
	JSONResponse(w, http.StatusOK, fixtures)
}

// GET /api/matches/{id}
func GetMatchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 3 {
		JSONError(w, http.StatusBadRequest, "Invalid match ID")
		return
	}
	id, err := strconv.Atoi(parts[2])
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid match ID")
		return
	}

	match, ok := db.GlobalStore.GetMatchByID(id)
	if !ok {
		JSONError(w, http.StatusNotFound, "Match not found")
		return
	}
	JSONResponse(w, http.StatusOK, match)
}

// GET /api/teams
// GET /api/teams/{id}
func TeamsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) == 2 {
		teams := db.GlobalStore.GetAllTeams()
		JSONResponse(w, http.StatusOK, teams)
		return
	}

	id, err := strconv.Atoi(parts[2])
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid team ID")
		return
	}

	team, squad, ok := db.GlobalStore.GetTeamByID(id)
	if !ok {
		JSONError(w, http.StatusNotFound, "Team not found")
		return
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"team":  team,
		"squad": squad,
	})
}

// GET /api/stats/top-scorers
func GetTopScorersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	scorers := db.GlobalStore.GetTopScorers()
	JSONResponse(w, http.StatusOK, scorers)
}

// POST /api/matches
func CreateMatchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var req models.CreateMatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid JSON payload: "+err.Error())
		return
	}

	match, err := db.GlobalStore.CreateMatch(req)
	if err != nil {
		JSONError(w, http.StatusBadRequest, err.Error())
		return
	}

	JSONResponse(w, http.StatusCreated, match)
}

// GET /api/db/status
func GetDBStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	status := db.GlobalStore.GetDBStatus()
	JSONResponse(w, http.StatusOK, status)
}

// POST /api/db/connect
func ConnectDBHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var req models.DBConfigRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Host == "" {
		req.Host = "localhost"
	}
	if req.Port == 0 {
		req.Port = 3306
	}
	if req.User == "" {
		req.User = "root"
	}
	if req.Database == "" {
		req.Database = "footballdb"
	}

	err := db.GlobalStore.TryConnectMySQL(req.Host, req.Port, req.User, req.Password, req.Database)
	if err != nil {
		JSONResponse(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"error":   err.Error(),
			"status":  db.GlobalStore.GetDBStatus(),
		})
		return
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Successfully connected to MySQL database: " + req.Database,
		"status":  db.GlobalStore.GetDBStatus(),
	})
}

// GET /api/photos?category=X
// POST /api/photos
func PhotosHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		category := r.URL.Query().Get("category")
		photos := db.GlobalStore.GetPhotos(category)
		JSONResponse(w, http.StatusOK, photos)
	case http.MethodPost:
		var req models.CreatePhotoRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}
		photo, err := db.GlobalStore.AddPhoto(req)
		if err != nil {
			JSONError(w, http.StatusBadRequest, err.Error())
			return
		}
		JSONResponse(w, http.StatusCreated, photo)
	default:
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// POST /api/photos/{id}/like
func LikePhotoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 3 {
		JSONError(w, http.StatusBadRequest, "Invalid photo ID")
		return
	}
	id, err := strconv.Atoi(parts[2])
	if err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid photo ID")
		return
	}

	likes, ok := db.GlobalStore.LikePhoto(id)
	if !ok {
		JSONError(w, http.StatusNotFound, "Photo not found")
		return
	}

	JSONResponse(w, http.StatusOK, map[string]interface{}{
		"id":    id,
		"likes": likes,
	})
}
