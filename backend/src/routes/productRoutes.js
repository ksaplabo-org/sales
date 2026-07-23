import express from "express";
import productController from "../controllers/ProductController.js";

const productRoutes = express.Router();

productRoutes.get("/", productController.findAll.bind(productController));

export default productRoutes;