# Dynamic Content Management System (DCMS)

## 📌 Overview
DCMS is a full-stack content management platform built with NestJS, Next.js, and PostgreSQL. It enables content creators and administrators to manage articles with role-based access control, secure authentication, and real-time content publishing capabilities.


## � Key Features
- **JWT Authentication**: Secure login with access and refresh tokens
- **Role-Based Authorization**: USER and ADMIN roles with different permissions
- **Article Management**: Full CRUD operations for content creation and management
- **Real-time Content Publishing**: Publish/unpublish articles instantly
- **Swagger API Documentation**: Complete API documentation at `/api` endpoint
- **Password Security**: bcrypt hashing for secure password storage
- **Automatic Token Refresh**: Seamless authentication experience with auto-refresh
- **Input Validation**: Server-side validation using class-validator

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone [repository-url]
cd testtechnique
```

### 2️⃣ Backend Setup
Navigate to the backend folder and install dependencies:
```sh
cd backend
npm install
```

### 3️⃣ Database Configuration
1. **Install PostgreSQL** (v12 or higher)
2. **Create a database**:
   ```sql
   CREATE DATABASE easybank_db;
   ```
3. **Configure environment variables**:
   ```sh
   # On Windows
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

Key environment variables for backend:
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name (easybank_db)
- `JWT_ACCESS_SECRET`: Secret key for access tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `JWT_ACCESS_EXPIRATION`: Access token expiration (15m)
- `JWT_REFRESH_EXPIRATION`: Refresh token expiration (7d)
- `PORT`: Backend server port (default: 3000)

### 4️⃣ Frontend Setup
Navigate to the frontend folder and install dependencies:
```sh
cd ../frontend
npm install
```

Configure frontend environment:
```sh
# On Windows
copy .env.local.example .env.local

# On Mac/Linux
cp .env.local.example .env.local
```

Key environment variables for frontend:
- `NEXT_PUBLIC_API_URL`: Backend API URL (http://localhost:3000)

### 5️⃣ Run the Development Servers

**Start Backend** (Terminal 1):
```sh
cd backend
npm run start:dev
```
> Backend runs on [http://localhost:3000](http://localhost:3000)  
> Swagger Documentation: [http://localhost:3000/api](http://localhost:3000/api)

**Start Frontend** (Terminal 2):
```sh
cd frontend
npm run dev
```
> Frontend runs on [http://localhost:3001](http://localhost:3001)


## 🧪 Testing the Application

The application can be tested manually or with automated tools:

- **Manual Testing:**  
  Follow the user flows below to test functionality
  
- **API Testing:**  
  Use Swagger UI at `http://localhost:3000/api` to test endpoints

- **Database Testing:**  
  Connect to PostgreSQL to verify data persistence

### Creating an Admin User

After registration, promote a user to admin via SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```


## � Project Structure
```
testtechnique/
├── backend/                     # NestJS Backend
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   │   ├── dto/            # Data transfer objects
│   │   │   ├── guards/         # Auth guards (JWT, Refresh)
│   │   │   ├── strategies/     # Passport strategies
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/              # User management module
│   │   │   ├── entities/       # User entity (database model)
│   │   │   ├── dto/            # User DTOs
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── articles/           # Article management module
│   │   │   ├── entities/       # Article entity
│   │   │   ├── dto/            # Article DTOs
│   │   │   ├── articles.controller.ts
│   │   │   ├── articles.service.ts
│   │   │   └── articles.module.ts
│   │   ├── common/             # Shared utilities
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── enums/          # Enums (UserRole)
│   │   │   └── guards/         # Role-based guards
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Application entry point
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── nest-cli.json           # NestJS CLI configuration
│   └── .env                    # Environment variables
│
├── frontend/                    # Next.js Frontend
│   ├── app/                    # Next.js App Router
│   │   ├── articles/           # Article pages
│   │   │   ├── create/         # Create article page
│   │   │   └── edit/[id]/      # Edit article page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (article list)
│   │   └── globals.css         # Global styles
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts              # API client (Axios)
│   │   └── auth.ts             # Auth helpers
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   ├── next.config.js          # Next.js configuration
│   └── .env.local              # Environment variables
│
├── CODE_DOCUMENTATION.md        # Detailed code documentation (backend & frontend)
└── README.md                    # Project documentation
```

## 🔧 Development Commands

### Backend Commands
```sh
npm run start:dev    # Start in development mode with hot-reload
npm run build        # Build for production
npm run start:prod   # Start production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Frontend Commands
```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## � Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Separate access (15m) and refresh (7d) tokens
- **Token Rotation**: New refresh token issued on each refresh
- **Secure Storage**: Refresh tokens hashed in database
- **Role-Based Access**: Guards protect admin-only routes
- **Input Validation**: All DTOs validated with class-validator
- **CORS Protection**: Configured for specific origins

## � API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get tokens | No |
| POST | `/auth/refresh` | Refresh access token | Refresh Token |
| POST | `/auth/logout` | Logout user | Access Token |

### Article Endpoints
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/articles` | Get all articles | Yes | No* |
| GET | `/articles/:id` | Get single article | Yes | No |
| POST | `/articles` | Create article | Yes | Yes |
| PATCH | `/articles/:id` | Update article | Yes | Yes |
| DELETE | `/articles/:id` | Delete article | Yes | Yes |

*Regular users only see published articles; admins see all articles.

## 🎯 Technology Stack

### Backend
- **NestJS**: Progressive Node.js framework
- **TypeORM**: ORM for TypeScript and JavaScript
- **PostgreSQL**: Relational database
- **Passport & JWT**: Authentication
- **bcrypt**: Password hashing
- **class-validator**: Input validation
- **Swagger**: API documentation

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client
- **CSS**: Custom styling


**Built By Houssem ben mabrouk using NestJS, Next.js, and PostgreSQL**
