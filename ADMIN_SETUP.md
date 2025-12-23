# Admin Authentication Setup

## Overview

This admin authentication system uses:

- **Prisma ORM** with MongoDB
- **Better Auth** for authentication
- **Zod** for validation
- **bcryptjs** for password hashing

## Database Setup

### 1. Push Prisma Schema to MongoDB

```bash
npm run prisma:push
```

This will create the necessary collections in your MongoDB database (GharBhada).

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

## Creating an Admin User

### Using the Script

Run the following command to create your first admin:

```bash
# Default admin (admin@gharbhada.com / admin123)
npm run create-admin

# Custom admin
npm run create-admin "admin@example.com" "securePassword123" "Admin Name"
```

### Manual Creation via API

You can also use the signup API endpoint:

**POST** `/api/admin/signup`

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword",
  "confirmPassword": "securePassword"
}
```

## Environment Variables

Make sure your `.env` file contains:

```env
DATABASE_URL="mongodb+srv://maharjanm96:manish33046@cluster0.0lno4.mongodb.net/GharBhada?retryWrites=true&w=majority"
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
```

## Admin Login

### URL

`/admin/login`

### Features

- Email and password authentication
- Form validation using Zod
- Real-time error display
- Loading states
- Secure password hashing
- Toast notifications

### API Endpoints

#### Login

**POST** `/api/admin/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Signup (Create New Admin)

**POST** `/api/admin/signup`

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

## File Structure

```
├── app/
│   ├── admin/
│   │   └── login/
│   │       └── page.tsx          # Admin login page
│   └── api/
│       ├── admin/
│       │   ├── login/
│       │   │   └── route.ts      # Login API endpoint
│       │   └── signup/
│       │       └── route.ts      # Signup API endpoint
│       └── auth/
│           └── [...all]/
│               └── route.ts      # Better Auth handler
├── lib/
│   ├── auth.ts                   # Better Auth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   └── validations/
│       └── admin.ts              # Zod validation schemas
├── prisma/
│   └── schema.prisma             # Database schema
└── scripts/
    └── create-admin.ts           # Admin creation script
```

## Prisma Schema

### Admin Model

```prisma
model Admin {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("admins")
}
```

## Development

### Run Development Server

```bash
npm run dev
```

Then navigate to: `http://localhost:3000/admin/login`

## Security Notes

1. **Change the BETTER_AUTH_SECRET** in production to a secure random string (minimum 32 characters)
2. **Use HTTPS** in production
3. **Passwords are hashed** using bcryptjs with a salt round of 10
4. **Validation** is done both client-side (Zod) and server-side
5. **Consider implementing**:
   - Session management
   - JWT tokens
   - Password reset functionality
   - Two-factor authentication
   - Rate limiting on login attempts
   - Account lockout after failed attempts

## Troubleshooting

### Prisma Issues

If you encounter Prisma errors:

```bash
npm run prisma:generate
npm run prisma:push
```

### Connection Issues

Verify your MongoDB connection string in `.env` is correct and the database is accessible.

### Module Not Found

Make sure all dependencies are installed:

```bash
npm install
```
