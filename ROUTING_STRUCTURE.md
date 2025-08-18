# AviShifo Routing Structure

## Overview
This document describes the new role-based routing structure for the AviShifo application. The application now uses proper Next.js routing instead of state-based navigation, providing better URL management, browser history support, and SEO capabilities.

## Role-Based Routing

### 1. Authentication Flow
- **Route**: `/` (root)
- **Component**: `LoginPage`
- **Purpose**: Main entry point for all users, handles authentication and role-based redirection

### 2. Doctor Dashboard
**Base Route**: `/dashboard/doctor`

#### Available Routes:
- `/dashboard/doctor` - Main doctor dashboard
- `/dashboard/doctor/profile` - Doctor profile management
- `/dashboard/doctor/ai-chat` - AI chat interface
- `/dashboard/doctor/appointments` - Patient appointments management
- `/dashboard/doctor/patients` - Patient history and management
- `/dashboard/doctor/chat` - Chat interface
- `/dashboard/doctor/who-standards` - WHO standards reference

#### Layout:
- **File**: `components/app/dashboard/doctor/layout.tsx`
- **Features**: 
  - Sidebar navigation
  - Role-based authentication
  - Responsive design
  - Active section highlighting

### 3. Patient Dashboard
**Base Route**: `/dashboard/patient`

#### Available Routes:
- `/dashboard/patient` - Main patient dashboard
- `/dashboard/patient/profile` - Patient profile management
- `/dashboard/patient/appointments` - Patient's own appointments
- `/dashboard/patient/chat` - Chat interface
- `/dashboard/patient/documents` - Document management

#### Layout:
- **File**: `components/app/dashboard/patient/layout.tsx`
- **Features**:
  - Sidebar navigation
  - Role-based authentication
  - Responsive design
  - Active section highlighting

### 4. Super Admin Dashboard
**Base Route**: `/dashboard/super-admin`

#### Available Routes:
- `/dashboard/super-admin` - Main overview dashboard
- `/dashboard/super-admin/crm` - Customer relationship management
- `/dashboard/super-admin/chat` - Chat center management
- `/dashboard/super-admin/observation` - System observation
- `/dashboard/super-admin/requests` - Request monitoring

#### Layout:
- **File**: `components/app/dashboard/super-admin/layout.tsx`
- **Features**:
  - Sidebar navigation
  - Role-based authentication
  - Responsive design
  - Active section highlighting

### 5. Public Routes
- `/doctors` - Public doctors listing (accessible to all authenticated users)

## Authentication & Authorization

### Token Management
- **Storage**: LocalStorage for `accessToken` and `refreshToken`
- **Validation**: API calls to `/api/accounts/profile/` to verify user role
- **Auto-redirect**: Unauthorized users are automatically redirected to login

### Role Verification
Each protected route includes:
1. Token validation
2. User role verification
3. Automatic redirection for unauthorized access

## Navigation Structure

### Sidebar Navigation
Each dashboard includes a sidebar with:
- Role-specific navigation items
- Active section highlighting
- Responsive design for mobile devices
- Logout functionality
- Help section

### URL-Based Navigation
- Navigation state is now tied to URL paths
- Browser back/forward buttons work correctly
- Direct URL access to specific sections
- Bookmarkable URLs

## Benefits of New Structure

### 1. Better User Experience
- Direct URL access to specific sections
- Browser history support
- Bookmarkable pages
- Shareable URLs

### 2. Improved SEO
- Proper URL structure
- Meta tags per page
- Better search engine indexing

### 3. Enhanced Security
- Role-based route protection
- Automatic authentication checks
- Secure token validation

### 4. Maintainability
- Clear separation of concerns
- Reusable layout components
- Consistent authentication patterns
- Easy to add new routes

## File Structure

```
components/app/
├── page.tsx                    # Main login/redirect page
├── dashboard/
│   ├── doctor/
│   │   ├── layout.tsx         # Doctor dashboard layout
│   │   ├── page.tsx           # Main doctor dashboard
│   │   ├── profile/
│   │   │   └── page.tsx       # Doctor profile page
│   │   ├── ai-chat/
│   │   │   └── page.tsx       # AI chat page
│   │   ├── appointments/
│   │   │   └── page.tsx       # Appointments page
│   │   └── patients/
│   │       └── page.tsx       # Patients page
│   ├── patient/
│   │   ├── layout.tsx         # Patient dashboard layout
│   │   ├── page.tsx           # Main patient dashboard
│   │   └── profile/
│   │       └── page.tsx       # Patient profile page
│   └── super-admin/
│       ├── layout.tsx         # Super admin layout
│       ├── page.tsx           # Main super admin dashboard
│       ├── crm/
│       │   └── page.tsx       # CRM page
│       ├── chat/
│       │   └── page.tsx       # Chat center page
│       ├── observation/
│       │   └── page.tsx       # Observation page
│       └── requests/
│           └── page.tsx       # Requests monitoring page
└── doctors/
    └── page.tsx               # Public doctors listing
```

## Usage Examples

### Adding a New Doctor Route
1. Create a new folder under `/dashboard/doctor/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `layout.tsx`
4. Add authentication checks

### Adding a New Role
1. Create a new dashboard folder under `/dashboard/`
2. Create a layout component with navigation
3. Add role verification logic
4. Update the main page redirects

## Migration Notes

### From State-Based Navigation
- Old: `useState` for active sections
- New: `usePathname()` for URL-based navigation
- Old: Component switching in main dashboard
- New: Individual route pages with layouts

### Benefits
- Better performance (no unnecessary re-renders)
- Improved user experience
- Better SEO capabilities
- Easier debugging and testing

## Security Considerations

### Route Protection
- All dashboard routes include authentication checks
- Role verification on every page load
- Automatic token validation
- Secure logout functionality

### Token Security
- Tokens stored in localStorage
- Automatic cleanup on logout
- API validation on each request
- Secure redirect handling
