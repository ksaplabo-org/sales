import express from "express";
import authorizeRole from "../middleware/authorize.js";
import noticeController from "../controllers/noticeController.js";

const noticeRoutes = express.Router();

noticeRoutes.get("/", noticeController.findAll.bind(noticeController));
noticeRoutes.get("/:noticeId", noticeController.findById.bind(noticeController));
noticeRoutes.post("/", authorizeRole(["2"]), noticeController.create.bind(noticeController));
noticeRoutes.put("/:noticeId", authorizeRole(["2"]), noticeController.update.bind(noticeController));
noticeRoutes.delete("/:noticeId", authorizeRole(["2"]), noticeController.delete.bind(noticeController));

export default noticeRoutes;
