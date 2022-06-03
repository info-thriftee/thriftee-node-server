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

const port = 3001;

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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
})

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
