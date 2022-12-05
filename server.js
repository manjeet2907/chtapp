import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./Config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { Server } from "socket.io";
import path from "path";

// app configs goes here
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware goes here
// to accept data from backend
app.use(express.json());
// to connect frontend and backend on same cors policy
// origin: "https://talk-instant.web.app",
// origin: "https://localhost:3000",

// const corsOptions = {
//   origin: "https://talk-instant.web.app",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(cors());

// DB Config
connectDb();

// Api  EndPoints
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------
app.get("/", (req, res) => {
  res.send("API is running..");
});

// Listener
const server = app.listen(PORT, () =>
  console.log(`listening to local host: ${PORT}`)
);

// errorHandlers api end points-middlewares
app.use(notFound);
app.use(errorHandler);

//  cors: { origin: "https://talk-instant.web.app" }
//  cors: { origin: "https://localhost:3000" }

const io = new Server(server, {
  pingTimeout: 60000,
  // cors: { origin: "https://talk-instant.web.app" },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

//  "proxy":"http://localhost:5000/",
// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix frontend && npm run build --prefix frontend"
