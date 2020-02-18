module.exports = function (http) {
    const io = require('socket.io')(http);
    const { updateChatFromSocket } = require('./models/updateChat');
    
    // chat logic
    io.on('connection', function (socket) {
        console.log('a user connected');
    
        socket.on('disconnect', function () {
            console.log('user disconnected');
            updateChatFromSocket(socket.taskID, socket.chat);
    
        });
        socket.on('chat message', function (msg, from) {
    
            io.emit('chat message', msg, from);
    
        });
    
        // we update the socket with task info
        socket.on("update task", function (task) {
            socket.taskID = task.taskID;
            console.log('socket.task\n', socket.taskID);
    
        })
    
        // every message sent, we update the chat property of the socket, when user disconnect we will post the new chat 
        socket.on('update chat', function (chat) {
            socket.chat = chat;
    
        })
    });
    
    return io;

}




