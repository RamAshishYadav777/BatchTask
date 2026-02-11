import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import DatabaseConnection from "./app/config/dbcon";
import productApiRoutes from "./app/routes/productApiRoutes";

dotenv.config();
const app = express();

// 1. Database
DatabaseConnection();

// 2. Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// 3. Routes
app.get("/health", (_, res) => res.json({ status: "OK" }));
app.use("/api/v1", productApiRoutes);

// 4. Production Frontend
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (_, res) => res.sendFile(path.join(frontendPath, "index.html")));
}

// 5. 404 & Start
app.use((_req, res) => res.status(404).json({ success: false, message: "Not Found" }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(` Server on port ${port}`));
