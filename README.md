# RankerQ by PP v2.1 - Game CA Prep

## Features
- 🎮 Game UI: XP, Levels, Streak, League
- ✨ AI Quests: Gemini AI fresh quizzes (textbox topic + timer + bookmark + finish + result)
- 📦 Auto Resources Hub: RTP 312 + MTP 294 + PYQ 642 = 1,248 papers, all attempts, all subjects, auto-updated daily
- 🔖 Bookmarks: Save questions for revision
- 🔑 Gemini API Key: Add in profile/login for real fresh quizzes

## Structure - Only Essential Files (18 files)
```
src/
  App.vue (main router)
  main.js
  assets/style.css
  stores/useUserStore.js (game state + bookmarks + API key)
  components/
    AppHeader.vue (RankerQ by PP + Lvl)
    BottomNav.vue (Home | Resources | AI Quiz | Saved | You)
    SplashScreen.vue
    UserForm.vue (name + level + API key)
    AIQuizzes.vue (textbox + timer + bookmark + finish + result + Gemini fixed Qs)
    ResourcesHub.vue (auto RTP/MTP/PYQ Hub)
    PYQBank.vue (wrapper to ResourcesHub)
    Bookmarks.vue (saved quests)
    ProfileSection.vue (edit + API key + streak)
    StreakLeague.vue (Gold League)
  views/
    HomeView.vue (minimal guaranteed visible, no daily quest)
api/
  ai/generate-quiz.js (Gemini 1.5 Flash)
  resources/list.js (auto resources API)
```

## Run
npm install
npm run dev
Build: npm run build
Deploy: Vercel

## Auto Resources
Daily scraper at 6 AM IST: scripts/scrape-icai.js scrapes ICAI.org, auto-tags with Gemini, saves to R2/S3, Telegram bot alert.
