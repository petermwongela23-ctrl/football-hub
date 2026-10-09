package db

import (
	"football-backend/models"
	"time"
)

var SeedTeams = []models.Team{
	{ID: 1, Name: "Manchester City", ShortName: "Man City", Code: "MCI", Logo: "https://resources.premierleague.com/premierleague/badges/50/t43.png", Stadium: "Etihad Stadium", City: "Manchester", Founded: 1894, Manager: "Pep Guardiola"},
	{ID: 2, Name: "Arsenal", ShortName: "Arsenal", Code: "ARS", Logo: "https://resources.premierleague.com/premierleague/badges/50/t3.png", Stadium: "Emirates Stadium", City: "London", Founded: 1886, Manager: "Mikel Arteta"},
	{ID: 3, Name: "Liverpool", ShortName: "Liverpool", Code: "LIV", Logo: "https://resources.premierleague.com/premierleague/badges/50/t14.png", Stadium: "Anfield", City: "Liverpool", Founded: 1892, Manager: "Arne Slot"},
	{ID: 4, Name: "Aston Villa", ShortName: "Aston Villa", Code: "AVL", Logo: "https://resources.premierleague.com/premierleague/badges/50/t7.png", Stadium: "Villa Park", City: "Birmingham", Founded: 1874, Manager: "Unai Emery"},
	{ID: 5, Name: "Chelsea", ShortName: "Chelsea", Code: "CHE", Logo: "https://resources.premierleague.com/premierleague/badges/50/t8.png", Stadium: "Stamford Bridge", City: "London", Founded: 1905, Manager: "Enzo Maresca"},
	{ID: 6, Name: "Tottenham Hotspur", ShortName: "Spurs", Code: "TOT", Logo: "https://resources.premierleague.com/premierleague/badges/50/t6.png", Stadium: "Tottenham Hotspur Stadium", City: "London", Founded: 1882, Manager: "Ange Postecoglou"},
	{ID: 7, Name: "Newcastle United", ShortName: "Newcastle", Code: "NEW", Logo: "https://resources.premierleague.com/premierleague/badges/50/t4.png", Stadium: "St. James' Park", City: "Newcastle", Founded: 1892, Manager: "Eddie Howe"},
	{ID: 8, Name: "Brighton & Hove Albion", ShortName: "Brighton", Code: "BHA", Logo: "https://resources.premierleague.com/premierleague/badges/50/t36.png", Stadium: "Amex Stadium", City: "Brighton", Founded: 1901, Manager: "Fabian Hürzeler"},
	{ID: 9, Name: "Nottingham Forest", ShortName: "Nott'm Forest", Code: "NFO", Logo: "https://resources.premierleague.com/premierleague/badges/50/t17.png", Stadium: "City Ground", City: "Nottingham", Founded: 1865, Manager: "Nuno Espírito Santo"},
	{ID: 10, Name: "Fulham", ShortName: "Fulham", Code: "FUL", Logo: "https://resources.premierleague.com/premierleague/badges/50/t54.png", Stadium: "Craven Cottage", City: "London", Founded: 1879, Manager: "Marco Silva"},
	{ID: 11, Name: "Brentford", ShortName: "Brentford", Code: "BRE", Logo: "https://resources.premierleague.com/premierleague/badges/50/t94.png", Stadium: "Gtech Community Stadium", City: "London", Founded: 1889, Manager: "Thomas Frank"},
	{ID: 12, Name: "Manchester United", ShortName: "Man Utd", Code: "MUN", Logo: "https://resources.premierleague.com/premierleague/badges/50/t1.png", Stadium: "Old Trafford", City: "Manchester", Founded: 1878, Manager: "Ruben Amorim"},
	{ID: 13, Name: "AFC Bournemouth", ShortName: "Bournemouth", Code: "BOU", Logo: "https://resources.premierleague.com/premierleague/badges/50/t91.png", Stadium: "Vitality Stadium", City: "Bournemouth", Founded: 1899, Manager: "Andoni Iraola"},
	{ID: 14, Name: "West Ham United", ShortName: "West Ham", Code: "WHU", Logo: "https://resources.premierleague.com/premierleague/badges/50/t21.png", Stadium: "London Stadium", City: "London", Founded: 1895, Manager: "Julen Lopetegui"},
	{ID: 15, Name: "Leicester City", ShortName: "Leicester", Code: "LEI", Logo: "https://resources.premierleague.com/premierleague/badges/50/t13.png", Stadium: "King Power Stadium", City: "Leicester", Founded: 1884, Manager: "Steve Cooper"},
	{ID: 16, Name: "Everton", ShortName: "Everton", Code: "EVE", Logo: "https://resources.premierleague.com/premierleague/badges/50/t11.png", Stadium: "Goodison Park", City: "Liverpool", Founded: 1878, Manager: "Sean Dyche"},
	{ID: 17, Name: "Crystal Palace", ShortName: "Crystal Palace", Code: "CRY", Logo: "https://resources.premierleague.com/premierleague/badges/50/t31.png", Stadium: "Selhurst Park", City: "London", Founded: 1905, Manager: "Oliver Glasner"},
	{ID: 18, Name: "Ipswich Town", ShortName: "Ipswich", Code: "IPS", Logo: "https://resources.premierleague.com/premierleague/badges/50/t40.png", Stadium: "Portman Road", City: "Ipswich", Founded: 1878, Manager: "Kieran McKenna"},
	{ID: 19, Name: "Wolverhampton Wanderers", ShortName: "Wolves", Code: "WOL", Logo: "https://resources.premierleague.com/premierleague/badges/50/t39.png", Stadium: "Molineux Stadium", City: "Wolverhampton", Founded: 1877, Manager: "Gary O'Neil"},
	{ID: 20, Name: "Southampton", ShortName: "Southampton", Code: "SOU", Logo: "https://resources.premierleague.com/premierleague/badges/50/t20.png", Stadium: "St Mary's Stadium", City: "Southampton", Founded: 1885, Manager: "Russell Martin"},
}

func getTeamByID(id int) models.Team {
	for _, t := range SeedTeams {
		if t.ID == id {
			return t
		}
	}
	return models.Team{}
}

func intPtr(i int) *int {
	return &i
}

func parseTime(s string) time.Time {
	t, _ := time.Parse("2006-01-02 15:04", s)
	return t
}

func GenerateSeedMatches() []models.Match {
	return []models.Match{
		// Round 1
		{
			ID: 1, Round: 1, HomeTeamID: 12, AwayTeamID: 10, HomeTeam: getTeamByID(12), AwayTeam: getTeamByID(10),
			HomeScore: intPtr(1), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-08-16 20:00"), Venue: "Old Trafford",
			Stats: &models.MatchStats{HomePossession: 58, AwayPossession: 42, HomeShots: 14, AwayShots: 9, HomeShotsOnTarget: 5, AwayShotsOnTarget: 2, HomeCorners: 7, AwayCorners: 4, HomeFouls: 11, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 1, MatchID: 1, TeamID: 12, TeamCode: "MUN", PlayerName: "Joshua Zirkzee", Minute: 87, EventType: "GOAL"},
				{ID: 2, MatchID: 1, TeamID: 10, TeamCode: "FUL", PlayerName: "Andreas Pereira", Minute: 70, EventType: "YELLOW_CARD"},
			},
		},
		{
			ID: 2, Round: 1, HomeTeamID: 18, AwayTeamID: 3, HomeTeam: getTeamByID(18), AwayTeam: getTeamByID(3),
			HomeScore: intPtr(0), AwayScore: intPtr(2), Status: "FINISHED", MatchDate: parseTime("2026-08-17 12:30"), Venue: "Portman Road",
			Stats: &models.MatchStats{HomePossession: 38, AwayPossession: 62, HomeShots: 7, AwayShots: 19, HomeShotsOnTarget: 2, AwayShotsOnTarget: 8, HomeCorners: 3, AwayCorners: 10, HomeFouls: 14, AwayFouls: 9},
			Events: []models.MatchEvent{
				{ID: 3, MatchID: 2, TeamID: 3, TeamCode: "LIV", PlayerName: "Diogo Jota", Minute: 60, EventType: "GOAL"},
				{ID: 4, MatchID: 2, TeamID: 3, TeamCode: "LIV", PlayerName: "Mohamed Salah", Minute: 65, EventType: "GOAL"},
			},
		},
		{
			ID: 3, Round: 1, HomeTeamID: 2, AwayTeamID: 19, HomeTeam: getTeamByID(2), AwayTeam: getTeamByID(19),
			HomeScore: intPtr(2), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-08-17 15:00"), Venue: "Emirates Stadium",
			Stats: &models.MatchStats{HomePossession: 60, AwayPossession: 40, HomeShots: 18, AwayShots: 8, HomeShotsOnTarget: 6, AwayShotsOnTarget: 3, HomeCorners: 8, AwayCorners: 3, HomeFouls: 8, AwayFouls: 12},
			Events: []models.MatchEvent{
				{ID: 5, MatchID: 3, TeamID: 2, TeamCode: "ARS", PlayerName: "Kai Havertz", Minute: 25, EventType: "GOAL"},
				{ID: 6, MatchID: 3, TeamID: 2, TeamCode: "ARS", PlayerName: "Bukayo Saka", Minute: 74, EventType: "GOAL"},
			},
		},
		{
			ID: 4, Round: 1, HomeTeamID: 5, AwayTeamID: 1, HomeTeam: getTeamByID(5), AwayTeam: getTeamByID(1),
			HomeScore: intPtr(0), AwayScore: intPtr(2), Status: "FINISHED", MatchDate: parseTime("2026-08-18 16:30"), Venue: "Stamford Bridge",
			Stats: &models.MatchStats{HomePossession: 48, AwayPossession: 52, HomeShots: 10, AwayShots: 11, HomeShotsOnTarget: 3, AwayShotsOnTarget: 5, HomeCorners: 4, AwayCorners: 6, HomeFouls: 12, AwayFouls: 9},
			Events: []models.MatchEvent{
				{ID: 7, MatchID: 4, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 18, EventType: "GOAL"},
				{ID: 8, MatchID: 4, TeamID: 1, TeamCode: "MCI", PlayerName: "Mateo Kovacic", Minute: 84, EventType: "GOAL"},
			},
		},
		{
			ID: 5, Round: 1, HomeTeamID: 15, AwayTeamID: 6, HomeTeam: getTeamByID(15), AwayTeam: getTeamByID(6),
			HomeScore: intPtr(1), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-19 20:00"), Venue: "King Power Stadium",
			Stats: &models.MatchStats{HomePossession: 30, AwayPossession: 70, HomeShots: 7, AwayShots: 15, HomeShotsOnTarget: 3, AwayShotsOnTarget: 7, HomeCorners: 2, AwayCorners: 13, HomeFouls: 11, AwayFouls: 10},
			Events: []models.MatchEvent{
				{ID: 9, MatchID: 5, TeamID: 6, TeamCode: "TOT", PlayerName: "Pedro Porro", Minute: 29, EventType: "GOAL"},
				{ID: 10, MatchID: 5, TeamID: 15, TeamCode: "LEI", PlayerName: "Jamie Vardy", Minute: 57, EventType: "GOAL"},
			},
		},
		{
			ID: 6, Round: 1, HomeTeamID: 7, AwayTeamID: 20, HomeTeam: getTeamByID(7), AwayTeam: getTeamByID(20),
			HomeScore: intPtr(1), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-08-17 15:00"), Venue: "St. James' Park",
			Stats: &models.MatchStats{HomePossession: 22, AwayPossession: 78, HomeShots: 3, AwayShots: 19, HomeShotsOnTarget: 1, AwayShotsOnTarget: 4, HomeCorners: 1, AwayCorners: 12, HomeFouls: 15, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 11, MatchID: 6, TeamID: 7, TeamCode: "NEW", PlayerName: "Fabian Schar", Minute: 28, EventType: "RED_CARD"},
				{ID: 12, MatchID: 6, TeamID: 7, TeamCode: "NEW", PlayerName: "Joelinton", Minute: 45, EventType: "GOAL"},
			},
		},
		{
			ID: 7, Round: 1, HomeTeamID: 14, AwayTeamID: 4, HomeTeam: getTeamByID(14), AwayTeam: getTeamByID(4),
			HomeScore: intPtr(1), AwayScore: intPtr(2), Status: "FINISHED", MatchDate: parseTime("2026-08-17 17:30"), Venue: "London Stadium",
			Stats: &models.MatchStats{HomePossession: 51, AwayPossession: 49, HomeShots: 14, AwayShots: 15, HomeShotsOnTarget: 3, AwayShotsOnTarget: 3, HomeCorners: 6, AwayCorners: 5, HomeFouls: 12, AwayFouls: 14},
			Events: []models.MatchEvent{
				{ID: 13, MatchID: 7, TeamID: 4, TeamCode: "AVL", PlayerName: "Amadou Onana", Minute: 4, EventType: "GOAL"},
				{ID: 14, MatchID: 7, TeamID: 14, TeamCode: "WHU", PlayerName: "Lucas Paqueta", Minute: 37, EventType: "PENALTY"},
				{ID: 15, MatchID: 7, TeamID: 4, TeamCode: "AVL", PlayerName: "Jhon Duran", Minute: 79, EventType: "GOAL"},
			},
		},
		{
			ID: 8, Round: 1, HomeTeamID: 16, AwayTeamID: 8, HomeTeam: getTeamByID(16), AwayTeam: getTeamByID(8),
			HomeScore: intPtr(0), AwayScore: intPtr(3), Status: "FINISHED", MatchDate: parseTime("2026-08-17 15:00"), Venue: "Goodison Park",
			Stats: &models.MatchStats{HomePossession: 38, AwayPossession: 62, HomeShots: 9, AwayShots: 10, HomeShotsOnTarget: 1, AwayShotsOnTarget: 5, HomeCorners: 1, AwayCorners: 5, HomeFouls: 11, AwayFouls: 10},
			Events: []models.MatchEvent{
				{ID: 16, MatchID: 8, TeamID: 8, TeamCode: "BHA", PlayerName: "Kaoru Mitoma", Minute: 26, EventType: "GOAL"},
				{ID: 17, MatchID: 8, TeamID: 8, TeamCode: "BHA", PlayerName: "Danny Welbeck", Minute: 56, EventType: "GOAL"},
				{ID: 18, MatchID: 8, TeamID: 8, TeamCode: "BHA", PlayerName: "Simon Adingra", Minute: 86, EventType: "GOAL"},
			},
		},
		{
			ID: 9, Round: 1, HomeTeamID: 9, AwayTeamID: 13, HomeTeam: getTeamByID(9), AwayTeam: getTeamByID(13),
			HomeScore: intPtr(1), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-17 15:00"), Venue: "City Ground",
			Stats: &models.MatchStats{HomePossession: 46, AwayPossession: 54, HomeShots: 14, AwayShots: 13, HomeShotsOnTarget: 3, AwayShotsOnTarget: 4, HomeCorners: 5, AwayCorners: 4, HomeFouls: 14, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 19, MatchID: 9, TeamID: 9, TeamCode: "NFO", PlayerName: "Chris Wood", Minute: 23, EventType: "GOAL"},
				{ID: 20, MatchID: 9, TeamID: 13, TeamCode: "BOU", PlayerName: "Antoine Semenyo", Minute: 86, EventType: "GOAL"},
			},
		},
		{
			ID: 10, Round: 1, HomeTeamID: 11, AwayTeamID: 17, HomeTeam: getTeamByID(11), AwayTeam: getTeamByID(17),
			HomeScore: intPtr(2), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-18 14:00"), Venue: "Gtech Community Stadium",
			Stats: &models.MatchStats{HomePossession: 45, AwayPossession: 55, HomeShots: 9, AwayShots: 14, HomeShotsOnTarget: 5, AwayShotsOnTarget: 6, HomeCorners: 5, AwayCorners: 6, HomeFouls: 6, AwayFouls: 11},
			Events: []models.MatchEvent{
				{ID: 21, MatchID: 10, TeamID: 11, TeamCode: "BRE", PlayerName: "Bryan Mbeumo", Minute: 29, EventType: "GOAL"},
				{ID: 22, MatchID: 10, TeamID: 17, TeamCode: "CRY", PlayerName: "Ethan Pinnock (OG)", Minute: 56, EventType: "GOAL"},
				{ID: 23, MatchID: 10, TeamID: 11, TeamCode: "BRE", PlayerName: "Yoane Wissa", Minute: 76, EventType: "GOAL"},
			},
		},

		// Round 2
		{
			ID: 11, Round: 2, HomeTeamID: 8, AwayTeamID: 12, HomeTeam: getTeamByID(8), AwayTeam: getTeamByID(12),
			HomeScore: intPtr(2), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-24 12:30"), Venue: "Amex Stadium",
			Stats: &models.MatchStats{HomePossession: 53, AwayPossession: 47, HomeShots: 14, AwayShots: 11, HomeShotsOnTarget: 5, AwayShotsOnTarget: 4, HomeCorners: 4, AwayCorners: 4, HomeFouls: 11, AwayFouls: 14},
			Events: []models.MatchEvent{
				{ID: 24, MatchID: 11, TeamID: 8, TeamCode: "BHA", PlayerName: "Danny Welbeck", Minute: 32, EventType: "GOAL"},
				{ID: 25, MatchID: 11, TeamID: 12, TeamCode: "MUN", PlayerName: "Amad Diallo", Minute: 60, EventType: "GOAL"},
				{ID: 26, MatchID: 11, TeamID: 8, TeamCode: "BHA", PlayerName: "Joao Pedro", Minute: 90, EventType: "GOAL"},
			},
		},
		{
			ID: 12, Round: 2, HomeTeamID: 1, AwayTeamID: 18, HomeTeam: getTeamByID(1), AwayTeam: getTeamByID(18),
			HomeScore: intPtr(4), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-24 15:00"), Venue: "Etihad Stadium",
			Stats: &models.MatchStats{HomePossession: 76, AwayPossession: 24, HomeShots: 14, AwayShots: 1, HomeShotsOnTarget: 5, AwayShotsOnTarget: 1, HomeCorners: 12, AwayCorners: 0, HomeFouls: 3, AwayFouls: 10},
			Events: []models.MatchEvent{
				{ID: 27, MatchID: 12, TeamID: 18, TeamCode: "IPS", PlayerName: "Sammie Szmodics", Minute: 7, EventType: "GOAL"},
				{ID: 28, MatchID: 12, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 12, EventType: "PENALTY"},
				{ID: 29, MatchID: 12, TeamID: 1, TeamCode: "MCI", PlayerName: "Kevin De Bruyne", Minute: 14, EventType: "GOAL"},
				{ID: 30, MatchID: 12, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 16, EventType: "GOAL"},
				{ID: 31, MatchID: 12, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 88, EventType: "GOAL"},
			},
		},
		{
			ID: 13, Round: 2, HomeTeamID: 6, AwayTeamID: 16, HomeTeam: getTeamByID(6), AwayTeam: getTeamByID(16),
			HomeScore: intPtr(4), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-08-24 15:00"), Venue: "Tottenham Hotspur Stadium",
			Stats: &models.MatchStats{HomePossession: 71, AwayPossession: 29, HomeShots: 13, AwayShots: 10, HomeShotsOnTarget: 7, AwayShotsOnTarget: 1, HomeCorners: 12, AwayCorners: 5, HomeFouls: 10, AwayFouls: 12},
			Events: []models.MatchEvent{
				{ID: 32, MatchID: 13, TeamID: 6, TeamCode: "TOT", PlayerName: "Yves Bissouma", Minute: 14, EventType: "GOAL"},
				{ID: 33, MatchID: 13, TeamID: 6, TeamCode: "TOT", PlayerName: "Son Heung-min", Minute: 25, EventType: "GOAL"},
				{ID: 34, MatchID: 13, TeamID: 6, TeamCode: "TOT", PlayerName: "Cristian Romero", Minute: 71, EventType: "GOAL"},
				{ID: 35, MatchID: 13, TeamID: 6, TeamCode: "TOT", PlayerName: "Son Heung-min", Minute: 77, EventType: "GOAL"},
			},
		},
		{
			ID: 14, Round: 2, HomeTeamID: 4, AwayTeamID: 2, HomeTeam: getTeamByID(4), AwayTeam: getTeamByID(2),
			HomeScore: intPtr(0), AwayScore: intPtr(2), Status: "FINISHED", MatchDate: parseTime("2026-08-24 17:30"), Venue: "Villa Park",
			Stats: &models.MatchStats{HomePossession: 39, AwayPossession: 61, HomeShots: 11, AwayShots: 9, HomeShotsOnTarget: 3, AwayShotsOnTarget: 4, HomeCorners: 4, AwayCorners: 3, HomeFouls: 12, AwayFouls: 14},
			Events: []models.MatchEvent{
				{ID: 36, MatchID: 14, TeamID: 2, TeamCode: "ARS", PlayerName: "Leandro Trossard", Minute: 67, EventType: "GOAL"},
				{ID: 37, MatchID: 14, TeamID: 2, TeamCode: "ARS", PlayerName: "Thomas Partey", Minute: 77, EventType: "GOAL"},
			},
		},
		{
			ID: 15, Round: 2, HomeTeamID: 19, AwayTeamID: 5, HomeTeam: getTeamByID(19), AwayTeam: getTeamByID(5),
			HomeScore: intPtr(2), AwayScore: intPtr(6), Status: "FINISHED", MatchDate: parseTime("2026-08-25 14:00"), Venue: "Molineux Stadium",
			Stats: &models.MatchStats{HomePossession: 40, AwayPossession: 60, HomeShots: 12, AwayShots: 14, HomeShotsOnTarget: 4, AwayShotsOnTarget: 8, HomeCorners: 3, AwayCorners: 5, HomeFouls: 13, AwayFouls: 11},
			Events: []models.MatchEvent{
				{ID: 38, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Nicolas Jackson", Minute: 2, EventType: "GOAL"},
				{ID: 39, MatchID: 15, TeamID: 19, TeamCode: "WOL", PlayerName: "Matheus Cunha", Minute: 27, EventType: "GOAL"},
				{ID: 40, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Cole Palmer", Minute: 45, EventType: "GOAL"},
				{ID: 41, MatchID: 15, TeamID: 19, TeamCode: "WOL", PlayerName: "Jorgen Strand Larsen", Minute: 45, EventType: "GOAL"},
				{ID: 42, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Noni Madueke", Minute: 49, EventType: "GOAL"},
				{ID: 43, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Noni Madueke", Minute: 58, EventType: "GOAL"},
				{ID: 44, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Noni Madueke", Minute: 63, EventType: "GOAL"},
				{ID: 45, MatchID: 15, TeamID: 5, TeamCode: "CHE", PlayerName: "Joao Felix", Minute: 80, EventType: "GOAL"},
			},
		},
		{
			ID: 16, Round: 2, HomeTeamID: 3, AwayTeamID: 11, HomeTeam: getTeamByID(3), AwayTeam: getTeamByID(11),
			HomeScore: intPtr(2), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-08-25 16:30"), Venue: "Anfield",
			Stats: &models.MatchStats{HomePossession: 63, AwayPossession: 37, HomeShots: 19, AwayShots: 8, HomeShotsOnTarget: 8, AwayShotsOnTarget: 2, HomeCorners: 10, AwayCorners: 4, HomeFouls: 10, AwayFouls: 9},
			Events: []models.MatchEvent{
				{ID: 46, MatchID: 16, TeamID: 3, TeamCode: "LIV", PlayerName: "Luis Diaz", Minute: 13, EventType: "GOAL"},
				{ID: 47, MatchID: 16, TeamID: 3, TeamCode: "LIV", PlayerName: "Mohamed Salah", Minute: 70, EventType: "GOAL"},
			},
		},

		// Round 3
		{
			ID: 17, Round: 3, HomeTeamID: 2, AwayTeamID: 8, HomeTeam: getTeamByID(2), AwayTeam: getTeamByID(8),
			HomeScore: intPtr(1), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-08-31 12:30"), Venue: "Emirates Stadium",
			Stats: &models.MatchStats{HomePossession: 36, AwayPossession: 64, HomeShots: 11, AwayShots: 22, HomeShotsOnTarget: 7, AwayShotsOnTarget: 4, HomeCorners: 4, AwayCorners: 5, HomeFouls: 13, AwayFouls: 12},
			Events: []models.MatchEvent{
				{ID: 48, MatchID: 17, TeamID: 2, TeamCode: "ARS", PlayerName: "Kai Havertz", Minute: 38, EventType: "GOAL"},
				{ID: 49, MatchID: 17, TeamID: 2, TeamCode: "ARS", PlayerName: "Declan Rice", Minute: 49, EventType: "RED_CARD"},
				{ID: 50, MatchID: 17, TeamID: 8, TeamCode: "BHA", PlayerName: "Joao Pedro", Minute: 58, EventType: "GOAL"},
			},
		},
		{
			ID: 18, Round: 3, HomeTeamID: 14, AwayTeamID: 1, HomeTeam: getTeamByID(14), AwayTeam: getTeamByID(1),
			HomeScore: intPtr(1), AwayScore: intPtr(3), Status: "FINISHED", MatchDate: parseTime("2026-08-31 17:30"), Venue: "London Stadium",
			Stats: &models.MatchStats{HomePossession: 31, AwayPossession: 69, HomeShots: 10, AwayShots: 23, HomeShotsOnTarget: 2, AwayShotsOnTarget: 8, HomeCorners: 3, AwayCorners: 11, HomeFouls: 13, AwayFouls: 4},
			Events: []models.MatchEvent{
				{ID: 51, MatchID: 18, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 10, EventType: "GOAL"},
				{ID: 52, MatchID: 18, TeamID: 14, TeamCode: "WHU", PlayerName: "Ruben Dias (OG)", Minute: 19, EventType: "GOAL"},
				{ID: 53, MatchID: 18, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 30, EventType: "GOAL"},
				{ID: 54, MatchID: 18, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 83, EventType: "GOAL"},
			},
		},
		{
			ID: 19, Round: 3, HomeTeamID: 12, AwayTeamID: 3, HomeTeam: getTeamByID(12), AwayTeam: getTeamByID(3),
			HomeScore: intPtr(0), AwayScore: intPtr(3), Status: "FINISHED", MatchDate: parseTime("2026-09-01 16:00"), Venue: "Old Trafford",
			Stats: &models.MatchStats{HomePossession: 53, AwayPossession: 47, HomeShots: 8, AwayShots: 12, HomeShotsOnTarget: 3, AwayShotsOnTarget: 3, HomeCorners: 5, AwayCorners: 2, HomeFouls: 7, AwayFouls: 6},
			Events: []models.MatchEvent{
				{ID: 55, MatchID: 19, TeamID: 3, TeamCode: "LIV", PlayerName: "Luis Diaz", Minute: 35, EventType: "GOAL"},
				{ID: 56, MatchID: 19, TeamID: 3, TeamCode: "LIV", PlayerName: "Luis Diaz", Minute: 42, EventType: "GOAL"},
				{ID: 57, MatchID: 19, TeamID: 3, TeamCode: "LIV", PlayerName: "Mohamed Salah", Minute: 56, EventType: "GOAL"},
			},
		},
		{
			ID: 20, Round: 3, HomeTeamID: 7, AwayTeamID: 6, HomeTeam: getTeamByID(7), AwayTeam: getTeamByID(6),
			HomeScore: intPtr(2), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-01 13:30"), Venue: "St. James' Park",
			Stats: &models.MatchStats{HomePossession: 34, AwayPossession: 66, HomeShots: 9, AwayShots: 20, HomeShotsOnTarget: 6, AwayShotsOnTarget: 6, HomeCorners: 7, AwayCorners: 12, HomeFouls: 16, AwayFouls: 12},
			Events: []models.MatchEvent{
				{ID: 58, MatchID: 20, TeamID: 7, TeamCode: "NEW", PlayerName: "Harvey Barnes", Minute: 37, EventType: "GOAL"},
				{ID: 59, MatchID: 20, TeamID: 6, TeamCode: "TOT", PlayerName: "Dan Burn (OG)", Minute: 56, EventType: "GOAL"},
				{ID: 60, MatchID: 20, TeamID: 7, TeamCode: "NEW", PlayerName: "Alexander Isak", Minute: 78, EventType: "GOAL"},
			},
		},

		// Round 4
		{
			ID: 21, Round: 4, HomeTeamID: 20, AwayTeamID: 12, HomeTeam: getTeamByID(20), AwayTeam: getTeamByID(12),
			HomeScore: intPtr(0), AwayScore: intPtr(3), Status: "FINISHED", MatchDate: parseTime("2026-09-14 12:30"), Venue: "St Mary's Stadium",
			Stats: &models.MatchStats{HomePossession: 44, AwayPossession: 56, HomeShots: 6, AwayShots: 20, HomeShotsOnTarget: 4, AwayShotsOnTarget: 10, HomeCorners: 1, AwayCorners: 6, HomeFouls: 13, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 61, MatchID: 21, TeamID: 12, TeamCode: "MUN", PlayerName: "Matthijs de Ligt", Minute: 35, EventType: "GOAL"},
				{ID: 62, MatchID: 21, TeamID: 12, TeamCode: "MUN", PlayerName: "Marcus Rashford", Minute: 41, EventType: "GOAL"},
				{ID: 63, MatchID: 21, TeamID: 12, TeamCode: "MUN", PlayerName: "Alejandro Garnacho", Minute: 90, EventType: "GOAL"},
				{ID: 64, MatchID: 21, TeamID: 20, TeamCode: "SOU", PlayerName: "Jack Stephens", Minute: 79, EventType: "RED_CARD"},
			},
		},
		{
			ID: 22, Round: 4, HomeTeamID: 1, AwayTeamID: 11, HomeTeam: getTeamByID(1), AwayTeam: getTeamByID(11),
			HomeScore: intPtr(2), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-14 15:00"), Venue: "Etihad Stadium",
			Stats: &models.MatchStats{HomePossession: 54, AwayPossession: 46, HomeShots: 18, AwayShots: 11, HomeShotsOnTarget: 7, AwayShotsOnTarget: 5, HomeCorners: 8, AwayCorners: 5, HomeFouls: 3, AwayFouls: 9},
			Events: []models.MatchEvent{
				{ID: 65, MatchID: 22, TeamID: 11, TeamCode: "BRE", PlayerName: "Yoane Wissa", Minute: 1, EventType: "GOAL"},
				{ID: 66, MatchID: 22, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 19, EventType: "GOAL"},
				{ID: 67, MatchID: 22, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 32, EventType: "GOAL"},
			},
		},
		{
			ID: 23, Round: 4, HomeTeamID: 3, AwayTeamID: 9, HomeTeam: getTeamByID(3), AwayTeam: getTeamByID(9),
			HomeScore: intPtr(0), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-14 15:00"), Venue: "Anfield",
			Stats: &models.MatchStats{HomePossession: 70, AwayPossession: 30, HomeShots: 14, AwayShots: 5, HomeShotsOnTarget: 5, AwayShotsOnTarget: 3, HomeCorners: 7, AwayCorners: 2, HomeFouls: 15, AwayFouls: 9},
			Events: []models.MatchEvent{
				{ID: 68, MatchID: 23, TeamID: 9, TeamCode: "NFO", PlayerName: "Callum Hudson-Odoi", Minute: 72, EventType: "GOAL"},
			},
		},
		{
			ID: 24, Round: 4, HomeTeamID: 6, AwayTeamID: 2, HomeTeam: getTeamByID(6), AwayTeam: getTeamByID(2),
			HomeScore: intPtr(0), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-15 14:00"), Venue: "Tottenham Hotspur Stadium",
			Stats: &models.MatchStats{HomePossession: 64, AwayPossession: 36, HomeShots: 15, AwayShots: 7, HomeShotsOnTarget: 5, AwayShotsOnTarget: 4, HomeCorners: 7, AwayCorners: 6, HomeFouls: 12, AwayFouls: 11},
			Events: []models.MatchEvent{
				{ID: 69, MatchID: 24, TeamID: 2, TeamCode: "ARS", PlayerName: "Gabriel Magalhaes", Minute: 64, EventType: "GOAL"},
			},
		},
		{
			ID: 25, Round: 4, HomeTeamID: 13, AwayTeamID: 5, HomeTeam: getTeamByID(13), AwayTeam: getTeamByID(5),
			HomeScore: intPtr(0), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-14 20:00"), Venue: "Vitality Stadium",
			Stats: &models.MatchStats{HomePossession: 48, AwayPossession: 52, HomeShots: 19, AwayShots: 10, HomeShotsOnTarget: 7, AwayShotsOnTarget: 4, HomeCorners: 9, AwayCorners: 6, HomeFouls: 16, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 70, MatchID: 25, TeamID: 5, TeamCode: "CHE", PlayerName: "Christopher Nkunku", Minute: 86, EventType: "GOAL"},
			},
		},

		// Round 5
		{
			ID: 26, Round: 5, HomeTeamID: 14, AwayTeamID: 5, HomeTeam: getTeamByID(14), AwayTeam: getTeamByID(5),
			HomeScore: intPtr(0), AwayScore: intPtr(3), Status: "FINISHED", MatchDate: parseTime("2026-09-21 12:30"), Venue: "London Stadium",
			Stats: &models.MatchStats{HomePossession: 53, AwayPossession: 47, HomeShots: 15, AwayShots: 12, HomeShotsOnTarget: 7, AwayShotsOnTarget: 5, HomeCorners: 9, AwayCorners: 6, HomeFouls: 13, AwayFouls: 11},
			Events: []models.MatchEvent{
				{ID: 71, MatchID: 26, TeamID: 5, TeamCode: "CHE", PlayerName: "Nicolas Jackson", Minute: 4, EventType: "GOAL"},
				{ID: 72, MatchID: 26, TeamID: 5, TeamCode: "CHE", PlayerName: "Nicolas Jackson", Minute: 18, EventType: "GOAL"},
				{ID: 73, MatchID: 26, TeamID: 5, TeamCode: "CHE", PlayerName: "Cole Palmer", Minute: 47, EventType: "GOAL"},
			},
		},
		{
			ID: 27, Round: 5, HomeTeamID: 4, AwayTeamID: 19, HomeTeam: getTeamByID(4), AwayTeam: getTeamByID(19),
			HomeScore: intPtr(3), AwayScore: intPtr(1), Status: "FINISHED", MatchDate: parseTime("2026-09-21 15:00"), Venue: "Villa Park",
			Stats: &models.MatchStats{HomePossession: 51, AwayPossession: 49, HomeShots: 10, AwayShots: 9, HomeShotsOnTarget: 4, AwayShotsOnTarget: 3, HomeCorners: 5, AwayCorners: 4, HomeFouls: 10, AwayFouls: 13},
			Events: []models.MatchEvent{
				{ID: 74, MatchID: 27, TeamID: 19, TeamCode: "WOL", PlayerName: "Matheus Cunha", Minute: 25, EventType: "GOAL"},
				{ID: 75, MatchID: 27, TeamID: 4, TeamCode: "AVL", PlayerName: "Ollie Watkins", Minute: 73, EventType: "GOAL"},
				{ID: 76, MatchID: 27, TeamID: 4, TeamCode: "AVL", PlayerName: "Ezri Konsa", Minute: 88, EventType: "GOAL"},
				{ID: 77, MatchID: 27, TeamID: 4, TeamCode: "AVL", PlayerName: "Jhon Duran", Minute: 90, EventType: "GOAL"},
			},
		},
		{
			ID: 28, Round: 5, HomeTeamID: 1, AwayTeamID: 2, HomeTeam: getTeamByID(1), AwayTeam: getTeamByID(2),
			HomeScore: intPtr(2), AwayScore: intPtr(2), Status: "FINISHED", MatchDate: parseTime("2026-09-22 16:30"), Venue: "Etihad Stadium",
			Stats: &models.MatchStats{HomePossession: 77, AwayPossession: 23, HomeShots: 33, AwayShots: 5, HomeShotsOnTarget: 11, AwayShotsOnTarget: 3, HomeCorners: 17, AwayCorners: 2, HomeFouls: 7, AwayFouls: 7},
			Events: []models.MatchEvent{
				{ID: 78, MatchID: 28, TeamID: 1, TeamCode: "MCI", PlayerName: "Erling Haaland", Minute: 9, EventType: "GOAL"},
				{ID: 79, MatchID: 28, TeamID: 2, TeamCode: "ARS", PlayerName: "Riccardo Calafiori", Minute: 22, EventType: "GOAL"},
				{ID: 80, MatchID: 28, TeamID: 2, TeamCode: "ARS", PlayerName: "Gabriel Magalhaes", Minute: 45, EventType: "GOAL"},
				{ID: 81, MatchID: 28, TeamID: 2, TeamCode: "ARS", PlayerName: "Leandro Trossard", Minute: 45, EventType: "RED_CARD"},
				{ID: 82, MatchID: 28, TeamID: 1, TeamCode: "MCI", PlayerName: "John Stones", Minute: 98, EventType: "GOAL"},
			},
		},
		{
			ID: 29, Round: 5, HomeTeamID: 3, AwayTeamID: 13, HomeTeam: getTeamByID(3), AwayTeam: getTeamByID(13),
			HomeScore: intPtr(3), AwayScore: intPtr(0), Status: "FINISHED", MatchDate: parseTime("2026-09-21 15:00"), Venue: "Anfield",
			Stats: &models.MatchStats{HomePossession: 59, AwayPossession: 41, HomeShots: 19, AwayShots: 19, HomeShotsOnTarget: 8, AwayShotsOnTarget: 6, HomeCorners: 3, AwayCorners: 9, HomeFouls: 11, AwayFouls: 14},
			Events: []models.MatchEvent{
				{ID: 83, MatchID: 29, TeamID: 3, TeamCode: "LIV", PlayerName: "Luis Diaz", Minute: 26, EventType: "GOAL"},
				{ID: 84, MatchID: 29, TeamID: 3, TeamCode: "LIV", PlayerName: "Luis Diaz", Minute: 28, EventType: "GOAL"},
				{ID: 85, MatchID: 29, TeamID: 3, TeamCode: "LIV", PlayerName: "Darwin Nunez", Minute: 37, EventType: "GOAL"},
			},
		},

		// Upcoming Fixtures (Round 6)
		{
			ID: 30, Round: 6, HomeTeamID: 7, AwayTeamID: 1, HomeTeam: getTeamByID(7), AwayTeam: getTeamByID(1),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-28 12:30"), Venue: "St. James' Park",
		},
		{
			ID: 31, Round: 6, HomeTeamID: 2, AwayTeamID: 15, HomeTeam: getTeamByID(2), AwayTeam: getTeamByID(15),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-28 15:00"), Venue: "Emirates Stadium",
		},
		{
			ID: 32, Round: 6, HomeTeamID: 5, AwayTeamID: 8, HomeTeam: getTeamByID(5), AwayTeam: getTeamByID(8),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-28 15:00"), Venue: "Stamford Bridge",
		},
		{
			ID: 33, Round: 6, HomeTeamID: 19, AwayTeamID: 3, HomeTeam: getTeamByID(19), AwayTeam: getTeamByID(3),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-28 17:30"), Venue: "Molineux Stadium",
		},
		{
			ID: 34, Round: 6, HomeTeamID: 12, AwayTeamID: 6, HomeTeam: getTeamByID(12), AwayTeam: getTeamByID(6),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-29 16:30"), Venue: "Old Trafford",
		},
		{
			ID: 35, Round: 6, HomeTeamID: 13, AwayTeamID: 20, HomeTeam: getTeamByID(13), AwayTeam: getTeamByID(20),
			HomeScore: nil, AwayScore: nil, Status: "SCHEDULED", MatchDate: parseTime("2026-09-30 20:00"), Venue: "Vitality Stadium",
		},
	}
}

var SeedPlayers = []models.Player{
	{ID: 1, TeamID: 1, TeamName: "Manchester City", TeamCode: "MCI", Name: "Erling Haaland", Position: "FW", Number: 9, Nationality: "Norway", Goals: 10, Assists: 1, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=150&auto=format&fit=crop&q=80"},
	{ID: 2, TeamID: 3, TeamName: "Liverpool", TeamCode: "LIV", Name: "Luis Diaz", Position: "FW", Number: 7, Nationality: "Colombia", Goals: 5, Assists: 1, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80"},
	{ID: 3, TeamID: 3, TeamName: "Liverpool", TeamCode: "LIV", Name: "Mohamed Salah", Position: "FW", Number: 11, Nationality: "Egypt", Goals: 3, Assists: 4, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80"},
	{ID: 4, TeamID: 5, TeamName: "Chelsea", TeamCode: "CHE", Name: "Nicolas Jackson", Position: "FW", Number: 15, Nationality: "Senegal", Goals: 4, Assists: 2, YellowCards: 2, RedCards: 0, Photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80"},
	{ID: 5, TeamID: 5, TeamName: "Chelsea", TeamCode: "CHE", Name: "Cole Palmer", Position: "MF", Number: 20, Nationality: "England", Goals: 2, Assists: 4, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=150&auto=format&fit=crop&q=80"},
	{ID: 6, TeamID: 11, TeamName: "Brentford", TeamCode: "BRE", Name: "Bryan Mbeumo", Position: "FW", Number: 19, Nationality: "Cameroon", Goals: 4, Assists: 1, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80"},
	{ID: 7, TeamID: 4, TeamName: "Aston Villa", TeamCode: "AVL", Name: "Ollie Watkins", Position: "FW", Number: 11, Nationality: "England", Goals: 3, Assists: 2, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=150&auto=format&fit=crop&q=80"},
	{ID: 8, TeamID: 4, TeamName: "Aston Villa", TeamCode: "AVL", Name: "Jhon Duran", Position: "FW", Number: 9, Nationality: "Colombia", Goals: 4, Assists: 0, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80"},
	{ID: 9, TeamID: 2, TeamName: "Arsenal", TeamCode: "ARS", Name: "Kai Havertz", Position: "FW", Number: 29, Nationality: "Germany", Goals: 2, Assists: 1, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80"},
	{ID: 10, TeamID: 2, TeamName: "Arsenal", TeamCode: "ARS", Name: "Bukayo Saka", Position: "FW", Number: 7, Nationality: "England", Goals: 1, Assists: 5, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=150&auto=format&fit=crop&q=80"},
	{ID: 11, TeamID: 6, TeamName: "Tottenham Hotspur", TeamCode: "TOT", Name: "Son Heung-min", Position: "FW", Number: 7, Nationality: "South Korea", Goals: 2, Assists: 2, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=150&auto=format&fit=crop&q=80"},
	{ID: 12, TeamID: 8, TeamName: "Brighton & Hove Albion", TeamCode: "BHA", Name: "Danny Welbeck", Position: "FW", Number: 18, Nationality: "England", Goals: 3, Assists: 1, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80"},
	{ID: 13, TeamID: 9, TeamName: "Nottingham Forest", TeamCode: "NFO", Name: "Chris Wood", Position: "FW", Number: 11, Nationality: "New Zealand", Goals: 3, Assists: 0, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80"},
	{ID: 14, TeamID: 7, TeamName: "Newcastle United", TeamCode: "NEW", Name: "Alexander Isak", Position: "FW", Number: 14, Nationality: "Sweden", Goals: 1, Assists: 1, YellowCards: 0, RedCards: 0, Photo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80"},
	{ID: 15, TeamID: 12, TeamName: "Manchester United", TeamCode: "MUN", Name: "Alejandro Garnacho", Position: "FW", Number: 17, Nationality: "Argentina", Goals: 1, Assists: 1, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=150&auto=format&fit=crop&q=80"},
	{ID: 16, TeamID: 1, TeamName: "Manchester City", TeamCode: "MCI", Name: "Kevin De Bruyne", Position: "MF", Number: 17, Nationality: "Belgium", Goals: 1, Assists: 2, YellowCards: 1, RedCards: 0, Photo: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=150&auto=format&fit=crop&q=80"},
}

var SeedPhotos = []models.Photo{
	{
		ID:           1,
		Title:        "Haaland Thunderous Strike",
		Category:     "Match Action",
		ImageURL:     "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80",
		Description:  "Erling Haaland unleashes a powerful volley inside the penalty box during the Manchester derby at the Etihad Stadium.",
		UploaderName: "Premier Lens",
		CreatedAt:    parseTime("2026-09-15 16:45"),
		Likes:        142,
	},
	{
		ID:           2,
		Title:        "Anfield Under The Floodlights",
		Category:     "Stadiums",
		ImageURL:     "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1000&auto=format&fit=crop&q=80",
		Description:  "The Kop singing 'You'll Never Walk Alone' under dazzling European night floodlights at historic Anfield.",
		UploaderName: "Liverpool Echo",
		CreatedAt:    parseTime("2026-09-18 20:15"),
		Likes:        215,
	},
	{
		ID:           3,
		Title:        "Trophy Lift Fireworks Celebration",
		Category:     "Celebrations",
		ImageURL:     "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1000&auto=format&fit=crop&q=80",
		Description:  "Confetti rains down across the pitch as the champions raise the Premier League trophy into the night sky.",
		UploaderName: "PitchPulse Media",
		CreatedAt:    parseTime("2026-05-24 19:30"),
		Likes:        389,
	},
	{
		ID:           4,
		Title:        "North London Derby Atmosphere",
		Category:     "Fans & Atmosphere",
		ImageURL:     "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80",
		Description:  "Supporters unfurling massive banners and roaring as the players walk out of the tunnel for kick-off.",
		UploaderName: "Arteta's Army",
		CreatedAt:    parseTime("2026-09-12 14:00"),
		Likes:        178,
	},
	{
		ID:           5,
		Title:        "Midfield Battle at Stamford Bridge",
		Category:     "Match Action",
		ImageURL:     "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=1000&auto=format&fit=crop&q=80",
		Description:  "A fiercely contested sliding challenge on a rain-slicked surface under the West London lights.",
		UploaderName: "Blue Blood",
		CreatedAt:    parseTime("2026-09-08 17:15"),
		Likes:        95,
	},
	{
		ID:           6,
		Title:        "St. James' Park Sunset Panorama",
		Category:     "Stadiums",
		ImageURL:     "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=1000&auto=format&fit=crop&q=80",
		Description:  "The imposing Milburn and Leazes stands glowing during golden hour before an electric weekend clash.",
		UploaderName: "Geordie Nation",
		CreatedAt:    parseTime("2026-09-02 18:30"),
		Likes:        164,
	},
}
