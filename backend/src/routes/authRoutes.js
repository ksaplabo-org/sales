import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRoutes = express.Router();
const controller = new AuthController();

authRoutes.post("/", controller.login.bind(controller));

export default authRoutes;
