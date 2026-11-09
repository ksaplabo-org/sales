import express from "express";
import authorizeRole from "../middleware/authorize.js";
import clientController from "../controllers/clientController.js";

const clientRoutes = express.Router();

clientRoutes.get("/", clientController.findAll.bind(clientController));
clientRoutes.get("/:clientCode", clientController.findByCode.bind(clientController));
clientRoutes.post("/", authorizeRole(["2"]), clientController.create.bind(clientController));
clientRoutes.put("/:clientCode", authorizeRole(["2"]), clientController.update.bind(clientController));
clientRoutes.delete("/:clientCode", authorizeRole(["2"]), clientController.delete.bind(clientController));

export default clientRoutes;
