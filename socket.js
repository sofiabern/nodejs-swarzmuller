let io;

module.exports = {
  init: (httpServer, configs) => {
    io = require("socket.io")(httpServer, configs);
    return io;
  },
  getIO:() => {
    if(!io) {
        throw new Error('Socket.io not initialized')
    }
    return io
  }
};