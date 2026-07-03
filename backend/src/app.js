import express from "express";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.listen(process.env.PORT || 3000);

app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);
