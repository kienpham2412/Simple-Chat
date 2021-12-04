const fs = require("fs");
const http = require("http");
const express = require("./node_modules/express");
const bodyParser = require("./node_modules/body-parser");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const configData = fs.readFileSync("./config.json");
const config = JSON.parse(configData);
const ipAddress = config.serverIP + ":" + config.port;
const port = config.port;
var id = 0;

app.use(express.static("./html"));
app.use(bodyParser());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/register.html");
});

// return an id when cliend connect to server
app.get("/connect", (req, res) => {
    id++;
    var idRes = {
        id: id
    }
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', ipAddress);
    res.send(JSON.stringify(idRes));
});

app.get("/chatroom", (req, res) => {
    res.sendFile(__dirname + "/html/userio.html");
});

// listen to request on port
server.listen(port, () => {
    console.log("Listent to port " + port);
});

// register an event listener
io.on("connection", (socket) => {
    console.log("A client connect to server");
    socket.on("chat message", (message, id, name) => {
        // emit an event
        io.emit("broadcast", message, id, name);
    })
});