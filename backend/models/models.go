package models

import "time"

type Team struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	ShortName string `json:"short_name"`
	Code      string `json:"code"`
	Logo      string `json:"logo"`
	Stadium   string `json:"stadium"`
	City      string `json:"city"`
	Founded   int    `json:"founded"`
	Manager   string `json:"manager"`
}

type MatchEvent struct {
	ID         int    `json:"id"`
	MatchID    int    `json:"match_id"`
	TeamID     int    `json:"team_id"`
	TeamCode   string `json:"team_code"`
	PlayerName string `json:"player_name"`
	Minute     int    `json:"minute"`
	EventType  string `json:"event_type"` // GOAL, YELLOW_CARD, RED_CARD, PENALTY
}

type MatchStats struct {
	HomePossession    int `json:"home_possession"`
	AwayPossession    int `json:"away_possession"`
	HomeShots         int `json:"home_shots"`
	AwayShots         int `json:"away_shots"`
	HomeShotsOnTarget int `json:"home_shots_on_target"`
	AwayShotsOnTarget int `json:"away_shots_on_target"`
	HomeCorners       int `json:"home_corners"`
	AwayCorners       int `json:"away_corners"`
	HomeFouls         int `json:"home_fouls"`
	AwayFouls         int `json:"away_fouls"`
}

type Match struct {
	ID         int          `json:"id"`
	Round      int          `json:"round"`
	HomeTeamID int          `json:"home_team_id"`
	AwayTeamID int          `json:"away_team_id"`
	HomeTeam   Team         `json:"home_team"`
	AwayTeam   Team         `json:"away_team"`
	HomeScore  *int         `json:"home_score"`
	AwayScore  *int         `json:"away_score"`
	Status     string       `json:"status"` // FINISHED, SCHEDULED, LIVE
	MatchDate  time.Time    `json:"match_date"`
	Venue      string       `json:"venue"`
	Events     []MatchEvent `json:"events"`
	Stats      *MatchStats  `json:"stats,omitempty"`
}

type Standing struct {
	Position       int      `json:"position"` // 1st to 20th
	TeamID         int      `json:"team_id"`
	TeamName       string   `json:"team_name"`
	TeamCode       string   `json:"team_code"`
	TeamLogo       string   `json:"team_logo"`
	Played         int      `json:"played"`
	Won            int      `json:"won"`
	Drawn          int      `json:"drawn"`
	Lost           int      `json:"lost"`
	GoalsFor       int      `json:"goals_for"`
	GoalsAgainst   int      `json:"goals_against"`
	GoalDifference int      `json:"goal_difference"`
	Points         int      `json:"points"`
	Form           []string `json:"form"` // e.g. ["W", "D", "W", "L", "W"]
}

type Player struct {
	ID          int    `json:"id"`
	TeamID      int    `json:"team_id"`
	TeamName    string `json:"team_name"`
	TeamCode    string `json:"team_code"`
	Name        string `json:"name"`
	Position    string `json:"position"` // FW, MF, DF, GK
	Number      int    `json:"number"`
	Nationality string `json:"nationality"`
	Goals       int    `json:"goals"`
	Assists     int    `json:"assists"`
	YellowCards int    `json:"yellow_cards"`
	RedCards    int    `json:"red_cards"`
	Photo       string `json:"photo"`
}

type DBStatus struct {
	Connected bool   `json:"connected"`
	Database  string `json:"database"`
	Host      string `json:"host"`
	Port      int    `json:"port"`
	User      string `json:"user"`
	Message   string `json:"message"`
	Source    string `json:"source"` // "mysql" or "memory"
}

type DBConfigRequest struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Database string `json:"database"`
}

type CreateMatchRequest struct {
	Round      int    `json:"round"`
	HomeTeamID int    `json:"home_team_id"`
	AwayTeamID int    `json:"away_team_id"`
	HomeScore  int    `json:"home_score"`
	AwayScore  int    `json:"away_score"`
	MatchDate  string `json:"match_date"` // YYYY-MM-DD HH:MM
	Venue      string `json:"venue"`
	Scorers    []struct {
		TeamID     int    `json:"team_id"`
		PlayerName string `json:"player_name"`
		Minute     int    `json:"minute"`
		EventType  string `json:"event_type"`
	} `json:"scorers"`
}

type Photo struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Category     string    `json:"category"` // "Match Action", "Stadiums", "Fans", "Celebrations"
	ImageURL     string    `json:"image_url"`
	Description  string    `json:"description"`
	UploaderName string    `json:"uploader_name"`
	CreatedAt    time.Time `json:"created_at"`
	Likes        int       `json:"likes"`
}

type CreatePhotoRequest struct {
	Title        string `json:"title"`
	Category     string `json:"category"`
	ImageURL     string `json:"image_url"`
	Description  string `json:"description"`
	UploaderName string `json:"uploader_name"`
}
