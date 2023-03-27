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