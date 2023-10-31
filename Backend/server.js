const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/check");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const dbURI =
  "mongodb+srv://rajpiyush278:18363779@cluster0.gaedcnp.mongodb.net/cluster1?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) =>
    server.listen(3002, () => {
      console.log("server is listening at 3002...");
    })
  )
  .catch((err) => console.log("some error occured"));

io.on("connection", (socket) => {
  socket.on("chat", (payload) => {
     io.emit('chat',payload)
  });
  socket.on('result', (payload) =>{
    io.emit('result',payload)
  })
  socket.on('king', (payload) =>{
    io.emit('king',payload)
  })
  socket.on('round',(payload)=>{
    io.emit('round',payload)
  })
  socket.on('remaining',(payload)=>{
     io.emit('remaining',payload)
  })
  socket.on('buttonStatus',(payload)=>{
     io.emit('buttonStatus',payload)
  })
  socket.on('prediction',(payload)=>{
     io.emit('prediction',(payload))
  })
  socket.on('predictionCount',(payload)=>{
     io.emit('predictionCount',(payload))
  })
  socket.on('score',(payload)=>{
     io.emit('score',payload)
  })

  socket.on('tableHeading',(payload)=>{
     io.emit('tableHeading',(payload))
  })

  socket.on('player',(payload)=>{
     io.emit('player',(payload))
  })
});