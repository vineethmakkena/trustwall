# TrustWall

TrustWall is a testimonial and social proof collection platform for businesses that want to collect customer feedback, moderate reviews, and showcase approved stories publicly.

## Project Overview

TrustWall helps business owners create dedicated testimonial spaces, collect customer reviews without requiring customer logins, and present approved testimonials on a polished public wall. The platform is designed for simplicity, moderation, and scalable social proof marketing.

## Problem Statement

Many businesses struggle to collect, organize, and display customer testimonials in a way that feels professional and trustworthy. Public review collection often becomes fragmented across emails, spreadsheets, and social channels, while owners need a reliable moderation workflow to maintain quality and brand consistency.

TrustWall solves this by providing:
- a private owner dashboard for managing spaces,
- public testimonial collection flows for customers,
- moderation tools to approve or reject stories,
- and public showcase pages for approved social proof.

## Features

- Owner authentication and session-based access using JWT cookies
- Multiple testimonial spaces per owner
- Public testimonial collection without customer login
- Moderation workflow: pending, approved, rejected, archived
- Public wall with approved reviews only
- Rating summaries and rating distribution
- Optional customer avatar upload
- Dashboard statistics and quick metrics
- Embed generation for website owners
- Settings management for profile updates and password changes
- Responsive SaaS-style UI with loading, empty, and error states

## Tech Stack

Frontend:
- React
- Vite
- React Router
- Axios
- Lucide React

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cookie Parser
- CORS

## Screenshots Placeholder
## Screenshots

### Sign Up Page

![Sign Up Page](docs/screenshots/1.sign%20up%20page%20.png)

### Sign In Page

![Sign In Page](docs/screenshots/2.Sign%20in%20page.png)

### Overview Page

![Overview Page](docs/screenshots/3.overview%20page%20.png)

### Overview Details

![Overview Details](docs/screenshots/3.1.overview%202.png)

### Spaces Page

![Spaces Page](docs/screenshots/4.spaces%20page%20.png)

### Testimonials Page

![Testimonials Page](docs/screenshots/5.testimonials%20page%20.png)

### Space Creation Page

![Space Creation Page](docs/screenshots/5.space%20creation%20page%20%20.png)

### Insights Page

![Insights Page](docs/screenshots/6.INsights%20page%20.png)

### Settings Page

![Settings Page](docs/screenshots/7.setting%20page%20.png)

### Settings Details

![Settings Details](docs/screenshots/7.1setting%20page%202.png)

### Embed Generator

![Embed Generator](docs/screenshots/8.embed-generator.png)

### Public Wall

![Public Wall](docs/screenshots/9.public%20wall.png)

### Public Wall Details

![Public Wall Details](docs/screenshots/9.1public%20wall%202.png)

### Collection Link

![Collection Link](docs/screenshots/10.copy%20collection%20link%20page%20%5C.png)

### Collection Link Details

![Collection Link Details](docs/screenshots/10.1cpy%20link%20collection%20page%202.png)

## Folder Structure

```text
trustwall/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── api.md
│   └── testing-checklist.md
├── .gitignore
├── .env.example
├── README.md
└── package.json (optional root-level orchestration file if added later)
```

## Installation

1. Clone the repository.
2. Install server dependencies:

```bash
cd trustwall/server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

4. Create your local environment file.

You can copy the template from the project root:

```bash
cp .env.example server/.env
```

or create the file manually in `server/` using the values shown below.

## Environment Variables

Create a local file named `server/.env` and configure the following values:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/trustwall
JWT_SECRET=replace-with-a-secure-local-secret
NODE_ENV=development
```

Notes:
- Never commit real secrets to Git.
- Use a strong random JWT secret in local development and production.
- Keep credentials out of source control.

## Running the Backend

From the `server` folder:

```bash
cd trustwall/server
npm run dev
```

The backend runs on:
- `http://localhost:5001`

Health endpoint:

```bash
curl http://localhost:5001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "TrustWall API is running"
}
```

## Running the Frontend

From the `client` folder:

```bash
cd trustwall/client
npm run dev
```

The frontend runs on:
- `http://localhost:5173`

## API Overview

TrustWall uses a REST API with JSON payloads and cookie-based authentication for the owner dashboard.

Core API groups:
- Authentication: `/api/auth`
- Spaces: `/api/spaces`
- Public spaces and submissions: `/api/public`
- Testimonial moderation: `/api/testimonials` and `/api/spaces/:spaceId/testimonials`
- Dashboard metrics: `/api/dashboard`
- Uploads: `/api/uploads`

Detailed endpoint docs are available in [docs/api.md](docs/api.md).

## Authentication

TrustWall uses JWT-based authentication with HTTP-only cookies.

How it works:
1. A user registers or logs in.
2. The server creates a JWT signed with a secret configured in the environment.
3. The token is stored in an HTTP-only cookie, not in localStorage.
4. Protected routes check the cookie via the auth middleware.
5. The authenticated owner is attached to the request and used for authorization checks.

This approach helps protect the token from client-side JavaScript access and reduces the risk of XSS-related token theft.

## Database Models

### User
- `name`: owner name
- `email`: email address, unique and lowercase
- `password`: hashed password
- `role`: owner role
- `avatar`: optional profile image URL
- timestamps: created and updated time

### Space
- `name`: space name
- `slug`: unique public URL segment
- `description`: optional summary
- `brandName`: optional brand label
- `logoUrl`: optional logo URL
- `primaryColor`: theme color
- `welcomeTitle`: public welcome text
- `welcomeMessage`: optional welcome message
- `owner`: reference to the owning user
- status and timestamps

### Testimonial
- `space`: parent space reference
- `customerName`: customer display name
- `customerEmail`: customer email, stored privately
- `company`: optional company name
- `jobTitle`: optional role/title
- `rating`: numeric rating from 1 to 5
- `review`: testimonial content
- `avatarUrl`: optional uploaded avatar or public profile image
- `status`: pending, approved, rejected, archived
- `isFeatured`: feature flag
- `isLiked`: like flag
- timestamps and moderation metadata

## Security Considerations

TrustWall includes basic protection for a production-ready MVP, including:
- JWTs stored in HTTP-only cookies
- password hashing with bcryptjs
- environment-based configuration for database and secrets
- MongoDB validation and input checks
- CORS restricted to the frontend origin
- rate limiting on authentication and public submission routes
- upload validation for accepted file types and size limits
- public APIs that do not expose private customer email data
- moderation gating so approved testimonials are the only public-facing content

Additional security recommendations for production:
- use HTTPS in production
- rotate JWT secrets regularly
- add audit logging for ownership changes and moderation actions
- restrict file storage to a safe and managed blob or object store
- add additional validation for hostile or malformed content

## Future Improvements

Possible next improvements include:
- analytics dashboards for conversion and testimonial engagement
- email notifications for approvals, rejections, and new submissions
- support for multiple user roles beyond owner-only access
- sharing and embed analytics
- localization for multi-language testimonial collection
- AI-assisted moderation and summarization
- CI/CD automation and deployment pipelines
- advanced caching and performance tuning for public wall pages

## Author

TrustWall is a sample MERN project created for testimonial collection and social proof workflows.

Author: TrustWall Team

## License

This project is intended for educational and local-development use unless otherwise specified by the project owner.
