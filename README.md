# DCMS Backend - NestJS API

## 📌 Overview
The DCMS Backend is a RESTful API built with NestJS, providing authentication, authorization, and content management services. It features JWT token-based authentication, role-based access control, and complete CRUD operations for articles with PostgreSQL database integration.

## 🚀 Key Features
- **JWT Authentication System**: Dual-token authentication with access and refresh tokens
- **Role-Based Authorization**: USER and ADMIN roles with guard-protected routes
- **User Management**: Secure user registration and profile management with bcrypt
- **Article CRUD API**: Complete create, read, update, delete operations for articles
- **Swagger Documentation**: Auto-generated interactive API documentation
- **Database Integration**: TypeORM with PostgreSQL for data persistence
- **Input Validation**: Automatic request validation using class-validator and DTOs
- **Security Headers**: CORS protection and secure token handling

## 🛠️ Installation & Setup

### 1️⃣ Navigate to Backend Directory
```sh
cd backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Database Configuration
1. **Install PostgreSQL** (v12 or higher)
2. **Create a database**:
   ```sql
   CREATE DATABASE dcms_db;
   ```
3. **Configure environment variables**:
   ```sh
   # On Windows
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

### 4️⃣ Environment Setup
Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=dcms_db

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Application
PORT=3000
NODE_ENV=development
```

**Environment Variables Explained:**
- `DB_HOST`: PostgreSQL server host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name (dcms_db)
- `JWT_ACCESS_SECRET`: Secret key for signing access tokens (change in production!)
- `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens (change in production!)
- `JWT_ACCESS_EXPIRATION`: Access token lifetime (15 minutes)
- `JWT_REFRESH_EXPIRATION`: Refresh token lifetime (7 days)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### 5️⃣ Run the Development Server
```sh
npm run start:dev
```
> API runs on [http://localhost:3000](http://localhost:3000)  
> Swagger Documentation: [http://localhost:3000/api](http://localhost:3000/api)

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:3000/api`
2. Explore all available endpoints with interactive documentation
3. Test endpoints directly from the browser


## 📂 Project Structure
```
backend/
├── src/
│   ├── auth/                          # Authentication Module
│   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── auth-response.dto.ts   # Authentication response structure
│   │   │   └── login-user.dto.ts      # Login request validation
│   │   ├── guards/                    # Route Guards
│   │   │   ├── jwt-auth.guard.ts      # JWT authentication guard
│   │   │   └── refresh-auth.guard.ts  # Refresh token guard
│   │   ├── strategies/                # Passport Strategies
│   │   │   ├── jwt.strategy.ts        # Access token strategy
│   │   │   └── refresh.strategy.ts    # Refresh token strategy
│   │   ├── auth.controller.ts         # Auth endpoints (login, register, etc.)
│   │   ├── auth.service.ts            # Auth business logic
│   │   └── auth.module.ts             # Auth module configuration
│   │
│   ├── users/                         # User Management Module
│   │   ├── entities/                  # Database Entities
│   │   │   └── user.entity.ts         # User table definition
│   │   ├── dto/                       # Data Transfer Objects
│   │   │   └── create-user.dto.ts     # User registration validation
│   │   ├── users.service.ts           # User business logic
│   │   └── users.module.ts            # Users module configuration
│   │
│   ├── articles/                      # Article Management Module
│   │   ├── entities/                  # Database Entities
│   │   │   └── article.entity.ts      # Article table definition
│   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── create-article.dto.ts  # Article creation validation
│   │   │   ├── update-article.dto.ts  # Article update validation
│   │   │   └── article-response.dto.ts # Article response structure
│   │   ├── articles.controller.ts     # Article endpoints
│   │   ├── articles.service.ts        # Article business logic
│   │   └── articles.module.ts         # Articles module configuration
│   │
│   ├── common/                        # Shared Resources
│   │   ├── decorators/                # Custom Decorators
│   │   │   └── roles.decorator.ts     # @Roles decorator for authorization
│   │   ├── enums/                     # Enumerations
│   │   │   └── user-role.enum.ts      # USER, ADMIN role definitions
│   │   └── guards/                    # Custom Guards
│   │       └── roles.guard.ts         # Role-based authorization guard
│   │
│   ├── app.module.ts                  # Root application module
│   └── main.ts                        # Application entry point & configuration
│
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── nest-cli.json                      # NestJS CLI configuration
├── .env                              # Environment variables (create from .env.example)
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

## 📚 Module Architecture

### Auth Module (`src/auth/`)
Handles user authentication and token management:
- User registration with password hashing
- Login with credential validation
- Access token generation (15 min lifetime)
- Refresh token generation (7 days lifetime)
- Token refresh endpoint
- Logout with token invalidation

### Users Module (`src/users/`)
Manages user data and operations:
- User entity (database model)
- User creation with bcrypt password hashing
- Find user by email
- Find user by ID
- Update refresh tokens
- User-Article relationship (one-to-many)

### Articles Module (`src/articles/`)
Content management operations:
- Article CRUD operations
- Role-based filtering (USER sees published only, ADMIN sees all)
- Author tracking (foreign key to users)
- Publish/unpublish functionality
- Timestamps (createdAt, updatedAt)

### Common Module (`src/common/`)
Shared utilities and resources:
- Custom decorators (@Roles)
- Role enumeration (USER, ADMIN)
- Role-based authorization guard
- Reusable across all modules

## 🌐 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/auth/register` | Register new user | No | - |
| POST | `/auth/login` | Login and get tokens | No | - |
| POST | `/auth/refresh` | Refresh access token | Refresh Token | - |
| POST | `/auth/logout` | Logout and invalidate tokens | Access Token | - |

### Article Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/articles` | Get all articles* | Access Token | Any |
| GET | `/articles/:id` | Get single article | Access Token | Any |
| POST | `/articles` | Create new article | Access Token | ADMIN |
| PATCH | `/articles/:id` | Update article | Access Token | ADMIN |
| DELETE | `/articles/:id` | Delete article | Access Token | ADMIN |

*Users see published articles only; Admins see all articles (including drafts)

## 🔧 Development Commands

```sh
# Development
npm run start:dev          # Start with hot-reload (recommended for development)
npm run start:debug        # Start in debug mode with hot-reload

# Production
npm run build              # Compile TypeScript to JavaScript
npm run start:prod         # Run production build

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Lint code with ESLint
```

## 🔒 Security Implementation

### Password Security
- **bcrypt hashing**: Passwords hashed with 10 salt rounds
- **Never stored in plain text**: Only hashed versions stored in database
- **Password comparison**: Secure comparison using bcrypt.compare()

### JWT Token Security
- **Separate secrets**: Different secrets for access and refresh tokens
- **Short-lived access tokens**: 15-minute expiration reduces risk
- **Long-lived refresh tokens**: 7-day expiration for better UX
- **Token rotation**: New refresh token issued on each refresh
- **Hashed storage**: Refresh tokens hashed before database storage
- **Token invalidation**: Logout clears refresh tokens

### Authorization
- **JWT Guards**: Protect routes requiring authentication
- **Role Guards**: Restrict access based on user roles
- **Decorator-based**: Clean syntax with `@UseGuards()` and `@Roles()`

### Input Validation
- **class-validator**: Automatic validation of all DTOs
- **ValidationPipe**: Global validation pipe with whitelist
- **Type safety**: TypeScript ensures type correctness

### CORS Protection
- **Configured origins**: Only specified origins allowed
- **Credentials support**: Secure cookie and header handling
- **Production ready**: Easy to configure for deployment


## 🎯 Technology Stack

- **[NestJS](https://nestjs.com/)** v10.0.0 - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** v5.1.3 - Type-safe JavaScript
- **[TypeORM](https://typeorm.io/)** v0.3.27 - ORM for TypeScript and JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Passport](http://www.passportjs.org/)** v0.6.0 - Authentication middleware
- **[passport-jwt](http://www.passportjs.org/packages/passport-jwt/)** v4.0.1 - JWT strategy for Passport
- **[@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt)** v10.2.0 - JWT utilities
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** v5.1.1 - Password hashing
- **[class-validator](https://github.com/typestack/class-validator)** v0.14.2 - Validation decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** v0.5.1 - Object transformation
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** v7.4.2 - API documentation


**Built By Houssem ben Mabrouk  using NestJS, TypeORM, and PostgreSQL**
