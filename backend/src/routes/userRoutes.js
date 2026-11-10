import express from "express";
import authorizeRole from "../middlewares/authorize.js";
import userController from "../controllers/UserController.js";

const userRoutes = express.Router();

/**
 * TODO
 * express.Routerに関数を渡すと、関数自体を渡すため、デフォルトだとthis===undefinedになってしまう。
 * 解消するには、
 * ① Controllerも定義をアロー関数にする
 *   アロー関数はthisを作らない(scopeが定義元となる)ため、expressに渡してthisはcontrollerになる。
 * ② expressに渡すときにbindする
 *   bindに渡したインスタンスをthisに固定するため、渡した関数のthisを強制できる。
 */
userRoutes.get("/", authorizeRole(["2"]), userController.findAll.bind(userController));
userRoutes.get("/:userId", userController.findById.bind(userController));

userRoutes.post("/", authorizeRole(["2"]), userController.create.bind(userController));
userRoutes.put("/:userId", userController.update.bind(userController));
userRoutes.delete("/:userId", authorizeRole(["2"]), userController.delete.bind(userController));

export default userRoutes;
