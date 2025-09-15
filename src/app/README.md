# EcoSort App Routing Structure

This document outlines the modular routing structure implemented for the EcoSort application.

## Base Structure

All app routes are enclosed under: `/app`

## Router Modules

### 1. User & Employee Router (`/app/user-employee`)

**Base path:** `/app/user-employee`

**Routes:**
- `/app/user-employee/user` → All user routes:
  - `/app/user-employee/user/dashboard` - User dashboard
  - `/app/user-employee/user/profile` - User profile
  - `/app/user-employee/user/scan` - Waste scanning
  - `/app/user-employee/user/leaderboard` - Leaderboard (TODO)
  - `/app/user-employee/user/rewards` - Rewards (TODO)
  - `/app/user-employee/user/settings` - Settings (TODO)
  - `/app/user-employee/user/support` - Support (TODO)

- `/app/user-employee/employee` → All employee routes (TODO – under maintenance)
- `/app/user-employee/login` → Combined login for user & employee
- `/app/user-employee/register-user` → User registration
- `/app/user-employee/register-employee` → Employee registration (TODO)
- `/app/user-employee/` → Home page for user & employee

### 2. Manager Router (`/app/manager`)

**Base path:** `/app/manager`

**Routes:**
- `/app/manager/login` → Manager login
- `/app/manager/register` → Manager registration
- `/app/manager/dashboard` → Manager dashboard with sub-routes:
  - `/app/manager/dashboard` - Dashboard overview
  - Zones management
  - Employee management
  - Task assignment
  - Analytics
  - Issues management
  - Notifications
  - Reports

### 3. Admin Router (`/app/admin`)

**Base path:** `/app/admin`

**Routes:**
- `/app/admin/login` → Admin login (TODO – under maintenance)
- `/app/admin/dashboard` → Admin dashboard (TODO – under maintenance)
- `/app/admin/` → Admin portal home

### 4. API Router (`/app/api`)

**Base path:** `/app/api`

**Routes:**
- `/app/api/*` → All API routes (moved from `/api/*`)

### 5. Seed Router (`/app/seed`)

**Base path:** `/app/seed`

**Routes:**
- `/app/seed/*` → All seed routes (moved from `/seed/*`)

### 6. Debug Router (`/app/debug`)

**Base path:** `/app/debug`

**Routes:**
- `/app/debug/*` → All debug routes (moved from `/debug/*`)

## Key Features

### 1. Modular Design
- Each router is self-contained with its own pages and components
- Clear separation of concerns between different user types
- Easy to maintain and extend

### 2. Consistent Navigation
- All routes follow a predictable pattern
- Easy to understand URL structure
- Backward compatibility maintained where possible

### 3. Future-Ready
- TODO routes are clearly marked and ready for implementation
- Placeholder pages for under-development features
- Scalable structure for adding new modules

### 4. User Experience
- Intuitive navigation between modules
- Clear visual indicators for coming soon features
- Consistent design language across all modules

## Migration Notes

### API Endpoints
All API endpoints have been moved from `/api/*` to `/app/api/*`:
- `/api/auth/user/*` → `/app/api/auth/user/*`
- `/api/auth/manager/*` → `/app/api/auth/manager/*`
- `/api/user/*` → `/app/api/user/*`
- `/api/manager/*` → `/app/api/manager/*`
- `/api/seed` → `/app/api/seed`

### Navigation Updates
All internal navigation has been updated to use the new paths:
- User dashboard: `/user/dashboard` → `/app/user-employee/user/dashboard`
- Manager dashboard: `/manager/dashboard` → `/app/manager/dashboard`
- Login pages: `/login` → `/app/user-employee/login`

### File Structure
```
src/app/app/
├── user-employee/
│   ├── user/           # User-specific pages
│   ├── employee/       # Employee pages (TODO)
│   ├── login/          # Combined login
│   ├── register-user/  # User registration
│   └── register-employee/ # Employee registration (TODO)
├── manager/
│   ├── login/          # Manager login
│   ├── register/       # Manager registration
│   └── dashboard/      # Manager dashboard
├── admin/
│   ├── login/          # Admin login (TODO)
│   └── dashboard/      # Admin dashboard (TODO)
├── api/                # All API routes
├── seed/               # Database seeding
├── debug/              # Debug tools
└── page.tsx            # Main app portal
```

## Benefits

1. **Clean Organization**: Each module has its own space and purpose
2. **Easy Maintenance**: Changes to one module don't affect others
3. **Scalability**: Easy to add new modules or extend existing ones
4. **User Clarity**: Users can easily understand where they are in the app
5. **Developer Experience**: Clear structure makes development more efficient

## Next Steps

1. Complete TODO routes (leaderboard, rewards, settings, support)
2. Implement employee portal functionality
3. Complete admin portal features
4. Add comprehensive testing for all routes
5. Implement proper error handling and loading states
6. Add route guards and authentication middleware
