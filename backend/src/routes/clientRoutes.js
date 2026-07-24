import express from "express";
import clientController from "../controllers/ClientController.js";

const clientRoutes = express.Router();
clientRoutes.get("/", clientController.findAll.bind(clientController));
clientRoutes.get("/:clientCode", clientController.findByCode.bind(clientController));

clientRoutes.post("/", clientController.create.bind(clientController));
clientRoutes.put("/:clientCode", clientController.update.bind(clientController));

export default clientRoutes;
