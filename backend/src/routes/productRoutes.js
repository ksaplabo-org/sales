import express from "express";
import productController from "../controllers/ProductController.js";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll.bind(productController));
productRoutes.get("/:productCode", productController.findByCode.bind(productController));
productRoutes.delete("/:productCode", productController.delete.bind(productController));

export default productRoutes;