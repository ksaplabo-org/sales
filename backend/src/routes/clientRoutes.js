import express from "express";
import clientController from "../controllers/ClientController.js";

const clientRoutes = express.Router();

clientRoutes.get("/", clientController.findAll.bind(clientController));

export default clientRoutes;
