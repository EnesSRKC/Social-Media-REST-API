const http = require("http");
const app = require("./app");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", ({ username, message, date }) => {
    io.emit("chat message", { username, message, date });
  });
});

server.listen(port);
