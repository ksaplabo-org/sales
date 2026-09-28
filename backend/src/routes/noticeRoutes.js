import express from "express";
import noticeController from "../controllers/noticeController.js";

const noticeRoutes = express.Router();

noticeRoutes.get("/", noticeController.findAll.bind(noticeController));
noticeRoutes.delete("/:noticeId", noticeController.delete.bind(noticeController));

export default noticeRoutes;
