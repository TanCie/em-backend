import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
  return io;
}
export const notifyEvent = (eventId, updatedEvent) => {
  if (io) {
    io.emit("eventUpdated", updatedEvent);
  }
}