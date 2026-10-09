package main

import (
	"fmt"
	"football-backend/db"
	"football-backend/handlers"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPortStr := os.Getenv("DB_PORT")
	dbPort := 3306
	if dbPortStr != "" {
		if p, err := strconv.Atoi(dbPortStr); err == nil {
			dbPort = p
		}
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "footballdb"
	}

	// Initialize data store & connect to MySQL if credentials supplied
	log.Printf("Initializing Football Backend Store...")
	store := db.InitStore(dbHost, dbPort, dbUser, dbPassword, dbName)
	dbStatus := store.GetDBStatus()
	if dbStatus.Connected {
		log.Printf("✅ MySQL Connected successfully to %s:%d/%s", dbHost, dbPort, dbName)
	} else {
		log.Printf("ℹ️  MySQL Notice: %s", dbStatus.Message)
		log.Printf("ℹ️  Store is active with built-in football data. You can connect to MySQL anytime via UI or .env.")
	}

	mux := http.NewServeMux()

	// API Routes
	mux.HandleFunc("/api/standings", handlers.GetStandingsHandler)
	mux.HandleFunc("/api/results", handlers.GetResultsHandler)
	mux.HandleFunc("/api/fixtures", handlers.GetFixturesHandler)
	mux.HandleFunc("/api/stats/top-scorers", handlers.GetTopScorersHandler)
	mux.HandleFunc("/api/db/status", handlers.GetDBStatusHandler)
	mux.HandleFunc("/api/db/connect", handlers.ConnectDBHandler)

	// Matches route (supports /api/matches for POST, /api/matches/{id} for GET)
	mux.HandleFunc("/api/matches", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handlers.CreateMatchHandler(w, r)
		} else {
			handlers.GetResultsHandler(w, r)
		}
	})
	mux.HandleFunc("/api/matches/", handlers.GetMatchHandler)

	// Teams routes (supports /api/teams and /api/teams/{id})
	mux.HandleFunc("/api/teams", handlers.TeamsHandler)
	mux.HandleFunc("/api/teams/", handlers.TeamsHandler)

	// Photos & Gallery routes
	mux.HandleFunc("/api/photos", handlers.PhotosHandler)
	mux.HandleFunc("/api/photos/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/like") {
			handlers.LikePhotoHandler(w, r)
		} else {
			handlers.PhotosHandler(w, r)
		}
	})

	// Frontend static assets & SPA fallback
	frontendDist := "../frontend/dist"
	if _, err := os.Stat(frontendDist); err == nil {
		fs := http.FileServer(http.Dir(frontendDist))
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/api") {
				handlers.JSONError(w, http.StatusNotFound, "Endpoint not found")
				return
			}
			filePath := frontendDist + r.URL.Path
			if _, err := os.Stat(filePath); err == nil && r.URL.Path != "/" {
				fs.ServeHTTP(w, r)
				return
			}
			// Serve index.html for client-side routing
			http.ServeFile(w, r, frontendDist+"/index.html")
		})
	} else {
		// Root health check / status if dist not yet built
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/api") {
				handlers.JSONError(w, http.StatusNotFound, "Endpoint not found")
				return
			}
			handlers.JSONResponse(w, http.StatusOK, map[string]interface{}{
				"service":   "Football Hub Go API",
				"status":    "online",
				"version":   "1.0.0",
				"db_status": db.GlobalStore.GetDBStatus(),
			})
		})
	}

	handler := corsMiddleware(mux)

	serverAddr := ":" + port
	fmt.Println("========================================================")
	fmt.Printf("⚽ Football Hub Backend is running on http://localhost:%s\n", port)
	fmt.Printf("📊 Endpoints ready: /api/standings, /api/results, /api/fixtures, /api/teams\n")
	fmt.Println("========================================================")

	if err := http.ListenAndServe(serverAddr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
