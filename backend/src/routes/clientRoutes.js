import express from "express";
import clientController from "../controllers/ClientController.js";

const clientRoutes = express.Router();

clientRoutes.get("/", clientController.findAll.bind(clientController));
clientRoutes.delete("/:clientCode", clientController.delete.bind(clientController));

export default clientRoutes;
