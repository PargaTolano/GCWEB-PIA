require('./config');

const express = require('express');
const path = require('path');

//app, servidor y socket
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//configuration
const connectDB = require('./config/db');

//middlewares
const cors = require('cors');
const bodyParser = require('body-parser');

//utilities
const {v1:uuid} = require('uuid');

//use middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended:true}));

connectDB();

app.use(express.static(path.join(__dirname,'dist')));


const queue = [];

const defaultRoom = `GameRoom${Date.now()}`;
const rooms = {};

/**
 * Will connect a socket to a specified room
 * @param socket A connected socket.io socket
 * @param room An object that represents a room from the `rooms` instance variable object
 */
const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    // store the room id in the socket for future use
    socket.roomId = room.id;
    console.log(socket.id, "Joined", room.id);
  });
};

/**
 * Will make the socket leave any rooms that it is a part of
 * @param socket A connected socket.io socket
 */
const leaveRooms = (socket) => {
  const roomsToDelete = [];
  for (const id in rooms) {
    const room = rooms[id];
    // check to see if the socket is in the current room
    if (room.sockets.includes(socket)) {
      socket.leave(id);
      // remove the socket from the room object
      room.sockets = room.sockets.filter((item) => item !== socket);
    }
    // Prepare to delete any rooms that are now empty
    if (room.sockets.length == 0) {
      roomsToDelete.push(room);
    }
  }

  // Delete all the empty rooms that we found earlier
  for (const room of roomsToDelete) {
    delete rooms[room.id];
  }
};


io.on('connection', (socket) => {

  // give each socket a random identifier so that we can determine who is who when
  // we're sending messages back and forth!
  id = socket.id;
  player_id = uuid();
  room = "GameRoom"+Date.now();

  socket.join(defaultRoom);

  console.log(id)

  io.to(id).emit('coneccion-made', {player_id,room});
  io.to(id).emit('game-found', {room:defaultRoom})
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('update-position',params=>{
    socket.to(params.room).emit('update-enemy-position', {x: params.x, y: params.y, z: params.z, ry: params.ry});
  });
});

app.use( require('./routes/player.routes'));
app.use( require('./routes/match.routes' ));

http.listen( process.env.PORT, process.env.HOST, () => {
  console.log(`listening on *:${process.env.PORT}`);
});