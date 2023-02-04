let listUser = [];
let listRoom = [];
let initSocketio = (socket, io) => {
  console.log("a user connected with id:", socket.id);
  socket.on("background", (data) => {
    socket.broadcast.emit("server-send-data-bg", data);
  });
  socket.on("client-login", (username) => {
    if (listUser.includes(username)) {
      socket.emit("login-status", false, username);
    } else {
      listUser.push(username);
      socket.userName = username;
      socket.emit("login-status", true, username);
      io.sockets.emit("server-send-list-user", listUser);
      io.to(socket.id).emit("server-send-list-room", listRoom);
    }
  });
  socket.on("client-logout", (username) => {
    listUser = listUser.filter((item, index) => {
      return item.username !== username;
    });

    io.sockets.emit("server-send-list-user", listUser);
    socket.emit("server-logout", true);
  });

  socket.on("client-join-room", (nameRoom) => {
    socket.join(nameRoom);

    listRoom = [];
    for (let r of socket.adapter.rooms) {
      listRoom.push(r[0]);
    }
    listRoom = listRoom.filter((item) => {
      return item !== socket.id;
    });
    io.sockets.emit("server-send-listroom", listRoom);
    socket.on("client-send-message", (message) => {
      io.to(nameRoom).emit("server-send-message", {
        username: socket.userName,
        message: message,
      });
    });
  });
};
module.exports = initSocketio;
