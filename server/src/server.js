require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes("change_later"))) {
  throw new Error("A strong production JWT_SECRET is required");
}

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TrustWall server running on http://localhost:${PORT}`);
  });
};

startServer();