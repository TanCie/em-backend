import Event from "../models/event.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createEvent = async (req, res) => {
  try {
    const { title, image, date, location, description, category, createdBy } = req.body;

    if (!title.trim() || !image || !date || !location.trim() || !description.trim() || !category.trim()) {
      return res.status(400).json({ message: "Title, image, date, location, description, and category are required" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newEvent = new Event({
      title,
      image: imageUrl,
      date,
      location,
      description,
      category,
      createdBy,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);

  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) res.status(404).json({ message: "No events found" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const deleteEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deleteEvent) res.status(404).json({ message: "Event not found" });
    res.status(201).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
}

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existingEvent = await Event.findById(id);
    if (
      req.body.location !== existingEvent.location ||
      req.body.category !== existingEvent.category ||
      req.body.date !== existingEvent.date
    ) {
      return res.status(400).json({ message: "Location, category, and due date cannot be changed." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body, // The data to update (from the request body)
      { new: true, runValidators: true } // Options: return the updated doc, validate updates
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
