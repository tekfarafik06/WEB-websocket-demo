import WhiteBoardServer from "./whiteboard.js";
import express from "express";
import http from "http";
import path from "path";

const app = express();

app.use(express.json());

app.use("/", express.static(path.resolve("../../client/public/index.html")));

const webServer = http.createServer(app);
new WhiteBoardServer(webServer, "/api/v1");

const port = 3000;

webServer.listen(port, () => {
  console.info(`Server is at ${webServer.address().address}:${port}`)
  // console.info(`Server running on port ` + port);
});