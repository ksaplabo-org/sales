import express from "express";
import userController from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.get("/", userController.findAll);
userRoutes.get("/:userId", userController.findById);
userRoutes.post("/", userController.create);
userRoutes.put("/:userId", userController.update);
userRoutes.delete("/:userId", userController.delete);

export default userRoutes;
