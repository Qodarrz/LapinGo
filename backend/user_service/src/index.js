import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AuthRouter } from "./routers/auth.router.js";
import { UsersRouter } from "./routers/users.router.js";
import { AchievementRoute } from "./routers/achievement.router.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const base_url_fe = process.env.FE_URL;

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = new AuthRouter().getRouter();
const usersRouter = new UsersRouter().getRouter();
const achievementsRouter = new AchievementRoute().getRouter();
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/achievement", achievementsRouter);

// Route home
app.get("/", (req, res) => {
  res.status(200).json({ server: "on", message: "server is online." });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
