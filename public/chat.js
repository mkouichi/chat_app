const socket = io.connect("http://localhost:5000");

// Query DOM
const output = document.getElementById("output"),
    feedback = document.getElementById("feedback"),
    handle = document.getElementById("handle"),
    message = document.getElementById("message"),
    sendBtn = document.getElementById("sendBtn"),
    msgForm = document.getElementById("msgForm");

// Submit on enter
message.addEventListener("keypress", e => {
    if (e.which == 13 && !e.shiftKey) {
        submit();
        // e.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
        // event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)

        // FIX TYPING MESSAGE!
    }
});

// Emit events
msgForm.addEventListener("submit", submit);

const submit = e => {
    e.preventDefault();

    socket.emit("chat", {
        handle: handle.value,
        message: message.value
    });
};

// Typing
message.addEventListener("keypress", () => {
    socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chat", data => {
    // Clear typing message
    feedback.innerHTML = "";

    // Display message
    output.innerHTML += `<p><strong>${data.handle}: </strong> ${data.message}`;

    // Clear input
    message.value = "";
});

socket.on("typing", data => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});
