import express from "express";
import clientController from "../controllers/ClientController.js";

const clientRoutes = express.Router();

clientRoutes.post("/", clientController.create.bind(clientController));
export default clientRoutes;
