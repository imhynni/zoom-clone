import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 같은 서버에서 http, webSocket 둘 다 작동시키기
const server = http.createServer(app); // 내 http 서버에 접근할 수 있게 됨
const wss = new WebSocket.Server({ server }); // http 서버 위에 ws 서버 만들기

// socket : 연결된 브라우저
wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  // socket에 있는 메서드 사용
  // socket으로 직접적인 연결을 제공해줌
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });
  socket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });
  socket.send("hello!!!");
});

server.listen(3000, handleListen);
