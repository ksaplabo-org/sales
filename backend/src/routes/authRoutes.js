import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRoutes = express.Router();

authRoutes.post("/", AuthController.login.bind(AuthController));

export default authRoutes;
