import express from "express";
import orderController from "../controllers/OrderController.js";

const orderRoutes = express.Router();

/**
 * TODO
 * express.Routerに関数を渡すと、関数自体を渡すため、デフォルトだとthis===undefinedになってしまう。
 * 解消するには、
 * ① Controllerも定義をアロー関数にする
 *   アロー関数はthisを作らない(scopeが定義元となる)ため、expressに渡してthisはcontrollerになる。
 * ② expressに渡すときにbindする
 *   bindに渡したインスタンスをthisに固定するため、渡した関数のthisを強制できる。
 */
orderRoutes.get("/", orderController.findAll.bind(orderController));
orderRoutes.get("/:orderNo", orderController.findById.bind(orderController));

orderRoutes.post("/", orderController.create.bind(orderController));
orderRoutes.put("/:orderNo", orderController.update.bind(orderController));
orderRoutes.delete("/:orderNo", orderController.delete.bind(orderController));

export default orderRoutes;
