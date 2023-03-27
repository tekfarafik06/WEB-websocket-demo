import { Calque } from "./calque.js";
import drawer from "./drawer.js";

export class SubscriptionConfig {
  constructor(onOpen, onError) {
    this.onOpen = onOpen;
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

    this.connection.onerror = (error) => {
      console.log("Error occured: " + error);
    };
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
