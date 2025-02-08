import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: "Online",
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  attendees: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;