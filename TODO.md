## Layout Navigation Refactor (Floating SaaS Shell)

### Steps
- [ ] Create new layout components in `frontend/src/components/layout/`:
  - [ ] `AppLayout.jsx`
  - [ ] `FloatingNavigation.jsx`
  - [ ] `NavigationMenu.jsx` (single source of truth nav items)
  - [ ] `NavigationActions.jsx`
  - [ ] `MobileDrawer.jsx`
  - [ ] `PageHeader.jsx`
- [ ] Refactor `frontend/src/pages/Dashboard.jsx`:
  - [ ] Remove `Sidebar` and `MainHeader` usage
  - [ ] Remove duplicated responsive/sidebar state (keep websocket/snapshot/history logic unchanged)
  - [ ] Wire view selection to the new navigation components
- [ ] Ensure active indicator, hover animation, smooth transitions
- [ ] Ensure floating nav remains visible while scrolling (sticky + card styling)
- [ ] Ensure desktop nav does not touch browser edges; mobile drawer opens from left with rounded corners + shadow
- [ ] Run frontend dev build to validate (npm run dev / npm test if available)

