import { Calque } from "./calque.js";
import drawer from "./drawer.js";

export class SubscriptionConfig {
  constructor(onOpen, onMessage, onClose, onError) {
    this.onOpen = onOpen;
    this.onMessage = onMessage;
    this.onClose = onClose;
    this.onError = onError;
  }
}

class WhiteBoardClient {
  constructor() {
    this.connection = new WebSocket("ws://localhost:3000/api/v1");
    this.boards = [];
    this.id = undefined;
    this.drawer = drawer;
    this.connection.onopen = () => {
      console.log("Connected to server");
    };

    this.connection.onmessage = (message) => {
      console.log("Message received from server");
      this.onMessage(message);
    };

    this.connection.onclose = () => {
      console.log("Connection closed");
    };

    this.connection.onerror = (error) => {
      console.log("Error occured: " + error);
    };
  }

  onMessage(message) {
    const data = JSON.parse(message.data);
    switch (data.type) {
      case "id":
        this.id = data.id;
        let canvas = drawer.addCanvas(data.id, true);
        this.boards.push(
          new Calque(data.id, data.canvas, canvas, (msg) => {
            this.send(msg);
          })
        );
        break;
      case "new":
        if (data.canvas === this.boards[0].name) return;
        let newCanvas = drawer.addCanvas(this.id);
        this.boards.push(
          new Calque(this.id, data.canvas, newCanvas, (msg) => {
            this.send(msg);
          })
        );
        break;
      case "list":
        data.boards.forEach((board) => {
          const newCanvas = drawer.addCanvas(this.id);
          const newBoard = new Calque(this.id, board.canvas, newCanvas, (msg) => {
          this.send(msg);
          });
          for (let i = 0; i < board.messages.length; i++) {
            newBoard.draw(board.messages[i].oldPos, board.messages[i].newPos, board.messages[i].color);
          }
          this.boards.push(newBoard);
         
        });
        break;
      case "draw":
        const board = this.boards.find((board) => board.name === data.canvas);
        if (board) board.draw(data.oldPos, data.newPos, data.color);
        break;
      case "close":
        const b = this.boards.find((board) => board.name === data.canvas);
        if (b) b.close();
        this.boards = this.boards.filter((board) => board.name !== data.canvas);
        break;
      default:
        console.log("Unknown message type");
    }
  }

  send(message) {
    if (typeof message === "string") {
      this.connection.send(message);
    } else {
      console.log("Sending message", JSON.stringify(message));
      this.connection.send(JSON.stringify(message));
    }
  }
}

export default new WhiteBoardClient();
