const socket = io.connect("http://localhost:5000");

// Query DOM
const output = document.getElementById("output"),
    feedback = document.getElementById("feedback"),
    handle = document.getElementById("handle"),
    message = document.getElementById("message"),
    btn = document.getElementById("send");

// Emit events
btn.addEventListener("click", () => {
    socket.emit("chat", {
        message: message.value,
        handle: handle.value
    });
});

message.addEventListener("keypress", () => {
    socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chat", data => {
    output.innerHTML += `<p><strong>${data.handle}: </strong> ${data.message}`;
});

socket.on("typing", data => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
    window.setTimeout(() => {
        feedback.innerHTML = "";
    }, 5000);
});
