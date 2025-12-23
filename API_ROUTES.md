# API Routes Documentation

## Authentication Routes

### Admin Login

**POST** `/api/admin/login`

Login as an administrator.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

**Cookies Set:**

- `auth-token`: HTTP-only secure session cookie (7 days)

**Error Responses:**

- `400`: Validation error
- `401`: Invalid credentials
- `500`: Internal server error

---

### Admin Signup

**POST** `/api/admin/signup`

Create a new administrator account.

**Request Body:**

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

**Error Responses:**

- `400`: Validation error
- `409`: Admin already exists
- `500`: Internal server error

---

### Logout

**POST** `/api/admin/logout`

Logout the current administrator.

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**

- `auth-token`: Session cookie is deleted

---

### Check Session

**GET** `/api/admin/session`

Check if the user is authenticated and get session data.

**Response (200 - Authenticated):**

```json
{
  "authenticated": true,
  "admin": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Response (200 - Not Authenticated):**

```json
{
  "authenticated": false,
  "admin": null
}
```

**Response (401 - Expired/Invalid):**

```json
{
  "authenticated": false,
  "admin": null,
  "error": "Session expired" | "Invalid session"
}
```

---

## Better Auth Routes

### Better Auth Handler

**GET/POST** `/api/auth/[...all]`

Handles all better-auth related requests including OAuth flows.

This is managed by the `better-auth` library and supports:

- Email/Password authentication
- OAuth providers (configurable)
- Session management
- User registration

Refer to [Better Auth documentation](https://better-auth.dev) for detailed usage.

---

## Middleware (Proxy)

The `proxy.ts` file in the root directory handles:

### Protected Routes

- `/dashboard/*` - Requires authentication
- `/admin/*` (except `/admin/login`) - Requires authentication

### Security Headers

All responses include:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Redirects

- Root (`/`) → `/dashboard` (if authenticated) or `/admin/login` (if not)
- Protected routes → `/admin/login` (if not authenticated)

---

## Usage Examples

### Login Example

```typescript
const response = await fetch("/api/admin/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@gharbhada.com",
    password: "admin123",
  }),
});

const data = await response.json();

if (data.success) {
  // Redirect to dashboard
  window.location.href = "/dashboard";
}
```

### Check Auth Example

```typescript
const response = await fetch("/api/admin/session");
const { authenticated, admin } = await response.json();

if (authenticated) {
  console.log("Logged in as:", admin.email);
} else {
  // Redirect to login
  window.location.href = "/admin/login";
}
```

### Logout Example

```typescript
await fetch("/api/admin/logout", {
  method: "POST",
});

// Redirect to login
window.location.href = "/admin/login";
```

---

## Security Considerations

1. **Session Tokens**: Currently using base64-encoded JSON. For production, consider using JWT with signing.
2. **HTTPS**: Always use HTTPS in production for secure cookie transmission.
3. **CSRF Protection**: Implement CSRF tokens for state-changing operations.
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks on login.
5. **Password Policy**: Enforce strong password requirements.
6. **Session Expiry**: Sessions expire after 7 days and require re-login.

---

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="mongodb+srv://..."
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV="development" | "production"
```
