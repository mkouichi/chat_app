const express = require("express"),
    socket = require("socket.io");

// DB Config
const db = process.env.mongoURL,
    // const db = require("./config/keys").mongoURI,
    mongoose = require("mongoose");

// App setup
let port = process.env.PORT;
// if (port == null || port == "") {
//     port = 5000;
// }
const app = express(),
    server = app.listen(port, function() {
        console.log("Server has started!");
    });

// const app = express(),
//     server = app.listen(5000, function() {
//         console.log("Server has started on port 5000!");
//     });

app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Schema setup
let chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name should be given!"]
    },
    message: {
        type: String,
        required: [true, "No message?"]
    }
});

let Chat = mongoose.model("Chat", chatSchema);

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");

        app.get("/", (req, res) => {
            // Show chat history from DB
            Chat.find({}, (err, chats) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Chat history: ${chats}`);

                    res.render("chat", { chats: chats });
                }
            });
        });
    })
    .catch(err => console.log("err: " + err));

// Socket setup
const io = socket(server);

io.on("connection", socket => {
    console.log("Made socket connection!", socket.id);

    // Handle chat event
    socket.on("chat", data => {
        // Display chat
        io.sockets.emit("chat", data);

        // Create and save chat to DB
        Chat.create(
            {
                name: data.handle,
                message: data.message
            },
            (err, chat) => {
                if (err) {
                    console.log("err: " + err);
                } else {
                    console.log(chat);
                }
            }
        );
    });

    // Typing
    socket.on("typing", data => {
        socket.broadcast.emit("typing", data);
    });
});
