

$(function () {
	var socket = io();

	var submit = () => {
		var text = $("#message").val();
		if (!text) {
			return false;
		}
		socket.emit("chatMessage", $("#message").val());
		$("#message").val("");
		return false;
	};
	/*
	$("form").submit((e) => {
		e.preventDefault(); // prevents page reloading
		return submit();
		
		socket.emit("chat message", $("#message").val());
		$("#message").val("");
		return false;
		
	});
	*/

	socket.on("chatMessage", (msg) => {
		$("#messagelog").append($("<li>").text(msg));
	});

	
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
		
});
