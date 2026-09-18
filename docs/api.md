# TrustWall API Documentation

This document describes the current REST API surface for TrustWall.

## API Conventions

- Base URL: `http://localhost:5001/api`
- Content-Type: `application/json` for most JSON API routes
- Authentication: JWT stored in an HTTP-only cookie for owner-protected routes
- Success response format: `{ "success": true, "message": "...", "data": {...} }`
- Error response format: `{ "success": false, "message": "..." }`

## Endpoint Reference

| Endpoint | Method | Auth | Request Body | Query Params | Success Response | Error Response |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/health` | GET | No | None | None | `200` with `{ "success": true, "message": "TrustWall API is running" }` | `500` if the server fails |
| `/api/auth/register` | POST | No | `{ name, email, password }` | None | `201` with created user details | `400` invalid input, `409` duplicate email |
| `/api/auth/login` | POST | No | `{ email, password }` | None | `200` with user details and auth cookie | `400` missing fields, `401` invalid credentials |
| `/api/auth/me` | GET | Yes | None | None | `200` with current authenticated user | `401` invalid or missing token |
| `/api/auth/logout` | POST | No | None | None | `200` with logout success message | `400` or `500` only in unusual server issues |
| `/api/auth/me/profile` | PATCH | Yes | `{ name, avatar }` | None | `200` with updated user profile | `400` invalid name or avatar URL |
| `/api/auth/me/password` | PATCH | Yes | `{ currentPassword, newPassword }` | None | `200` with password change success message | `400` invalid input, `401` incorrect current password |
| `/api/auth/me` | DELETE | Yes | `{ password }` | None | `200` with account deletion success | `400` missing password, `401` wrong password |
| `/api/spaces` | POST | Yes | `{ name, description, brandName, logoUrl, primaryColor, welcomeTitle, welcomeMessage }` | None | `201` with created space object | `400` invalid payload, `401` unauthenticated |
| `/api/spaces` | GET | Yes | None | `page`, `limit` | `200` with list of owner spaces | `400` invalid pagination, `401` unauthorized |
| `/api/spaces/:id` | GET | Yes | None | None | `200` with a single space | `400` invalid ID, `401` unauthorized, `404` not found |
| `/api/spaces/:id` | PATCH | Yes | `{ ...space fields }` | None | `200` with updated space | `400` invalid input, `401` unauthorized, `404` not found |
| `/api/spaces/:id` | DELETE | Yes | None | None | `200` or `204` with deletion success | `400` invalid ID, `401` unauthorized, `404` not found |
| `/api/public/spaces/:slug` | GET | No | None | None | `200` with public space metadata | `404` invalid or inactive slug |
| `/api/public/spaces/:slug/testimonials` | POST | No | `{ customerName, customerEmail, rating, review, company, jobTitle, avatarUrl }` | None | `201` with submitted testimonial ID and status | `400` invalid payload, `404` invalid space, `429` rate limited |
| `/api/public/spaces/:slug/wall` | GET | No | None | `sort`, `rating`, `featured` | `200` with approved testimonials and statistics | `400` invalid filter, `404` invalid or inactive space |
| `/api/spaces/:spaceId/testimonials` | GET | Yes | None | `page`, `limit`, `status`, `search` | `200` with paginated testimonials | `400` invalid pagination or filter, `401` unauthorized |
| `/api/testimonials/:id` | GET | Yes | None | None | `200` with the testimonial | `400` invalid ID, `401` unauthorized, `404` not found |
| `/api/testimonials/:id/approve` | PATCH | Yes | None | None | `200` with approved testimonial | `400` invalid ID, `401` unauthorized |
| `/api/testimonials/:id/reject` | PATCH | Yes | None | None | `200` with rejected testimonial | `400` invalid ID, `401` unauthorized |
| `/api/testimonials/:id/archive` | PATCH | Yes | None | None | `200` with archived testimonial | `400` invalid ID, `401` unauthorized |
| `/api/testimonials/:id/feature` | PATCH | Yes | `{ isFeatured: boolean }` | None | `200` with updated feature state | `400` invalid boolean, `401` unauthorized |
| `/api/testimonials/:id/like` | PATCH | Yes | `{ isLiked: boolean }` | None | `200` with updated like state | `400` invalid boolean, `401` unauthorized |
| `/api/testimonials/:id` | DELETE | Yes | None | None | `200` with testimonial deletion success | `400` invalid ID, `401` unauthorized |
| `/api/uploads/avatar` | POST | Yes | multipart form data with `avatar` | None | `200` or `201` with uploaded avatar URL | `400` invalid file, `413` file too large |
| `/api/dashboard/overview` | GET | Yes | None | None | `200` with dashboard metrics and recent activity | `401` unauthorized |

## Authentication Routes

### Register Owner

**Endpoint:** `POST /api/auth/register`

**Authentication:** No

**Request body:**
```json
{
  "name": "Jane Owner",
  "email": "jane@example.com",
  "password": "Password123"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Owner account created successfully",
  "user": {
    "id": "64d...",
    "name": "Jane Owner",
    "email": "jane@example.com",
    "role": "owner",
    "avatar": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

### Login Owner

**Endpoint:** `POST /api/auth/login`

**Authentication:** No

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "64d...",
    "name": "Jane Owner",
    "email": "jane@example.com",
    "role": "owner",
    "avatar": null
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Space Routes

### Create Space

**Endpoint:** `POST /api/spaces`

**Authentication:** Yes

**Request body:**
```json
{
  "name": "North Star Launch",
  "description": "Customer stories from our launch campaign.",
  "brandName": "North Star",
  "logoUrl": "https://example.com/logo.png",
  "primaryColor": "#7c3aed",
  "welcomeTitle": "Share your experience",
  "welcomeMessage": "Tell us what you loved most."
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Space created successfully",
  "data": {
    "id": "64d...",
    "name": "North Star Launch",
    "slug": "north-star-launch",
    "owner": "64d..."
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Space name is required"
}
```

## Public Collection Routes

### Get Public Space By Slug

**Endpoint:** `GET /api/public/spaces/:slug`

**Authentication:** No

**Query parameters:** None

**Success response:**
```json
{
  "success": true,
  "message": "Public space retrieved successfully",
  "data": {
    "id": "64d...",
    "slug": "north-star-launch",
    "name": "North Star Launch",
    "description": "Customer stories from our launch campaign.",
    "brandName": "North Star",
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#7c3aed",
    "welcomeTitle": "Share your experience",
    "welcomeMessage": "Tell us what you loved most."
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "This public space is not available"
}
```

### Submit Public Testimonial

**Endpoint:** `POST /api/public/spaces/:slug/testimonials`

**Authentication:** No

**Request body:**
```json
{
  "customerName": "Jane Customer",
  "customerEmail": "jane.customer@example.com",
  "rating": 5,
  "review": "The onboarding experience was smooth and the product delivered real value.",
  "company": "Acme Ltd",
  "jobTitle": "Marketing Lead"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Thank you for sharing your experience. Your testimonial is awaiting review.",
  "data": {
    "testimonialId": "64d...",
    "status": "pending"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Rating must be a whole number from 1 to 5"
}
```

## Moderation Routes

### Get Space Testimonials

**Endpoint:** `GET /api/spaces/:spaceId/testimonials`

**Authentication:** Yes

**Query parameters:**
- `page` (default: `1`)
- `limit` (default: `20`, max: `100`)
- `status` (`pending`, `approved`, `rejected`, `archived`, or `all`)
- `search` (text search across customer name, company, and review body)

**Success response:**
```json
{
  "success": true,
  "message": "Testimonials retrieved successfully",
  "data": {
    "testimonials": [
      {
        "id": "64d...",
        "customerName": "Jane Customer",
        "company": "Acme Ltd",
        "rating": 5,
        "review": "Great experience",
        "status": "pending",
        "submittedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Invalid testimonial status filter"
}
```

### Approve Testimonial

**Endpoint:** `PATCH /api/testimonials/:id/approve`

**Authentication:** Yes

**Success response:**
```json
{
  "success": true,
  "message": "Testimonial approved successfully",
  "data": {
    "id": "64d...",
    "status": "approved"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "You are not authorized to access this space"
}
```

## Public Wall Routes

### Get Public Wall

**Endpoint:** `GET /api/public/spaces/:slug/wall`

**Authentication:** No

**Query parameters:**
- `sort` (`newest` or `highest`)
- `rating` (`1` to `5`)
- `featured` (`true` or `false`)

**Success response:**
```json
{
  "success": true,
  "message": "Public Wall of Love retrieved successfully",
  "data": {
    "space": {
      "slug": "north-star-launch",
      "name": "North Star Launch"
    },
    "testimonials": [
      {
        "id": "64d...",
        "customerName": "Jane Customer",
        "rating": 5,
        "review": "Excellent service",
        "isFeatured": true
      }
    ],
    "statistics": {
      "totalApprovedReviews": 1,
      "averageRating": 5,
      "ratingDistribution": {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 1
      }
    }
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Sort must be newest or highest"
}
```

## Dashboard Routes

### Get Dashboard Overview

**Endpoint:** `GET /api/dashboard/overview`

**Authentication:** Yes

**Success response:**
```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "totalSpaces": 3,
    "totalTestimonials": 10,
    "pendingTestimonials": 2,
    "approvedTestimonials": 6,
    "rejectedTestimonials": 1,
    "averageRating": 4.67,
    "featuredTestimonials": 2,
    "ratingDistribution": {
      "1": 0,
      "2": 0,
      "3": 1,
      "4": 2,
      "5": 3
    },
    "recentTestimonials": []
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

## Upload Routes

### Upload Avatar

**Endpoint:** `POST /api/uploads/avatar`

**Authentication:** Yes

**Request body:** multipart form data with a field named `avatar`

**Success response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "url": "http://localhost:5001/uploads/avatar-123.png"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Avatar image must be 5 MB or smaller"
}
```

## Common Error Codes

- `400 Bad Request`: invalid payload, malformed ID, bad filter value, or validation failure
- `401 Unauthorized`: missing or invalid JWT cookie
- `403 Forbidden`: user is authenticated but not allowed to access selected resource
- `404 Not Found`: route or resource does not exist
- `409 Conflict`: duplicate registration or duplicate unique record
- `413 Payload Too Large`: uploaded file too large
- `429 Too Many Requests`: rate-limit exceeded
- `500 Internal Server Error`: unexpected server error

## Notes

- Customer email addresses are not returned in public endpoints.
- Public testimonials remain pending until approved by the owner.
- The public wall only exposes approved items.
- All private routes require a valid, authenticated owner session.
