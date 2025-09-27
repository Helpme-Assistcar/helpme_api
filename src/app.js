const express = require("express");
const cors = require("cors");
const compression = require("compression");

const routes = require("../src/app/routes/routes");

require("./database/index");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );
    this.server.use(compression());
    this.server.use(
      express.json({
        limit: "80MB",
      })
    );
    this.server.options("*", cors());
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
