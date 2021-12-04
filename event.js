const events = require("events");
const event = new events.EventEmitter();

event.on("a new event", (data) => {
    console.log("this is a listener for an event with parameter " + data);
})

event.emit("a new event", "hello");