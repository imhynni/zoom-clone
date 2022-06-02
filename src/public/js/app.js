const socket = new WebSocket(`ws://${window.location.host}`); // socket : 서버로의 연결

// socket 이 connection을 open 했을 때
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  console.log("Just got this: ", message.data, " from the Server");
});

socket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

setTimeout(() => {
  socket.send("hello from the Browser!");
}, 10000);
