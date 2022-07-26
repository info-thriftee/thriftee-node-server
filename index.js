const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');

//Socket Server
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: "*",
//   }
// })

const port = 8080;

const initRoutes = require('./api/routes');
const initEvents = require('./events/events');
const startJobs = require('./job/job');

//SETTINGS
app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload());

app.options('*', cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
})
var activeBidder = 0;
io.on("connection", (socket) => {
  console.log("User Connected.", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined chat room: ${data}`);
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("join_bidding", (data) => {
    socket.join(data);
    activeBidder = io.sockets.adapter.rooms.get(data).size;
    io.sockets.to(data).emit('increase_bidders', activeBidder);
    console.log(`User with ID: ${socket.id} joined bidding room: ${data}`);
  })

  socket.on("exit_bidding", (data) => {
    socket.to(data.room).emit("decrease_bidders", Number(activeBidder - 1));
    console.log(`User with ID: ${socket.id} exit bidding room: ${data.room}`);
    socket.leave(data.room);
  })

  socket.on("bid", (data) => {
    console.log("Bid Successfully!");
    socket.to(data.bidding_room).emit("update_bidding", data);
  })

  io.on("disconnect", () => {
    console.log("User Disconnected.", socket.id);
  })
})

server.listen(port, () => {
  console.log("Server is running in http://localhost:" + port);
  startJobs()
})

// app.listen(port, () => {
//   console.log("Server is running in http://localhost:" + port);
//   startJobs()
// })

app.get('/', (req, res) => {
  res.json("Server is running..");
})

initRoutes(app)
