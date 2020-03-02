"use strict";



var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var htmlSourceDir = "/HtmlSource";
var scriptSourceDir = "/ScriptSource";
var styleSourceDir = "/StyleSource";

app.get("/",
	(req, res) => {
		res.sendFile(__dirname + htmlSourceDir + "/app.html");
	});

app.get("/style",
	(req, res) => {
		res.sendFile(__dirname + styleSourceDir + "/style.css");
	});

app.get("/script",
	(req, res) => {
		res.sendFile(__dirname + scriptSourceDir + "/script.js");
	});

io.on("connection", (socket) => {

	// On chat message sent
	socket.on("chatMessage",
		(msg) => {
			// TODO Get timestamp
			io.emit("chatMessage", msg);
		});

	// On client connecting and trying to register a nickname
	socket.on("requestUsername",
		(username) => {
			// Username will be null/empty if no username found in cookies
			if (username) {

			} else {

			}
		});
});


http.listen(3000, function () {
	console.log("listening on *:3000");
});

function getAvailableUsername() {
	
}