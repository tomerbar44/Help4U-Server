module.exports = function (http) {
    const io = require('socket.io')(http);
    const { updateChatFromSocket } = require('./updateChat');

    // chat logic
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
        });

        /**
         * added currTaskID,currTaskChat
         */
        socket.on('chat message', function (msg, from, currTaskID, currTaskChat) {
            updateChatFromSocket(currTaskID, [...currTaskChat, { from: from, message: msg }]);
            io.emit('chat message', msg, from);
        });
        // we update the socket with task info
        socket.on("update task", function (task) {
            socket.taskID = task.taskID;
        })
        // every message sent, we update the chat property of the socket, when user disconnect we will post the new chat 
        socket.on('update chat', function (chat) {
            console.log('"updated chat" chat\n', chat)
            socket.chat = chat;


        })
    });

    return io;

}