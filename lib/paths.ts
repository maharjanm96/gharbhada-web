/**
 * Application route paths
 * Centralized path definitions for admin and tenant sections
 */

export const paths = {
  // Home
  home: "/",

  // Admin paths
  admin: {
    // Public routes
    login: "/admin/login",

    // Protected routes
    dashboard: "/admin/dashboard",
    properties: "/admin/properties",
    tenants: "/admin/tenants",
  },

  // Tenant paths
  tenant: {
    // Public routes
    login: "/tenant/login",

    // Protected routes
    dashboard: "/tenant/dashboard",
  },

  // API routes
  api: {
    admin: {
      login: "/api/admin/login",
      logout: "/api/admin/logout",
      signup: "/api/admin/signup",
      session: "/api/admin/session",
      tenants: "/api/admin/tenants",
    },
    tenant: {
      login: "/api/tenant/login",
      logout: "/api/tenant/logout",
      session: "/api/tenant/session",
    },
  },
} as const;

// Type-safe path helper
export type AppPaths = typeof paths;
