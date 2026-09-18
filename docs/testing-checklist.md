# TrustWall Manual Testing Checklist

This checklist covers the current TrustWall web app and API behavior for backend and frontend testing. It is designed for manual validation in a local development environment.

## 1. Prerequisites

Before running tests, make sure the following are available:

- Node.js and npm installed
- MongoDB running locally
- Backend dependencies installed in `server/`
- Frontend dependencies installed in `client/`
- The app is running locally:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5001`
- `.env` values are present in `server/` and include the expected values for:
  - `PORT=5001`
  - `CLIENT_URL=http://localhost:5173`
  - `MONGO_URI=mongodb://127.0.0.1:27017/trustwall`
  - `JWT_SECRET` configured locally

## 2. Suggested Test Accounts

Use these test users when validating flows:

- Owner account:
  - Name: `Owner Test`
  - Email: `owner@example.com`
  - Password: `Password123`

- Secondary user (for unauthorized checks):
  - Name: `Second Owner`
  - Email: `owner2@example.com`
  - Password: `Password123`

- Sample public testimonial customer:
  - Name: `Jane Customer`
  - Email: `jane.customer@example.com`

## 3. Startup Smoke Tests

### 3.1 Backend startup

- Command:
  ```bash
  cd /Users/vineethchowdary/trustwall/server
  npm run dev
  ```
- Verify:
  - The server starts without crashes
  - MongoDB connection succeeds
  - No startup errors in terminal
  - Port `5001` is used

### 3.2 Frontend startup

- Command:
  ```bash
  cd /Users/vineethchowdary/trustwall/client
  npm run dev
  ```
- Verify:
  - The Vite dev server starts
  - App loads at `http://localhost:5173`
  - No compile errors or browser console errors on first load

### 3.3 Health check

- Endpoint: `GET /api/health`
- URL: `http://localhost:5001/api/health`
- Expected result:
  ```json
  {
    "success": true,
    "message": "TrustWall API is running"
  }
  ```
- Status: `200 OK`

## 4. Backend API Testing Checklist

### 4.1 Health endpoint

- [ ] Request: `GET /api/health`
- [ ] Expected status: `200`
- [ ] Expected success flag: `true`
- [ ] Expected message: `TrustWall API is running`
- [ ] Verify no unexpected fields or server errors

### 4.2 Registration

- [ ] Request: `POST /api/auth/register`
- [ ] Body:
  ```json
  {
    "name": "Owner Test",
    "email": "owner@example.com",
    "password": "Password123"
  }
  ```
- [ ] Expected status: `201 Created`
- [ ] Expected response includes `success: true`
- [ ] Expected user object includes safe fields only
- [ ] Confirm password is not returned in the API response
- [ ] Confirm JWT cookie is not set during registration unless intentionally implemented

### 4.3 Duplicate registration

- [ ] Attempt to register the same email again with the same or different valid password
- [ ] Request: `POST /api/auth/register`
- [ ] Expected status: `409 Conflict`
- [ ] Expected message: duplicate account warning
- [ ] Verify no duplicate record was created in MongoDB

### 4.4 Login

- [ ] Request: `POST /api/auth/login`
- [ ] Body:
  ```json
  {
    "email": "owner@example.com",
    "password": "Password123"
  }
  ```
- [ ] Expected status: `200 OK`
- [ ] Expected response includes `success: true`
- [ ] JWT cookie is set in browser
- [ ] Cookie is `httpOnly`
- [ ] Confirm no JWT is stored in localStorage
- [ ] User data is returned without password

### 4.5 Invalid login

- [ ] Request: `POST /api/auth/login`
- [ ] Body with wrong password:
  ```json
  {
    "email": "owner@example.com",
    "password": "WrongPassword123"
  }
  ```
- [ ] Expected status: `401 Unauthorized`
- [ ] Expected message: invalid credentials
- [ ] Verify no JWT cookie is set after failed login

### 4.6 Authentication middleware

- [ ] Call a protected route without a cookie: `GET /api/auth/me`
- [ ] Expected status: `401 Unauthorized`
- [ ] Expected message: authentication required or invalid token
- [ ] Call with valid JWT cookie
- [ ] Expected status: `200 OK`
- [ ] Confirm `req.user` is available and valid

### 4.7 Logout

- [ ] Request: `POST /api/auth/logout`
- [ ] Expected status: `200 OK`
- [ ] Verify cookie is removed/cleared
- [ ] Verify subsequent protected request fails with `401`

### 4.8 Create space

- [ ] Request: `POST /api/spaces`
- [ ] Auth required: yes
- [ ] Sample payload:
  ```json
  {
    "name": "North Star Launch",
    "description": "Customer stories for our launch campaign.",
    "brandName": "North Star",
    "logoUrl": "https://example.com/logo.png",
    "primaryColor": "#7c3aed",
    "welcomeTitle": "Share your experience",
    "welcomeMessage": "Tell us about your experience with our product."
  }
  ```
- [ ] Expected status: `201 Created`
- [ ] Verify space is linked to the authenticated owner
- [ ] Verify a unique slug is generated

### 4.9 Update space

- [ ] Request: `PUT /api/spaces/:spaceId` or relevant patch/update route
- [ ] Auth required: yes
- [ ] Update name and welcome text
- [ ] Expected status: `200 OK`
- [ ] Verify updated values persist
- [ ] Verify slug behavior remains valid if name changes are allowed

### 4.10 Delete space

- [ ] Request: `DELETE /api/spaces/:spaceId`
- [ ] Auth required: yes
- [ ] Expected status: `200 OK` or `204 No Content`
- [ ] Verify the space is removed
- [ ] Verify testimonials associated with that space are removed or handled per app logic

### 4.11 Public space access

- [ ] Request: `GET /api/public/spaces/:slug`
- [ ] Example slug from created space: `north-star-launch`
- [ ] Expected status: `200 OK`
- [ ] Public response should expose only safe space metadata
- [ ] Verify no private owner data is returned
- [ ] Test invalid slug: `GET /api/public/spaces/does-not-exist`
- [ ] Expected status: `404 Not Found`

### 4.12 Public testimonial submission

- [ ] Request: `POST /api/public/spaces/:slug/testimonials`
- [ ] Body example:
  ```json
  {
    "customerName": "Jane Customer",
    "customerEmail": "jane.customer@example.com",
    "rating": 5,
    "review": "Amazing experience. The team was responsive and the product exceeded expectations.",
    "company": "Acme Ltd",
    "jobTitle": "Marketing Lead"
  }
  ```
- [ ] Expected status: `201 Created`
- [ ] Verify testimonial is stored with status `pending`
- [ ] Verify customer email is not exposed in public APIs
- [ ] Try invalid rating: `0`, `6`, or `"five"`
- [ ] Expected status: `400 Bad Request`

### 4.13 Approve testimonial

- [ ] Request: owner action to approve a testimonial
- [ ] Expected status: `200 OK`
- [ ] Expected status field changes to `approved`
- [ ] Verify `approvedAt` timestamp is set if implemented
- [ ] Verify it appears in public wall after approval

### 4.14 Reject testimonial

- [ ] Request: owner action to reject a testimonial
- [ ] Expected status: `200 OK`
- [ ] Expected status changes to `rejected`
- [ ] Verify it is not shown on public wall
- [ ] Verify rejected status is not treated as approved

### 4.15 Archive testimonial

- [ ] Request: owner action to archive a testimonial
- [ ] Expected status: `200 OK`
- [ ] Expected status changes to `archived`
- [ ] Verify archived testimonials are hidden from active public displays

### 4.16 Public Wall of Love filtering

- [ ] Request: `GET /api/public/:slug/wall` or equivalent public wall endpoint
- [ ] Verify only `approved` testimonials are returned
- [ ] Verify `pending`, `rejected`, and `archived` testimonials are excluded
- [ ] Test filter parameters such as:
  - `?sort=newest`
  - `?sort=highest`
  - `?rating=5`
  - `?featured=true`
- [ ] Expected status: `200 OK` for valid filters
- [ ] Invalid sort or invalid rating should return `400 Bad Request`

### 4.17 Unauthorized access

- [ ] Try updating a space that belongs to a different owner
- [ ] Try approving/rejecting another owner’s testimonial
- [ ] Try fetching private dashboard data without login
- [ ] Expected status: `401` or `403`
- [ ] Ensure response message does not disclose sensitive details

### 4.18 Invalid IDs

- [ ] Call a route with invalid MongoDB ObjectId: `/api/spaces/not-a-valid-object-id`
- [ ] Call a protected route with malformed testimonial ID
- [ ] Expected status: `400 Bad Request`
- [ ] Expected message indicates invalid ID

### 4.19 Rate limiting

- [ ] Send repeated testimonial submissions from the same IP/email within a short time window
- [ ] Expected status: `429 Too Many Requests`
- [ ] Verify message says the user should try again later
- [ ] Repeat with a valid login request to confirm auth rate limiting still works as expected

## 5. Frontend Manual Testing Checklist

### 5.1 Login form validation

- [ ] Visit login page
- [ ] Leave both fields empty and submit
- [ ] Expected validation message appears
- [ ] Enter malformed email address
- [ ] Expected inline error is shown
- [ ] Enter valid email and password
- [ ] Expected redirect to dashboard or app home after success

### 5.2 Registration form validation

- [ ] Visit registration page
- [ ] Try submitting empty form
- [ ] Try weak password like `abc123`
- [ ] Try invalid email format
- [ ] Try duplicate email registration
- [ ] Confirm error messages appear and submission is blocked
- [ ] Submit valid form
- [ ] Confirm successful account creation and redirect or login flow

### 5.3 Protected routes

- [ ] Open a protected route without logging in
- [ ] Expected redirect to login or unauthorized state
- [ ] Log in as owner
- [ ] Protected pages should become accessible
- [ ] Log out and verify route protection is restored

### 5.4 Space creation

- [ ] Open create space page
- [ ] Submit form with missing title
- [ ] Confirm validation error
- [ ] Fill in valid values
- [ ] Confirm loading state appears during request
- [ ] On success, verify space is created and redirect or success message appears

### 5.5 Space editing

- [ ] Open edit space page for an existing space
- [ ] Change name, description, or branding details
- [ ] Save changes
- [ ] Confirm success state and updated values are displayed
- [ ] Verify unauthorized editing is blocked via route or API

### 5.6 Testimonial moderation

- [ ] Open testimonials moderation dashboard for a space
- [ ] Verify list loads and displays items in moderate status groups
- [ ] Approve a pending testimonial
- [ ] Reject a pending testimonial
- [ ] Archive a testimonial
- [ ] Confirm UI updates and status badges are correct
- [ ] Test empty state when there are no testimonials

### 5.7 Public collection page

- [ ] Open public collection route for a valid space
- [ ] Verify page loads with public space details
- [ ] Submit a valid testimonial form
- [ ] Confirm success state and pending review message
- [ ] Submit invalid testimonial data to verify frontend validation
- [ ] Verify optional avatar upload preview works before submission

### 5.8 Public Wall of Love

- [ ] Open public wall for a valid space
- [ ] Verify only approved testimonials appear
- [ ] Confirm rating summary and distribution display correctly
- [ ] Test sort/filter controls if present
- [ ] Verify empty state when no approved testimonials exist

### 5.9 Loading states

- [ ] Observe dashboard, spaces list, testimonial list, and form submission screens
- [ ] Confirm skeletons or spinner states are shown while data loads
- [ ] Confirm buttons disable when submission is in progress
- [ ] Ensure no duplicate requests are triggered from repeated clicks

### 5.10 Error states

- [ ] Simulate network failure or invalid backend response
- [ ] Verify error message appears in the UI without crashing
- [ ] Confirm form-level backend error messages are clear and non-sensitive
- [ ] Confirm protected routes do not silently fail

### 5.11 Empty states

- [ ] Create an owner account with no spaces
- [ ] Verify empty spaces state is displayed with call-to-action
- [ ] Remove all testimonials from a space
- [ ] Verify empty testimonial state is shown
- [ ] Open a public wall with no approved testimonials
- [ ] Verify the empty public wall message is shown

## 6. Cross-Feature Validation

- [ ] Owner can create a space and submit a public testimonial to it
- [ ] Public wall only includes approved testimonials
- [ ] Owner can moderate from the dashboard and verify status changes immediately
- [ ] Unauthorized users cannot alter another owner’s space or testimonials
- [ ] Sensitive data remains private (passwords, customer emails, JWT secret)
- [ ] App works on both desktop and mobile widths
- [ ] Buttons, labels, and forms are keyboard reachable and usable

## 7. Browser Validation Checklist

- [ ] No console errors on load
- [ ] No uncaught promise rejections
- [ ] Network tab shows successful API calls for user flows
- [ ] Response bodies match expected JSON structure
- [ ] UI responds correctly to success, loading, and error states
- [ ] No broken routes or stale pages after login/logout

## 8. Suggested Test Session Order

1. Start backend and verify health endpoint
2. Register owner
3. Login and validate protected routes
4. Create and edit a space
5. Submit a public testimonial
6. Approve, reject, and archive testimonial
7. Validate public wall filtering behavior
8. Validate unauthorized access and invalid IDs
9. Validate frontend states, navigation, and empty UI cases
10. Check rate limiting and repeated submissions

## 9. Acceptance Criteria

The app is considered ready for a basic production-quality manual validation pass when all of the following are true:

- All critical backend routes return the expected status codes
- JWT auth works using HTTP-only cookies
- Public APIs do not expose private owner or customer data
- Public wall excludes unapproved content
- Validation prevents malformed requests and bad data
- Frontend handles loading, empty, and error states correctly
- Protected pages redirect or reject unauthorized access
- Basic rate limiting and duplicate protections behave as expected

## 10. Known Focus Areas

These are the highest-value checks to run on every release:

- JWT cookie flow and route protection
- Space ownership enforcement
- Public testimonial moderation flow
- Public wall filtering logic
- Validation of invalid IDs and malformed payloads
- Error handling for rate limiting and upload restrictions
- Frontend state transitions for loading and empty screens
