let socket = null;
let username = "";

// random tên
function randomName() {
  const names = ["Gấu", "Mèo", "Sói", "Cáo", "Rồng"];
  username = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
  document.getElementById("username").value = username;
}

// vào chat (BẮT BUỘC)
function joinChat() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Chưa nhập tên mà 😅");
    return;
  }

  // Ẩn login, hiện chat
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").classList.remove("hidden");

  // CHỈ LÚC NÀY MỚI CONNECT
  socket = io();
  socket.emit("join", username);

  socket.on("chat", (data) => {
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<b>${data.user}:</b> ${data.text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });

  socket.on("system", (text) => {
    const div = document.createElement("div");
    div.className = "system";
    div.innerText = text;
    messages.appendChild(div);
  });
}

// gửi tin
function send() {
  const input = document.getElementById("message");
  if (input.value.trim() !== "") {
    socket.emit("chat", input.value);
    input.value = "";
  }
}

// enter gửi
function enterSend(e) {
  if (e.key === "Enter") send();
}
