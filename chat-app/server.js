const { server } = require("../protocol88/protocol88");

// Start the server on the specified IP address and port
server.startServer("127.0.0.1", 3800, (address) => {
  console.log("Server is listening on", address);
});

// Handle incoming requests
server.on("request", (data) => {
  const { message, username } = data.body;

  if (!message) {
    // Notify all clients that a new user has joined
    server.send(`User ${username} joined the chat!`);
  } else {
    // Send the message from the user to all clients
    server.send(`${username}: ${message}`);
  }
});

// Handle any errors that occur
server.on("error", (error) => {
  console.log("Server error:", error);
});
