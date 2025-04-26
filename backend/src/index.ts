import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDb from './config/db';
import indexRouter from './routes/indexRouter';
import session from 'express-session';
import passport from 'passport';
import { stripeWebhooks } from './controllers/webhooks';
import { app, server } from './socketio/socketio';
import MongoStore from "connect-mongo";
/* app imported above coz You want your app to have only one Express instance.Shared app = consistency.If you did this instead in index.ts:const app = express(); Now you'd have two different app instances: One in socketio.ts (used for Socket.IO’s server same server here).One in index.ts (used for routes/middleware). That would lead to middleware or routes being registered on one app, while the server is using the other. Nothing would work as expected! 
You should always use a single Express instance (app) per project/server. In very rare, advanced microservice-like architectures, someone might create multiple Express apps in the same codebase. For example:
One app for admin routes. One app for public API routes*/





app.set("trust proxy", 1);


app.use(session({
    secret: process.env.SESSION_SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
       // remove the session document from the mongodb when cookie expires
       autoRemove: "native",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }));
  


app.use(session({
  secret: process.env.SESSION_SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

  

  app.use(passport.initialize());
  app.use(passport.session());


app.use(cookieParser());


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
};
  app.use(cors(corsOptions));

/* route for handling stripe webhooks endpoint url should be placed before express.json().  when payment succeeds we need to trigger this route to get event from stripe webhook and is in raw json format not in json format that express.json() converts too for request and response */
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.use(express.json());
app.use('/', indexRouter);




const PORT = process.env.PORT || 4000;
/* same server that socketio uses. here for express to handle HTTP requests — like GET, POST, PUT, etc not for real-time communication as socket.io.
when real time connection needed server in socketio.ts used(we import n use it) otherwise this server in index.ts used.
we use it by importing it as import { Request, Response } from "express"; */
server.listen(PORT, () => {
  connectDb();
  console.log(`Server started at http://localhost:${PORT}`);
});

// shared server with socket.io needs error handling outside.server.listen can't take error handling in callback
server.on('error', (err) => {
  console.error('Server failed to start:', err);
});