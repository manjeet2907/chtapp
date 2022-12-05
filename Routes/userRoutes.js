import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../Controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", protect, allUsers);

export default router;
