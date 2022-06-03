module.exports = initChatEvent = (io) => {

  console.log("Chat events is running...")

  io.on("connection", (socket) => {
    console.log("User Connected.", socket.id);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    })
  
    io.on("disconnect", () => {
      console.log("User Disconnected.", socket.id);
    })
  })
}