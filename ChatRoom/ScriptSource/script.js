
var g_username = "";

$(function() {
	var socket = io();

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
			g_username = username;
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
