import express from "express";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import clientRoutes from "./routes/clientRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(express.json());
app.listen(process.env.PORT || 3000);

app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);
//app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
//app.use("/api/orders", orderRoutes);