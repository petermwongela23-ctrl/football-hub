package db

import (
	"database/sql"
	"fmt"
	"football-backend/models"
	"sort"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Store struct {
	mu          sync.RWMutex
	db          *sql.DB
	isMySQL     bool
	dbStatus    models.DBStatus
	teams       []models.Team
	matches     []models.Match
	players     []models.Player
	photos      []models.Photo
	nextMatchID int
	nextPhotoID int
}

var GlobalStore *Store

func InitStore(host string, port int, user, password, dbName string) *Store {
	store := &Store{
		teams:       SeedTeams,
		matches:     GenerateSeedMatches(),
		players:     SeedPlayers,
		photos:      SeedPhotos,
		nextMatchID: 50,
		nextPhotoID: 20,
		dbStatus: models.DBStatus{
			Connected: false,
			Host:      host,
			Port:      port,
			User:      user,
			Database:  dbName,
			Message:   "Running with standard memory data engine. Connect to MySQL anytime.",
			Source:    "memory",
		},
	}
	GlobalStore = store

	// Try initial MySQL connection
	if host != "" {
		_ = store.TryConnectMySQL(host, port, user, password, dbName)
	}

	return store
}

func (s *Store) GetDBStatus() models.DBStatus {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.dbStatus
}

func (s *Store) TryConnectMySQL(host string, port int, user, password, dbName string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. First connect without db name to ensure DB exists
	dsnServer := fmt.Sprintf("%s:%s@tcp(%s:%d)/?parseTime=true", user, password, host, port)
	dbServer, err := sql.Open("mysql", dsnServer)
	if err != nil {
		s.isMySQL = false
		s.dbStatus = models.DBStatus{
			Connected: false,
			Host:      host,
			Port:      port,
			User:      user,
			Database:  dbName,
			Message:   fmt.Sprintf("Failed to open connection: %v", err),
			Source:    "memory",
		}
		return err
	}
	defer dbServer.Close()

	if err := dbServer.Ping(); err != nil {
		s.isMySQL = false
		s.dbStatus = models.DBStatus{
			Connected: false,
			Host:      host,
			Port:      port,
			User:      user,
			Database:  dbName,
			Message:   fmt.Sprintf("MySQL access denied or unreachable: %v", err),
			Source:    "memory",
		}
		return err
	}

	// Create database if not exists
	_, err = dbServer.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", dbName))
	if err != nil {
		return err
	}

	// 2. Connect directly to database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true", user, password, host, port, dbName)
	mysqlDB, err := sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	if err := mysqlDB.Ping(); err != nil {
		return err
	}

	// 3. Initialize schema & seed
	if err := s.initMySQLTables(mysqlDB); err != nil {
		mysqlDB.Close()
		return err
	}

	if s.db != nil {
		s.db.Close()
	}
	s.db = mysqlDB
	s.isMySQL = true
	s.dbStatus = models.DBStatus{
		Connected: true,
		Host:      host,
		Port:      port,
		User:      user,
		Database:  dbName,
		Message:   "Successfully connected to MySQL database: " + dbName,
		Source:    "mysql",
	}

	return nil
}

func (s *Store) initMySQLTables(db *sql.DB) error {
	schemaQueries := []string{
		`CREATE TABLE IF NOT EXISTS teams (
			id INT PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			short_name VARCHAR(50) NOT NULL,
			code VARCHAR(10) NOT NULL,
			logo VARCHAR(255) NOT NULL,
			stadium VARCHAR(100) NOT NULL,
			city VARCHAR(50) NOT NULL,
			founded INT NOT NULL,
			manager VARCHAR(100) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		`CREATE TABLE IF NOT EXISTS matches (
			id INT PRIMARY KEY AUTO_INCREMENT,
			round INT NOT NULL,
			home_team_id INT NOT NULL,
			away_team_id INT NOT NULL,
			home_score INT NULL,
			away_score INT NULL,
			status VARCHAR(20) NOT NULL,
			match_date DATETIME NOT NULL,
			venue VARCHAR(100) NOT NULL,
			INDEX idx_round (round),
			INDEX idx_status (status)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		`CREATE TABLE IF NOT EXISTS match_events (
			id INT PRIMARY KEY AUTO_INCREMENT,
			match_id INT NOT NULL,
			team_id INT NOT NULL,
			team_code VARCHAR(10) NOT NULL,
			player_name VARCHAR(100) NOT NULL,
			minute INT NOT NULL,
			event_type VARCHAR(30) NOT NULL,
			INDEX idx_match (match_id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		`CREATE TABLE IF NOT EXISTS players (
			id INT PRIMARY KEY AUTO_INCREMENT,
			team_id INT NOT NULL,
			team_name VARCHAR(100) NOT NULL,
			team_code VARCHAR(10) NOT NULL,
			name VARCHAR(100) NOT NULL,
			position VARCHAR(10) NOT NULL,
			shirt_number INT NOT NULL,
			nationality VARCHAR(50) NOT NULL,
			goals INT DEFAULT 0,
			assists INT DEFAULT 0,
			yellow_cards INT DEFAULT 0,
			red_cards INT DEFAULT 0,
			photo VARCHAR(255) NOT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

		`CREATE TABLE IF NOT EXISTS photos (
			id INT PRIMARY KEY AUTO_INCREMENT,
			title VARCHAR(150) NOT NULL,
			category VARCHAR(50) NOT NULL,
			image_url LONGTEXT NOT NULL,
			description TEXT,
			uploader_name VARCHAR(100),
			created_at DATETIME,
			likes INT DEFAULT 0
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
	}

	for _, q := range schemaQueries {
		if _, err := db.Exec(q); err != nil {
			return err
		}
	}

	// Check if teams already seeded
	var count int
	_ = db.QueryRow("SELECT COUNT(*) FROM teams").Scan(&count)
	if count == 0 {
		for _, t := range SeedTeams {
			_, _ = db.Exec(`INSERT INTO teams (id, name, short_name, code, logo, stadium, city, founded, manager) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				t.ID, t.Name, t.ShortName, t.Code, t.Logo, t.Stadium, t.City, t.Founded, t.Manager)
		}
		for _, m := range GenerateSeedMatches() {
			_, _ = db.Exec(`INSERT INTO matches (id, round, home_team_id, away_team_id, home_score, away_score, status, match_date, venue)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				m.ID, m.Round, m.HomeTeamID, m.AwayTeamID, m.HomeScore, m.AwayScore, m.Status, m.MatchDate, m.Venue)

			for _, e := range m.Events {
				_, _ = db.Exec(`INSERT INTO match_events (id, match_id, team_id, team_code, player_name, minute, event_type)
					VALUES (?, ?, ?, ?, ?, ?, ?)`,
					e.ID, e.MatchID, e.TeamID, e.TeamCode, e.PlayerName, e.Minute, e.EventType)
			}
		}
		for _, p := range SeedPlayers {
			_, _ = db.Exec(`INSERT INTO players (id, team_id, team_name, team_code, name, position, shirt_number, nationality, goals, assists, yellow_cards, red_cards, photo)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				p.ID, p.TeamID, p.TeamName, p.TeamCode, p.Name, p.Position, p.Number, p.Nationality, p.Goals, p.Assists, p.YellowCards, p.RedCards, p.Photo)
		}
		for _, ph := range SeedPhotos {
			_, _ = db.Exec(`INSERT INTO photos (id, title, category, image_url, description, uploader_name, created_at, likes)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				ph.ID, ph.Title, ph.Category, ph.ImageURL, ph.Description, ph.UploaderName, ph.CreatedAt, ph.Likes)
		}
	}

	return nil
}

func (s *Store) GetAllTeams() []models.Team {
	s.mu.RLock()
	defer s.mu.RUnlock()

	res := make([]models.Team, len(s.teams))
	copy(res, s.teams)
	return res
}

func (s *Store) GetTeamByID(id int) (models.Team, []models.Player, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var targetTeam models.Team
	found := false
	for _, t := range s.teams {
		if t.ID == id {
			targetTeam = t
			found = true
			break
		}
	}
	if !found {
		return models.Team{}, nil, false
	}

	var teamPlayers []models.Player
	for _, p := range s.players {
		if p.TeamID == id {
			teamPlayers = append(teamPlayers, p)
		}
	}

	return targetTeam, teamPlayers, true
}

func (s *Store) GetStandings() []models.Standing {
	s.mu.RLock()
	defer s.mu.RUnlock()

	type stats struct {
		team     models.Team
		played   int
		won      int
		drawn    int
		lost     int
		gf       int
		ga       int
		points   int
		formList []string
	}

	mStats := make(map[int]*stats)
	for _, t := range s.teams {
		mStats[t.ID] = &stats{team: t, formList: []string{}}
	}

	// Sort matches by date to ensure accurate recent form
	sortedMatches := make([]models.Match, len(s.matches))
	copy(sortedMatches, s.matches)
	sort.Slice(sortedMatches, func(i, j int) bool {
		return sortedMatches[i].MatchDate.Before(sortedMatches[j].MatchDate)
	})

	for _, m := range sortedMatches {
		if m.Status != "FINISHED" || m.HomeScore == nil || m.AwayScore == nil {
			continue
		}

		hStat, hOk := mStats[m.HomeTeamID]
		aStat, aOk := mStats[m.AwayTeamID]
		if !hOk || !aOk {
			continue
		}

		hStat.played++
		aStat.played++
		hStat.gf += *m.HomeScore
		hStat.ga += *m.AwayScore
		aStat.gf += *m.AwayScore
		aStat.ga += *m.HomeScore

		if *m.HomeScore > *m.AwayScore {
			hStat.won++
			hStat.points += 3
			aStat.lost++
			hStat.formList = append(hStat.formList, "W")
			aStat.formList = append(aStat.formList, "L")
		} else if *m.HomeScore < *m.AwayScore {
			aStat.won++
			aStat.points += 3
			hStat.lost++
			hStat.formList = append(hStat.formList, "L")
			aStat.formList = append(aStat.formList, "W")
		} else {
			hStat.drawn++
			hStat.points += 1
			aStat.drawn++
			aStat.points += 1
			hStat.formList = append(hStat.formList, "D")
			aStat.formList = append(aStat.formList, "D")
		}
	}

	var list []*stats
	for _, v := range mStats {
		list = append(list, v)
	}

	// Sort from 1st to Last (Rank 1 to 20): Points > GD > GF > Name
	sort.Slice(list, func(i, j int) bool {
		gdI := list[i].gf - list[i].ga
		gdJ := list[j].gf - list[j].ga

		if list[i].points != list[j].points {
			return list[i].points > list[j].points
		}
		if gdI != gdJ {
			return gdI > gdJ
		}
		if list[i].gf != list[j].gf {
			return list[i].gf > list[j].gf
		}
		return list[i].team.Name < list[j].team.Name
	})

	standings := make([]models.Standing, len(list))
	for idx, item := range list {
		// Last 5 matches for form
		lastFive := item.formList
		if len(lastFive) > 5 {
			lastFive = lastFive[len(lastFive)-5:]
		}

		standings[idx] = models.Standing{
			Position:       idx + 1, // 1st to last
			TeamID:         item.team.ID,
			TeamName:       item.team.Name,
			TeamCode:       item.team.Code,
			TeamLogo:       item.team.Logo,
			Played:         item.played,
			Won:            item.won,
			Drawn:          item.drawn,
			Lost:           item.lost,
			GoalsFor:       item.gf,
			GoalsAgainst:   item.ga,
			GoalDifference: item.gf - item.ga,
			Points:         item.points,
			Form:           lastFive,
		}
	}

	return standings
}

func (s *Store) GetPastResults(round int, teamID int, query string) []models.Match {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []models.Match
	qLower := strings.ToLower(strings.TrimSpace(query))

	for _, m := range s.matches {
		if m.Status != "FINISHED" {
			continue
		}
		if round > 0 && m.Round != round {
			continue
		}
		if teamID > 0 && m.HomeTeamID != teamID && m.AwayTeamID != teamID {
			continue
		}
		if qLower != "" {
			matchText := strings.ToLower(fmt.Sprintf("%s %s %s %s %s", m.HomeTeam.Name, m.AwayTeam.Name, m.HomeTeam.Code, m.AwayTeam.Code, m.Venue))
			foundScorer := false
			for _, ev := range m.Events {
				if strings.Contains(strings.ToLower(ev.PlayerName), qLower) {
					foundScorer = true
					break
				}
			}
			if !strings.Contains(matchText, qLower) && !foundScorer {
				continue
			}
		}

		results = append(results, m)
	}

	// Sort by Match Date descending (newest first)
	sort.Slice(results, func(i, j int) bool {
		return results[i].MatchDate.After(results[j].MatchDate)
	})

	return results
}

func (s *Store) GetUpcomingFixtures() []models.Match {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var fixtures []models.Match
	for _, m := range s.matches {
		if m.Status == "SCHEDULED" {
			fixtures = append(fixtures, m)
		}
	}

	sort.Slice(fixtures, func(i, j int) bool {
		return fixtures[i].MatchDate.Before(fixtures[j].MatchDate)
	})

	return fixtures
}

func (s *Store) GetMatchByID(id int) (models.Match, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, m := range s.matches {
		if m.ID == id {
			return m, true
		}
	}
	return models.Match{}, false
}

func (s *Store) GetTopScorers() []models.Player {
	s.mu.RLock()
	defer s.mu.RUnlock()

	scorers := make([]models.Player, len(s.players))
	copy(scorers, s.players)

	sort.Slice(scorers, func(i, j int) bool {
		if scorers[i].Goals != scorers[j].Goals {
			return scorers[i].Goals > scorers[j].Goals
		}
		return scorers[i].Assists > scorers[j].Assists
	})

	return scorers
}

func (s *Store) CreateMatch(req models.CreateMatchRequest) (models.Match, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	homeTeam := getTeamByID(req.HomeTeamID)
	awayTeam := getTeamByID(req.AwayTeamID)
	if homeTeam.ID == 0 || awayTeam.ID == 0 {
		return models.Match{}, fmt.Errorf("invalid home or away team id")
	}

	matchTime := time.Now()
	if req.MatchDate != "" {
		if t, err := time.Parse("2006-01-02 15:04", req.MatchDate); err == nil {
			matchTime = t
		} else if t, err := time.Parse("2006-01-02", req.MatchDate); err == nil {
			matchTime = t
		}
	}

	venue := req.Venue
	if venue == "" {
		venue = homeTeam.Stadium
	}

	s.nextMatchID++
	newMatch := models.Match{
		ID:         s.nextMatchID,
		Round:      req.Round,
		HomeTeamID: req.HomeTeamID,
		AwayTeamID: req.AwayTeamID,
		HomeTeam:   homeTeam,
		AwayTeam:   awayTeam,
		HomeScore:  &req.HomeScore,
		AwayScore:  &req.AwayScore,
		Status:     "FINISHED",
		MatchDate:  matchTime,
		Venue:      venue,
		Stats: &models.MatchStats{
			HomePossession:    50,
			AwayPossession:    50,
			HomeShots:         req.HomeScore*3 + 4,
			AwayShots:         req.AwayScore*3 + 3,
			HomeShotsOnTarget: req.HomeScore + 2,
			AwayShotsOnTarget: req.AwayScore + 2,
			HomeCorners:       5,
			AwayCorners:       4,
			HomeFouls:         10,
			AwayFouls:         11,
		},
	}

	for idx, sc := range req.Scorers {
		evType := sc.EventType
		if evType == "" {
			evType = "GOAL"
		}
		code := homeTeam.Code
		if sc.TeamID == awayTeam.ID {
			code = awayTeam.Code
		}
		newMatch.Events = append(newMatch.Events, models.MatchEvent{
			ID:         newMatch.ID*100 + idx,
			MatchID:    newMatch.ID,
			TeamID:     sc.TeamID,
			TeamCode:   code,
			PlayerName: sc.PlayerName,
			Minute:     sc.Minute,
			EventType:  evType,
		})

		// Update scorer goal count if player exists
		for pIdx := range s.players {
			if strings.EqualFold(s.players[pIdx].Name, sc.PlayerName) {
				s.players[pIdx].Goals++
			}
		}
	}

	s.matches = append(s.matches, newMatch)

	// If MySQL is active, insert there too
	if s.isMySQL && s.db != nil {
		_, _ = s.db.Exec(`INSERT INTO matches (id, round, home_team_id, away_team_id, home_score, away_score, status, match_date, venue)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			newMatch.ID, newMatch.Round, newMatch.HomeTeamID, newMatch.AwayTeamID, newMatch.HomeScore, newMatch.AwayScore, newMatch.Status, newMatch.MatchDate, newMatch.Venue)

		for _, e := range newMatch.Events {
			_, _ = s.db.Exec(`INSERT INTO match_events (id, match_id, team_id, team_code, player_name, minute, event_type)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				e.ID, e.MatchID, e.TeamID, e.TeamCode, e.PlayerName, e.Minute, e.EventType)
		}
	}

	return newMatch, nil
}

func (s *Store) GetPhotos(category string) []models.Photo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []models.Photo
	catLower := strings.ToLower(strings.TrimSpace(category))

	for _, p := range s.photos {
		if catLower != "" && catLower != "all" && strings.ToLower(p.Category) != catLower {
			continue
		}
		result = append(result, p)
	}

	// Sort newest first
	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})

	return result
}

func (s *Store) AddPhoto(req models.CreatePhotoRequest) (models.Photo, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if strings.TrimSpace(req.Title) == "" {
		return models.Photo{}, fmt.Errorf("photo title is required")
	}
	if strings.TrimSpace(req.ImageURL) == "" {
		return models.Photo{}, fmt.Errorf("image URL or data is required")
	}

	category := req.Category
	if category == "" {
		category = "Match Action"
	}
	uploader := req.UploaderName
	if uploader == "" {
		uploader = "Football Fan"
	}

	s.nextPhotoID++
	newPhoto := models.Photo{
		ID:           s.nextPhotoID,
		Title:        req.Title,
		Category:     category,
		ImageURL:     req.ImageURL,
		Description:  req.Description,
		UploaderName: uploader,
		CreatedAt:    time.Now(),
		Likes:        1,
	}

	s.photos = append(s.photos, newPhoto)

	if s.isMySQL && s.db != nil {
		_, _ = s.db.Exec(`INSERT INTO photos (id, title, category, image_url, description, uploader_name, created_at, likes)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			newPhoto.ID, newPhoto.Title, newPhoto.Category, newPhoto.ImageURL, newPhoto.Description, newPhoto.UploaderName, newPhoto.CreatedAt, newPhoto.Likes)
	}

	return newPhoto, nil
}

func (s *Store) LikePhoto(id int) (int, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.photos {
		if s.photos[i].ID == id {
			s.photos[i].Likes++
			newLikes := s.photos[i].Likes

			if s.isMySQL && s.db != nil {
				_, _ = s.db.Exec(`UPDATE photos SET likes = likes + 1 WHERE id = ?`, id)
			}

			return newLikes, true
		}
	}
	return 0, false
}

