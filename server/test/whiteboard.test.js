import WhiteboardServer from "../src/whiteboard.js";
import http from "http";
import WebSocket from "ws";

let webServer = undefined;

beforeAll((done) => {
  webServer = http.createServer();
  new WhiteboardServer(webServer, "/api/v1");
  webServer.listen(3001, () => done());
});

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => done());
});

describe("WhiteboardServer tests", () => {
  test("Connection opens successfully", (done) => {
    const connection = new WebSocket("ws://localhost:3001/api/v1");

    connection.on("open", () => {
      connection.close();
      done();
    });

    connection.on("error", (error) => {
      done(error);
    });
  });

  test("WhiteboardServer replies correctly", (done) => {
    const connection = new WebSocket("ws://localhost:3001/api/v1");
    let id = undefined;
    let name = undefined;
    let newed = false;

    connection.on("message", (data) => {
      data = JSON.parse(data);
      if (data.type == "close") {
        return;
      }
      if (!id) {
        expect(data.type).toEqual("id");
        id = data.id;
        name = data.canvas;
      } else if (!newed) {
        expect(data.type).toEqual("new");
        expect(data.canvas).toEqual(name);
        newed = true;
      } else {
        expect(data.type).toEqual("list");
        expect(data.boards.length).toEqual(1);
        connection.close();
        done();
      }
    });

    connection.on("error", (error) => {
      done(error);
    });
  });
  test("WhiteboardServer sends messages correctly", (done) => {
    const connection = new WebSocket("ws://localhost:3001/api/v1");
    let id = undefined;
    let name = undefined;

    connection.on("message", async (data) => {
      data = JSON.parse(data);
      if (data.type == "close") {
        return;
      }
      if (!id) {
        expect(data.type).toEqual("id");
        id = data.id;
        name = data.canvas;
        connection.send(
          JSON.stringify({
            id: id,
            canvas: name,
            oldPos: { x: 0, y: 0 },
            newPos: { x: 1, y: 1 },
          })
        );
      } else if (data.type == "draw") {
        expect(data.canvas).toEqual(name);
        expect(data.oldPos).toEqual({ x: 0, y: 0 });
        expect(data.newPos).toEqual({ x: 1, y: 1 });
        connection.close();
        // wait a sec for the server to close the connection
        await new Promise((r) => setTimeout(r, 500));
        done();
      }
    });
  });
});
