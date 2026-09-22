const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressPath = require("path");
const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const publicRoutes = require("./routes/publicRoutes");
const publicWallRoutes = require("./routes/publicWallRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://trustwall-three.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      // Allow the configured frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow TrustWall Vercel preview deployments
      if (
        /^https:\/\/trustwall-[a-z0-9-]+-vin-c718\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(expressPath.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TrustWall API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/public", publicWallRoutes);
app.use("/api", testimonialRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const isMulterError = err.name === "MulterError";
  const statusCode = err.statusCode || (isMulterError && err.code === "LIMIT_FILE_SIZE" ? 413 : isMulterError ? 400 : err.name === "ValidationError" ? 400 : err.code === 11000 ? 409 : 500);
  const message = statusCode >= 500
    ? "Internal server error"
    : err.name === "ValidationError"
    ? Object.values(err.errors).map((validationError) => validationError.message).join(", ")
    : isMulterError && err.code === "LIMIT_FILE_SIZE"
      ? "Avatar image must be 5 MB or smaller"
      : isMulterError
        ? "Invalid avatar upload"
    : err.code === 11000
      ? "A space with this slug already exists"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;
