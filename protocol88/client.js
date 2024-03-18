const EventEmitter = require("events");
const { parse, parseToRequest, setContentTypeHeader } = require("./parser");

class Client extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.init();
  }

  init() {
    this.client.on("data", (data) => {
      this.emit("response", parseToRequest(data.toString()));
    });

    this.client.on("error", (error) => {
      console.log("Error from Server!", error);
    });

    this.client.on("end", () => {
      console.log("Server ended the connection!");
      this.send("why?");
    });
  }

  send(body) {
    this.client.write(
      parse({
        headers: { contentType: setContentTypeHeader(body) },
        body: body,
      })
    );
  }
}

module.exports.Client = Client;
