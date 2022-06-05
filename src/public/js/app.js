const socket = io();

// chat
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

function showRoom(newCount) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}명)`;
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

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}명)`;
  addMessage(`${user} 님이 방에 들어왔어요!`);
});

socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount}명)`;
  addMessage(`${user} 님이 방을 떠났어요..`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});

// video call
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  // deviceId가 없을 때 실행
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  // devicedId가 있을 때 실행
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

getMedia();

function handleMuteClick() {
  console.log(
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled))
  );
  if (muted) {
    muteBtn.innerText = "음소거";
    muted = false;
  } else {
    muteBtn.innerText = "음소거 해제";
    muted = true;
  }
}
function handleCameraClick() {
  console.log(
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled))
  );
  if (cameraOff) {
    cameraBtn.innerText = "비디오 끄기";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "비디오 켜기";
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
