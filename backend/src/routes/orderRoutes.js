import express from "express";
import { authorizeRole } from "../middleware/auth.js";
import orderController from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.get("/", orderController.findAll.bind(orderController));
orderRoutes.post("/", orderController.create.bind(orderController));
orderRoutes.get("/:orderNo", authorizeRole(["1"]), orderController.findByNo.bind(orderController));
orderRoutes.put("/:orderNo", authorizeRole(["1"]), orderController.update.bind(orderController));
orderRoutes.delete("/:orderNo", authorizeRole(["1"]), orderController.delete.bind(orderController));

export default orderRoutes;
