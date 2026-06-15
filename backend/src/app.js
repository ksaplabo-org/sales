import express from "express";

import userRoutes from "#/routes/userRoutes.js";

const app = express();
app.use(express.json());
app.listen(process.env.PORT || 3000);

app.use("/api/users", userRoutes);
//app.use("/api/login", userRoutes);
