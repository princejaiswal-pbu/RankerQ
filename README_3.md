# CA Series - Telegram Mini App

Light green + white professional theme for CA Foundation / Intermediate students.

## Tech Stack
- Vue 3 (Composition API) + Vite
- Tailwind CSS
- Telegram WebApp SDK

## Project Structure
```
/src
  /components
    SplashScreen.vue   - Splash with logo + loader
    UserForm.vue       - Name + Level dropdown (Foundation/Intermediate)
    AppHeader.vue      - Top bar with level badge
    BottomNav.vue      - Home / Rank / Doubts / You
    QuizCard.vue       - Today's quiz card
    DoubtsCard.vue     - Full doubts view with filter
    Leaderboard.vue    - Podium + list
    ProfileSection.vue - Avatar, stats, menu
  /views
    HomeView.vue       - Greeting + stats + cards
  /stores
    useUserStore.js    - LocalStorage user persistence
  /assets
    style.css          - Tailwind + custom
  App.vue              - Root router (splash -> form -> main)
  main.js              - Telegram init
```

## Setup
```bash
npm install
npm run dev   # http://localhost:3000
```

## Telegram Mini App Integration
1. Host build (`npm run build`) on your domain
2. In BotFather: /newapp -> set URL to hosted link
3. The app auto calls `Telegram.WebApp.ready()` and `expand()`

## Features Covered
- ✅ Splash Screen (2.5s auto + tap to skip)
- ✅ User Form (name + dropdown level)
- ✅ Quiz Card (progress, XP, CTA)
- ✅ Doubts Card (ask + list + status)
- ✅ Leaderboard (weekly/monthly, podium, current user)
- ✅ Profile Section (stats, menu)
- ✅ Bottom nav with Telegram blur style

Theme: light green #F0FDF4 bg, #16A34A primary, white cards, soft shadows.
