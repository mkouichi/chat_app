const socket = io.connect("http://localhost:5000");

// Query DOM
const chatWindow = document.getElementById("chat-window"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback"),
    handle = document.getElementById("handle"),
    message = document.getElementById("message"),
    sendBtn = document.getElementById("sendBtn"),
    msgForm = document.getElementById("msgForm");

// Scroll to the bottom
scroll();
console.log("Scroll fired on initial load!");

function scroll() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });
}

// Emit events
msgForm.addEventListener("submit", submit);

function submit(e) {
    e.preventDefault();

    socket.emit("chat", {
        handle: handle.value,
        message: message.value
    });
}

// Typing event + submit on enter
message.addEventListener("keypress", e => {
    socket.emit("typing", handle.value);

    if (e.which == 13 && !e.shiftKey) {
        submit(e);
    }
});

// Listen for events
socket.on("chat", data => {
    // Clear typing message
    feedback.innerHTML = "";

    // Display message
    output.innerHTML += `<p><strong>${data.handle}: </strong> ${data.message}`;

    // Scroll to the bottom
    if (window.pageYOffset > document.documentElement.scrollHeight - 800) {
        scroll();
        console.log("Scroll fired for a new message!");
    }

    // Clear input
    message.value = "";
});

// Display typing message
socket.on("typing", data => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;

    // Scroll to the bottom
    if (window.pageYOffset > document.documentElement.scrollHeight - 800) {
        scroll();
        console.log("Scroll fired for typing message!");
    }

    // Clear typing message in two seconds
    setTimeout(clearTyping, 2000);
    function clearTyping() {
        feedback.innerHTML = "";
    }
});
