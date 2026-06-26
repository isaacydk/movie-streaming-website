# Netflix-Style Movie App Rebuild Plan

## Summary
Rebuild the existing Vite + React app in `movie-streaming ai/` into a Netflix-inspired movie streaming homepage using the provided screenshot as layout reference: dark background, red accent theme, top navigation, centered search bar, hero welcome area, and horizontal movie rows. Rename the current `About` navigation/page concept to `Favorites`.

## Key Changes
- Replace the Vite starter UI in `src/App.jsx`, `src/App.css`, and `src/index.css` with a movie streaming interface.
- Use a clean scalable structure:
  - `src/components/` for shared UI like `Navbar`, `SearchBar`, `MovieCard`, `MovieRow`, `HeroSection`
  - `src/pages/` for `Home`, `Favorites`, and `Contact`
  - `src/data/` for starter movie lists and ratings
  - `src/assets/` for local images/logos if added later
  - `src/styles/` for global theme and layout CSS if the app grows
- Make the theme Netflix-like:
  - black/dark charcoal background
  - red primary accent, hover states, buttons, and active nav
  - white/gray text hierarchy
  - poster cards with ratings and titles
- Change navigation from `Home / About / Contact` to `Home / Favorites / Contact`.
- Build the first version without needing an API key: use local static movie data with poster image URLs or local assets, structured so it can later be swapped for TMDB/API data.

## Interface Behavior
- `Home` shows:
  - sticky top navbar
  - brand name/logo
  - search input with icon
  - hero welcome text
  - horizontal movie rows such as `Popular`, `Trending`, and `Top Rated`
  - `View All` buttons as presentational controls for now
- `Favorites` shows a clean empty/saved-movies page using the same red/dark theme.
- `Contact` keeps a simple themed contact section.
- Movie cards include poster, title, and rating badge.

## Test Plan
- Run `npm run build` to confirm the Vite React app compiles.
- Run `npm run lint` if existing ESLint config supports the new code.
- Start `npm run dev` and visually check:
  - desktop layout matches the screenshot structure
  - mobile layout stacks cleanly
  - nav label says `Favorites`, not `About`
  - movie rows scroll or wrap without broken spacing
  - no starter Vite content remains

## Assumptions
- This is a frontend-only rebuild for now, not a real streaming backend.
- Favorites can be a static page placeholder in v1, with state/localStorage support added later.
- No new dependency is required unless routing is desired; if routing is added, use `react-router-dom`.
