const socket = io();

const welcome = document.getElementById("welcome");
const nickDiv = welcome.querySelector("#nickname");
const nickForm = nickDiv.querySelector("form");
const roomDiv = welcome.querySelector("#roomName");
const roomForm = roomDiv.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let nickname = "익명";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", roomName, value, () => {
    addMessage(`${nickname}(나) : ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  nickname = input.value;
  input.value = "";
  socket.emit("nickname", nickname);
  welcomeTitle = welcome.querySelector("div");
  nickDiv.hidden = true;
  welcomeTitle.innerText = `반가워요, ${nickname}! :)`;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

nickForm.addEventListener("submit", handleNicknameSubmit);
roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} 님이 방에 들어왔어요!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} 님이 방을 떠났어요..`);
});

socket.on("new_message", addMessage);
