import express from 'express';
import Event from '../models/event.model.js';

const router = express.Router();

router.post("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find event and increment attendees
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { attendees: 1 } }, // MongoDB `$inc` increments by 1
      { new: true } // Return updated document
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Successfully registered!", event });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/myreg-events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ joinedUsers: userId });
    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ createdBy: userId });
    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching created events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;