# DCMS Frontend - Next.js Application

## 📌 Overview
The DCMS Frontend is a modern web application built with Next.js 14, React, and TypeScript. It provides a responsive user interface for content management with secure authentication, role-based access control, and real-time article management capabilities.

## 🚀 Key Features
- **User Authentication**: Secure login and registration with JWT tokens
- **Automatic Token Refresh**: Seamless authentication experience with axios interceptors
- **Role-Based UI**: Dynamic interface based on user role (USER/ADMIN)
- **Article Management**: Browse, create, edit, and delete articles
- **Real-time Updates**: Instant UI updates after CRUD operations
- **Protected Routes**: Automatic redirection for unauthorized users
- **Responsive Design**: Mobile-friendly layout with modern CSS
- **Form Validation**: Client-side validation with HTML5 and custom logic

## 🛠️ Installation & Setup

### 1️⃣ Navigate to Frontend Directory
```sh
cd frontend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Environment Setup
Copy the environment template and configure:
```sh
# On Windows
copy .env.local.example .env.local

# On Mac/Linux
cp .env.local.example .env.local
```

### 4️⃣ Configure Environment Variables
Edit `.env.local` with your settings:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Environment Variables Explained:**
- `NEXT_PUBLIC_API_URL`: Backend API base URL (must start with `NEXT_PUBLIC_` to be available in browser)

### 5️⃣ Run the Development Server
```sh
npm run dev
```
> Frontend runs on [http://localhost:3001](http://localhost:3001)

**Note**: Ensure the backend is running on port 3000 before starting the frontend.

## 🧪 Testing the Application

### User Flow Testing

**1. Registration:**
- Navigate to `http://localhost:3001/register`
- Enter email and password (min 6 characters)
- Confirm password
- Click "Register"
- Automatically logged in and redirected to home

**2. Login:**
- Navigate to `http://localhost:3001/login`
- Enter registered credentials
- Click "Login"
- Redirected to home page with article list

**3. View Articles (Regular User):**
- See only published articles
- View article details (title, content, author, date)
- No create, edit, or delete options

**4. Admin Functions:**
- Login as admin user
- See "Create Article" button in navbar
- View all articles (published and drafts)
- Filter articles by status (All, Published, Drafts)
- Create, edit, delete, publish/unpublish articles

### Manual Testing Scenarios

**Test Authentication:**
- Logout and verify redirect to login page
- Try accessing `/articles/create` without login (should redirect)
- Login and verify access granted

**Test Token Refresh:**
- Wait 15+ minutes after login
- Perform any action (token auto-refreshes)
- Verify no logout occurs

**Test Role-Based Access:**
- Login as regular user
- Verify "Create Article" button not visible
- Try manually accessing `/articles/create` (redirects to home)

## 📂 Project Structure
```
frontend/
├── app/                              # Next.js App Router
│   ├── articles/                     # Article Pages
│   │   ├── create/                   # Create Article Page
│   │   │   └── page.tsx             # Admin-only article creation form
│   │   └── edit/[id]/               # Edit Article Page (Dynamic Route)
│   │       └── page.tsx             # Admin-only article editing form
│   ├── login/                        # Login Page
│   │   └── page.tsx                 # User login form
│   ├── register/                     # Registration Page
│   │   └── page.tsx                 # User registration form
│   ├── layout.tsx                    # Root layout (wraps all pages)
│   ├── page.tsx                      # Home page (article list)
│   └── globals.css                   # Global styles
│
├── lib/                              # Utility Libraries
│   ├── api.ts                        # Axios API client & interceptors
│   └── auth.ts                       # Authentication helper functions
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── next-env.d.ts                     # Next.js TypeScript declarations
├── .env.local                        # Environment variables (create from .env.local.example)
├── .env.local.example               # Environment variables template
└── README.md                         # This file
```

## 📚 File Descriptions

### Pages (`app/`)

**`app/page.tsx` - Home Page / Article List**
- Main landing page after login
- Displays all articles (filtered by role)
- Admin: filter by All/Published/Drafts
- Admin: Edit, Delete, Publish/Unpublish buttons
- Handles authentication check and redirect

**`app/login/page.tsx` - Login Page**
- Login form with email and password
- Client-side validation
- Calls `/auth/login` endpoint
- Stores tokens in localStorage
- Redirects to home on success

**`app/register/page.tsx` - Registration Page**
- Registration form with email, password, confirm password
- Password matching validation
- Minimum length validation
- Calls `/auth/register` endpoint
- Auto-login after successful registration

**`app/articles/create/page.tsx` - Create Article Page**
- Protected route (admin only)
- Article creation form (title, content, publish checkbox)
- Calls `POST /articles` endpoint
- Redirects to home after creation

**`app/articles/edit/[id]/page.tsx` - Edit Article Page**
- Protected route (admin only)
- Dynamic route with article ID
- Loads existing article data
- Update form with pre-filled values
- Calls `PATCH /articles/:id` endpoint

**`app/layout.tsx` - Root Layout**
- Wraps all pages
- Sets up HTML structure
- Applies global font (Inter)
- Manages metadata (title, description)

### Libraries (`lib/`)

**`lib/api.ts` - API Client**
- Axios instance with base URL
- Request interceptor: Adds JWT token to headers
- Response interceptor: Auto-refreshes expired tokens
- API methods for authentication and articles
- TypeScript interfaces for data types

**`lib/auth.ts` - Authentication Helpers**
- `setAuthData()`: Saves tokens and user to localStorage
- `getUser()`: Retrieves user from localStorage
- `clearAuthData()`: Removes all auth data (logout)
- `isAuthenticated()`: Checks if user is logged in
- `isAdmin()`: Checks if user has admin role

## 🌐 Page Routes

| Route | Component | Description | Auth | Role |
|-------|-----------|-------------|------|------|
| `/` | `app/page.tsx` | Home page with article list | Required | Any |
| `/login` | `app/login/page.tsx` | User login | No | - |
| `/register` | `app/register/page.tsx` | User registration | No | - |
| `/articles/create` | `app/articles/create/page.tsx` | Create new article | Required | ADMIN |
| `/articles/edit/[id]` | `app/articles/edit/[id]/page.tsx` | Edit article | Required | ADMIN |

## 🔧 Development Commands

```sh
# Development
npm run dev            # Start development server on port 3001
npm run dev --port 3002 # Start on custom port

# Production
npm run build          # Create optimized production build
npm run start          # Run production build
npm run start --port 3002 # Run production build on custom port

# Code Quality
npm run lint           # Run ESLint for code quality checks
```

## 🎨 User Interface Features

### Navigation Bar
- **Dynamic content**: Shows different options based on auth status
- **Logged out**: Login and Register buttons
- **Logged in (User)**: Welcome message and Logout button
- **Logged in (Admin)**: Welcome message, Create Article, and Logout button

### Article Cards
- **Title and Badge**: Article title with published/draft status
- **Metadata**: Author email and creation date
- **Content Preview**: First 200 characters of article content
- **Admin Actions**: Edit, Publish/Unpublish, Delete buttons (admin only)

### Forms
- **Validation**: Real-time client-side validation
- **Error Display**: Error messages shown below forms
- **Loading States**: Buttons disabled and text changes during submission
- **Password Confirmation**: Registration form validates password match

### Responsive Design
- **Mobile-friendly**: Works on all screen sizes
- **Grid Layout**: Article cards in responsive grid
- **Clean UI**: Modern, minimalist design with CSS variables

## 🔒 Security Implementation

### Token Management
- **localStorage**: Tokens stored securely in browser
- **Automatic Attachment**: Access token added to all API requests
- **Auto-refresh**: Expired tokens refreshed automatically
- **Logout Cleanup**: All auth data cleared on logout

### Protected Routes
- **Authentication Check**: useEffect hook verifies authentication
- **Automatic Redirect**: Unauthenticated users sent to login
- **Role Verification**: Admin routes check for ADMIN role
- **Route Guards**: Prevents unauthorized access

### Axios Interceptors
- **Request Interceptor**: Adds Bearer token to Authorization header
- **Response Interceptor**: Catches 401 errors and refreshes token
- **Retry Logic**: Retries failed requests with new token
- **Error Handling**: Redirects to login if refresh fails

### Client-Side Validation
- **Email Format**: HTML5 email input validation
- **Password Length**: Minimum 6 characters required
- **Password Match**: Confirms passwords match on registration
- **Required Fields**: All fields marked as required

## 🧩 React Patterns Used

### State Management
- **useState**: Local component state for forms and data
- **Multiple States**: Separate states for loading, errors, data

### Side Effects
- **useEffect**: Data fetching on component mount
- **Dependency Arrays**: Control when effects re-run
- **Cleanup**: Proper cleanup for async operations

### Routing
- **useRouter**: Programmatic navigation (router.push)
- **useParams**: Access dynamic route parameters
- **File-based Routing**: Next.js App Router convention

### Conditional Rendering
- **Ternary Operators**: `condition ? true : false`
- **Logical AND**: `condition && <Component />`
- **Early Returns**: Return loading state before main content

### Event Handling
- **Form Submission**: preventDefault to avoid page reload
- **Click Handlers**: Arrow functions for button clicks
- **Input Changes**: Controlled inputs with onChange
- 
## 🎯 Technology Stack

- **[Next.js](https://nextjs.org/)** v14.0.0 - React framework with App Router
- **[React](https://react.dev/)** v18.2.0 - UI library
- **[TypeScript](https://www.typescriptlang.org/)** v5 - Type-safe JavaScript
- **[Axios](https://axios-http.com/)** v1.6.0 - HTTP client for API requests
- **CSS** - Custom styling (no UI framework)

### Next.js Features Used
- **App Router**: File-based routing system
- **Client Components**: Interactive components with `'use client'`
- **Dynamic Routes**: `[id]` for parameterized URLs
- **Metadata API**: SEO-friendly page metadata
- **Google Fonts**: Optimized font loading

### React Hooks Used
- **useState**: State management
- **useEffect**: Side effects and lifecycle
- **useRouter**: Navigation
- **useParams**: URL parameters


### Manual Build
```sh
npm run build    # Creates .next folder
npm run start    # Serves production build
```

### Environment Variables for Production
- Update `NEXT_PUBLIC_API_URL` to production backend URL
- Ensure backend CORS allows your frontend domain


**Built by Houssem Ben Mabrouk  using Next.js, React, and TypeScript**
