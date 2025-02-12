import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import { connectDB } from "./lib/db.js";
import eventRoutes from "./routes/event.route.js";
import authRoutes from "./routes/auth.route.js";
import eventRegisterRoutes from "./routes/event.register.js";
import { initializeSocket } from "./lib/socket.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb", extended: true }));

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/event-register", eventRegisterRoutes);

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});