"use strict"

var g_username = "";

$(function() {
	var socket = io();
	g_username = readUsernameCookie();
	console.log("Read username cookie: " + g_username);

	var submit = () => {
		var text = $("#message").val();
		if (!text) {
			return false;
		}
		var message = { text: text, username: g_username };
		socket.emit("chatMessage", message);
		$("#message").val("");
		return false;
	};

	socket.on("chatMessage",
		(msg) => {
			if (msg.username === g_username) {
				msg.text = "<b>" + msg.text + "</b>";
			}
			$("#messagelog").append($("<li>").html(msg.text));
			scrollToBottom();
		});

	socket.on("usernameResponse",
		(username) => {
			removeUsernameCookie();
			console.log("Removed username cookie");
			createUsernameCookie(username);
			g_username = username;
			console.log("Added username cookie: " + g_username);
			$("#username").text("You are " + username);
		});

	socket.on("userListUpdate",
		(users) => {
			$("#userlog").empty();
			for (var i = 0; i < users.length; ++i) {
				$("#userlog").append($("<li>").html(users[i]));
			}
		});

	socket.on("chatLogUpdate", (chatLogs) =>
	{
		for (var i = 0; i < chatLogs.length; ++i) {
			var msg = chatLogs[i];
			if (msg.username === g_username) {
				msg.text = "<b>" + msg.text + "</b>";
			}
			$("#messagelog").append($("<li>").html(msg.text));
		}
		scrollToBottom();
	});

	socket.emit("usernameRequest", g_username);

	$("#message").keypress(
		(e) => {
			if (e.keyCode === 13) {
				submit();
			}
		});

	$("#send").click(
		(e) => {
			submit();
		});

	function scrollToBottom() {
		$("#messagelog").animate({ scrollTop: $("#messagelog").prop("scrollHeight") }, 750);
	}

});

// For the following functions I used https://stackoverflow.com/questions/7215547/how-to-update-and-delete-a-cookie for reference

function createUsernameCookie(username, days = 12) {
	var expires;
	if (days) {
		var d = new Date();
		d.setTime(days * 86400000 + d.getTime());
		expires = "; expires=" + d.toGMTString();
	} else {
		expires = "";
	}
	document.cookie = "username=" + username + expires + "; path=/";
}

function readUsernameCookie() {
	var cookieName = "username=";
	var cookieArray = document.cookie.split(";");
	for (var i = 0; i < cookieArray.length; ++i) {
		var cookie = cookieArray[i];
		while (cookie.charAt(0) === " ") {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(cookieName) === 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return null;
}

function removeUsernameCookie() {
	createUsernameCookie("", -1);
}
