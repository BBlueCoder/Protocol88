const { Client } = require("./client");
const { Server } = require("./server");
const net = require("net");

module.exports = {
  server: new Server(net.createServer()),
  connectToServer: function (host, port) {
    return new Client(net.createConnection({ host: host, port: port }));
  },
};
