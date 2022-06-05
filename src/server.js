import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 같은 서버에서 http, webSocket 둘 다 작동시키기
const httpServer = http.createServer(app); // 내 http 서버에 접근할 수 있게 됨
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});

// chat

// function publicRooms() {
//   const {
//     sockets: {
//       adapter: { sids, rooms },
//     },
//   } = wsServer;
//   const publicRooms = [];
//   rooms.forEach((_, key) => {
//     if (sids.get(key) === undefined) {
//       publicRooms.push(key);
//     }
//   });
//   return publicRooms;
// }

// function countUser(roomName) {
//   return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }

// wsServer.on("connection", (socket) => {
//   socket["nickname"] = "익명";
//   wsServer.sockets.emit("room_change", publicRooms());

//   socket.onAny((event) => {
//     console.log(wsServer.sockets.adapter);
//     console.log(`Socket Event : ${event}`);
//   });
//   socket.on("enter_room", (roomName, done) => {
//     socket.join(roomName);
//     done(countUser(roomName));
//     socket.to(roomName).emit("welcome", socket.nickname, countUser(roomName));
//     wsServer.sockets.emit("room_change", publicRooms());
//   });
//   socket.on("disconnecting", () => {
//     socket.rooms.forEach((room) => {
//       socket.to(room).emit("bye", socket.nickname, countUser(room) - 1);
//     });
//   });
//   socket.on("disconnect", () => {
//     wsServer.sockets.emit("room_change", publicRooms());
//   });
//   socket.on("nickname", (nickname) => {
//     socket["nickname"] = nickname;
//   });
//   socket.on("new_message", (roomName, msg, done) => {
//     socket.to(roomName).emit("new_message", `${socket.nickname} : ${msg}`);
//     done();
//   });
// });

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(3000, handleListen);
