# PitchPulse ⚽ - Premier Football Hub

A modern, full-stack football web application built with **React (JavaScript/Vite)**, **Go (Golang)** REST API, and **MySQL Database**.

---

## 🌟 Key Features

1. **🏆 League Standings (1st to Last)**
   - Complete table ranking all 20 teams from **1st to 20th**.
   - Live calculated points, matches played, won, drawn, lost, goals for, goals against, and goal difference.
   - Interactive sorting on any column (Points, GD, Goals, Alphabetical).
   - Form guide indicator badges (`W`, `D`, `L` for the last 5 matches).
   - Color-coded UEFA Champions League, Europa League, and Relegation zones.

2. **📅 Past Match Results & Archive**
   - Historical scores and event timelines across matchdays.
   - Filter by Matchday / Round (Round 1, Round 2, Round 3, etc.).
   - Filter by Club or search by player scorer, club, or venue.
   - Detailed **Match Center Modal** with goal scorers, minute timestamps, cards (🟨 🟥), and head-to-head statistics (possession %, shots, corners, fouls).

3. **⚽ Upcoming Fixtures & Schedule**
   - Upcoming matches with venues and kick-off times.
   - "Record Score" quick button to simulate or record match results.

4. **🛡️ Clubs Directory & Squad Rosters**
   - Profiles for all 20 Premier League clubs (stadium, manager, founded year, city).
   - Click to open full squad roster modal with jersey numbers, positions, and player statistics.

5. **👟 Top Scorers & Golden Boot**
   - 1st, 2nd, 3rd podium showcase.
   - Full statistical leaderboard with goals, assists, and disciplinary cards.

6. **➕ Record New Match Result**
   - Form to submit new match results with goal scorers.
   - Instantly recalculates league standings and updates the UI in real time.

7. **🔌 MySQL Database Integration & Settings**
   - Seamlessly integrates with MySQL on `localhost:3306`.
   - In-app **DB Settings Modal** allows you to test and connect with your MySQL credentials on the fly.
   - When connected, automatically creates database `footballdb` and tables (`teams`, `matches`, `match_events`, `players`), then seeds full league data.
   - Resilient fallback engine ensures the entire application runs smoothly out-of-the-box.

---

## 🚀 Quick Start Guide

### 1. Start the Go Backend
```bash
cd backend
go run main.go
```
The Go backend will start at: `http://localhost:8080`

### 2. Start the React Frontend (Dev Mode)
In a new terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

*(Note: The Go backend also directly serves the built React app from `http://localhost:8080`!)*

---

## 🗄️ MySQL Connection Configuration

In `backend/.env`:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=footballdb
```

You can also click the **"DB Settings"** button in the navigation header inside the website at any time to enter your password and connect with 1 click!

---

## 🧪 Testing

To run the automated backend test suite:
```bash
cd backend
go test -v ./...
```
To test frontend production build:
```bash
cd frontend
npm run build
```
