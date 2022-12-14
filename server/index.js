
require('dotenv').config();
console.log(process.env.HARPERDB_URL); // remove this after you've confirmed it working
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);
// Nouvelle instance de Serveur
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

//déclaration Chatbot, chatroom et array allUsers
  const CHAT_BOT = 'ChatBot';
    let chatRoom = ''; //non réaffectable
    let allUsers = []; // non réaffectable

  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    
    socket.on('join_room', (data) => {
        const { username, room } = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room

        let __createdtime__ = Date.now(); // Current timestamp
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
          });

        socket.emit('receive_message', {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        __createdtime__,
        });

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

    });
  });

app.get('/', (req, res) => {
    res.send('Hello world');
  });

server.listen(4000, () => 'Server is running on port 4000');