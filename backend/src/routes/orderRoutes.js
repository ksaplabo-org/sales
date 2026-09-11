import express from "express";
import orderController from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.get("/", orderController.findAll.bind(orderController));
orderRoutes.get("/:orderNo", orderController.findByNo.bind(orderController));
orderRoutes.put("/:orderNo", orderController.update.bind(orderController));
orderRoutes.delete("/:orderNo", orderController.delete.bind(orderController));

export default orderRoutes;
