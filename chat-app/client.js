const { connectToServer } = require("../protocol88/protocol88");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = connectToServer("127.0.0.1", 3800);

let username;

function clear() {
  console.log();
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(0);
}

client.on("response", async (response) => {
  clear();
  console.log(response.body);
  askAndSend("Write a message: ");
});

async function askAndSend(prompt) {
  const answer = await rl.question(prompt);

  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(0);

  if (username) {
    client.send({ username, message: answer });
  } else {
    username = answer;
    client.send({ username });
  }
}

(async () => {
  await askAndSend("Enter your username: ");
})();
