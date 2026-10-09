# How to Put PitchPulse Online 🌐

Here are the two best ways to make your football website accessible online to anyone in the world:

---

## ⚡ Option 1: Instant Public Link (Live in 30 Seconds)
*Best for testing, showing friends, or opening on your phone immediately while your computer is on.*

1. Make sure your server is running (double-click `start.bat`).
2. Double-click **`share_online.bat`** in your project folder.
3. It will generate a public HTTPS URL (for example: `https://cool-football-hub.loca.lt`).
4. Open that URL on your phone or send it to anyone!
   - *Note: On the first visit to a `localtunnel` link, it may ask for your public IP as a security check (displayed in terminal or visit https://ipv4.icanhazip.com).*

---

## ☁️ Option 2: Permanent 24/7 Cloud Hosting (Always Online Free)
*Best if you want the website running 24/7 in the cloud, even when your computer is turned off.*

### Step 1: Push Code to GitHub
1. Create a free account at [github.com](https://github.com).
2. Create a new repository named `football-hub`.
3. In VS Code terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of PitchPulse football website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/football-hub.git
   git push -u origin main
   ```

### Step 2: Deploy Free on Render.com
1. Sign up at [render.com](https://render.com) (free).
2. Click **New +** ➔ **Web Service**.
3. Select your `football-hub` GitHub repository.
4. Render will automatically detect the **`Dockerfile`** we created.
5. Click **Deploy Web Service**!
6. Render gives you a permanent, free domain like:
   `https://pitchpulse-football.onrender.com`

### Step 3: Free Cloud MySQL Database (Optional)
If you want a live cloud database instead of local MySQL:
- Create a free MySQL database on [Aiven.io](https://aiven.io) or [Railway.app](https://railway.app).
- In Render Dashboard under **Environment Variables**, set:
  - `DB_HOST`: your cloud database host
  - `DB_PORT`: 3306
  - `DB_USER`: your cloud user
  - `DB_PASSWORD`: your cloud password
  - `DB_NAME`: footballdb
- The Go backend will automatically run migrations and populate all tables on your cloud database!
