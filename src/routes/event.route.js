import express from "express";
import { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Add protected routes here
router.post("/create", createEvent);

router.patch("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;