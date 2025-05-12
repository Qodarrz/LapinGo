import { Router } from "express";
import { AchievementController } from "../controllers/achievements.controller.js";
import { AuthMiddleware } from "../middleware/auth.verify.js";

export class AchievementRoute {
  router;
  achievementController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.achievementController = new AchievementController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Perbaikan: Menggunakan instance controller yang sudah dibuat
    this.router.get("/", this.achievementController.getAllAchievements.bind(this.achievementController));
    this.router.get("/user/:user_id", this.achievementController.getUserAchievements.bind(this.achievementController));
    
    // Perbaikan: Menggunakan middleware dengan benar
    this.router.post("/sync", 
      (req, res, next) => this.authMiddleware.verifyToken(req, res, next),
      this.achievementController.syncUserStats.bind(this.achievementController)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new AchievementRoute().getRouter();