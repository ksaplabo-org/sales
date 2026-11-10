import express from "express";
import authorizeRole from "../middlewares/authorize.js";
import productController from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll.bind(productController));
productRoutes.get("/:productCode", productController.findByCode.bind(productController));
productRoutes.post("/", authorizeRole(["2"]), productController.create.bind(productController));
productRoutes.put("/:productCode", authorizeRole(["2"]), productController.update.bind(productController));
productRoutes.delete("/:productCode", authorizeRole(["2"]), productController.delete.bind(productController));

export default productRoutes;
