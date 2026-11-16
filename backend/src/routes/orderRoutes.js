import express from "express";
import authorizeRole from "../middleware/authorize.js";
import orderController from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.get("/", orderController.findAll.bind(orderController));
orderRoutes.get("/:orderNo", orderController.findByNo.bind(orderController));
orderRoutes.post("/", authorizeRole(["1"]), orderController.create.bind(orderController));
orderRoutes.put("/:orderNo", authorizeRole(["1"]), orderController.update.bind(orderController));
orderRoutes.delete("/:orderNo", authorizeRole(["1"]), orderController.delete.bind(orderController));

export default orderRoutes;
