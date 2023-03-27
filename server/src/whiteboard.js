import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

class Cli {
  constructor() {
    this.color = {
      red: Math.random() * 255,
      green: Math.random() * 255,
      blue: Math.random() * 255,
    };
    this.id = NaN;
    this.messages = [];
    this.socket = undefined;
    this.canvasName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
  }
}

export default class WhiteBoardServer {
  constructor(webserver, path) {
    this.clients = [];
    this.server = new WebSocketServer({ server: webserver, path: path });
    this.server.on("connection", (socket, request) => {
      this.onConnection(socket, request);
      socket.on("message", (message) => {
        this.onMessage(socket, message);
      });
      socket.on("close", () => {
        this.onClose(socket);
      });
    });
  }

  onConnection(socket, _request) {
    console.log("New connection");
    const cli = new Cli();
    cli.id = uuidv4();
    cli.socket = socket;
    socket.send(
      JSON.stringify({ type: "id", id: cli.id, canvas: cli.canvasName })
    );
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "new", canvas: cli.canvasName }));
    });
    socket.send(
      JSON.stringify({
        type: "list",
        boards: this.clients.map((c) => {
          return { canvas: c.canvasName, messages: c.messages };
        }),
      })
    );

    this.clients.push(cli);
  }
  onMessage(_socket, message) {
      console.log("Received message %s", message);
      const data = JSON.parse(message);
      const cli = this.clients.find((cli) => cli.id == data.id);
      const canv = this.clients.find((cli) => cli.canvasName == data.canvas);
      if (cli && canv) {
        canv.messages.push({
          color: cli.color,
          oldPos: data.oldPos,
          newPos: data.newPos,
        });
        this.server.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "draw",
              color: cli.color,
              canvas: data.canvas,
              oldPos: data.oldPos,
              newPos: data.newPos,
            })
          );
        });
      }
    }

    onClose(socket) {
      console.log("Connection closed");
      const cli = this.clients.find((cli) => cli.socket == socket);
      if (cli) {
        this.server.clients.forEach((client) => {
          client.send(JSON.stringify({ type: "close", canvas: cli.canvasName }));
        });
        this.clients = this.clients.filter((cli) => cli.socket != socket);
      }
    }
  }