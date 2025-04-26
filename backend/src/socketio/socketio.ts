import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import 'dotenv/config';


const app = express();

/* Creates an HTTP server that wraps the Express app, making it compatible with both HTTP requests and WebSockets.Without this, you can’t run both HTTP and WebSocket on the same port easily.this server used in index.ts instead of app.listen */

/* When you’re not using Socket.IO (or any other WebSocket or real-time communication), and you're only using Express for regular HTTP routes, you don’t need to manually use http.createServer(app).
Instead, you can just do this:
app.listen(3000, () => {
  console.log("Server is running on port 3000");
}); 
Because under the hood, when you call app.listen(...), Express is already using Node’s http.createServer behind the scenes for you!

So this: app.listen(3000);Is actually shorthand for:
import http from 'http';
const server = http.createServer(app);
server.listen(3000)
So when you're not adding extra stuff like Socket.IO, you don't need to do it manually — Express handles it all for you.
Express cant handle socket.io because it doesn’t manage protocol upgrades.WebSockets start as an HTTP request, then upgrade to a WebSocket connection. they are http requests but not regular HTTP requests.Designed for real-time, bi-directional communication.
You open a connection and keep it alive, constantly sending/receiving data.
Express is Built to handle HTTP requests — like GET, POST, PUT, etc.
Every request → gets a response → done. It’s stateless.
It’s like a waiter who takes your order and walks away once it’s served.
*/
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
    }
});

/* Declares an object to keep track of connected users.The key is the user ID, and the value is the corresponding socket ID.Useful for sending messages to specific users later. { [key: string]: string } is ts dclaration */
const userSocketMap: { [key: string]: string } = {};

io.on('connection', (socket) => {
  console.log('Socket connected');
  
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    /* Adding a key-value pair to the userSocketMap object.Key → userId (a string identifying the user)Value → socket.id (the unique socket ID assigned by Socket.IO).userSocketMap[userId] is similar to userSocketMap.userId to get kev value in object. we are not using userSocketMap.userId coz it can only be used for known or fixed key value. since we don't know userId now will know when user connects that's why userSocketMap[userId] used. */
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    
  }

  socket.on('disconnect', () => {
    
      if (userId) {
        console.log(`User ${userId} disconnected with socket ID: ${socket.id}`);
        delete userSocketMap[userId];
      }
  });
});


export { io, userSocketMap, server, app };
