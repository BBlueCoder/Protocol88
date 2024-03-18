const EventEmitter = require("events");
const { parse, parseToRequest, setContentTypeHeader } = require("./parser");

class Server extends EventEmitter {
  constructor(tcpServer) {
    super();
    this.tcpServer = tcpServer;
    this.init();
  }

  init() {
    this.tcpServer.on("connection", (socket) => {
      this.socket = socket;
      socket.on("data", (data) => {
        this.emit("request", parseToRequest(data.toString()));
      });

      socket.on("close", (hadError) => {
        this.emit("close", hadError);
      });

      socket.on("error", (error) => {
        this.emit("error", error);
      });
    });
  }

  send(body) {
    this.socket.write(
      parse({
        headers: { contentType: setContentTypeHeader(body) },
        body: body,
      })
    );
  }

  startServer(host, port, callback) {
    this.tcpServer.listen(port, host, () => {
      callback(this.tcpServer.address());
    });
  }
}

module.exports.Server = Server;
