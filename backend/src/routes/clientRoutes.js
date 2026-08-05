import express from "express";
import ClientController from "../controllers/clientController.js";

const clientRoutes = express.Router();

clientRoutes.get("/", ClientController.findAll.bind(ClientController));
clientRoutes.get("/:clientCode", ClientController.findByCode.bind(ClientController));
clientRoutes.delete("/:clientCode", ClientController.delete.bind(ClientController));

export default clientRoutes;
