const express = require("express");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const { Server } = require("socket.io");
const { CLIENT_ADDRESS, PORT } = require("./env");

const httpServer = require("http").createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ADDRESS,
  },
});

console.log({ CLIENT_ADDRESS });

io.on("disconnection", (socket) => {
  console.log("disconnect");
});

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    try {
      const action = JSON.parse(message);
      const { type, ...payload } = action;

      switch (type) {
        case "icecandidate": {
          const { to } = payload;
          socket.to(to).emit("message", JSON.stringify(action));
          return;
        }
        case "answer": {
          const { to } = payload;
          socket.to(to).emit("message", JSON.stringify(action));
          return;
        }

        case "offer": {
          const { to } = payload;
          socket.to(to).emit("message", JSON.stringify(action));
          return;
        }

        case "join-room": {
          const { id } = payload;
          const from = socket.id;
          socket.join(id);
          // join a room and notify all members except self
          socket.to(id).emit(
            "message",
            JSON.stringify({
              type: "room-member-entered",
              member: { id: from },
            })
          );

          return;
        }

        case "create-room": {
          const roomId = createRoom();
          // return a random id
          socket.emit(
            "message",
            JSON.stringify({ type: "new-room", room: { id: roomId } })
          );
          return;
        }

        default: {
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

function createRoom() {
  const createRoomId = () => {
    return uuid.v4().split("-")[4];
  };
  return createRoomId();
}

httpServer.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});
