import express from "express";
import noticeController from "../controllers/noticeController.js";

const noticeRoutes = express.Router();

noticeRoutes.get("/", noticeController.findAll.bind(noticeController));
noticeRoutes.get("/:noticeId", noticeController.findById.bind(noticeController));
noticeRoutes.post("/", noticeController.create.bind(noticeController));
noticeRoutes.put("/:noticeId", noticeController.update.bind(noticeController));
noticeRoutes.delete("/:noticeId", noticeController.delete.bind(noticeController));

export default noticeRoutes;
