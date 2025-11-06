const express = require("express");
const http = require("http");
const cors = require("cors");
const compression = require("compression");
const { Server } = require("socket.io");

const routes = require("../src/app/routes/routes");
require("./database/index");

class App {
  constructor() {
    this.app = express(); // muda nome para "app" pra evitar confusão
    this.server = http.createServer(this.app);

    this.io = new Server(this.server, {
      cors: { origin: "*" }, // libera para qualquer origem (inclui Expo)
    });

    // Mapa para guardar os profissionais conectados
    this.connectedProfessionals = new Map();

    this.middlewares();
    this.sockets(); // inicializa Socket.io
    this.routes();

    // Torna acessível nos controllers
    this.app.set("io", this.io);
    this.app.set("connectedProfessionals", this.connectedProfessionals);
  }

  middlewares() {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "*"], // adiciona * para mobile
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    this.app.use(compression());
    this.app.use(
      express.json({
        limit: "80MB",
      })
    );
    this.app.options("*", cors());
  }

  sockets() {
    this.io.on("connection", (socket) => {
      console.log("🔌 Nova conexão via Socket:", socket.id);

      socket.on("register_professional", ({ professionalId }) => {
        console.log(`👨‍🔧 Profissional ${professionalId} conectado`);
        this.connectedProfessionals.set(professionalId, socket.id);
      });

      socket.on("disconnect", () => {
        for (let [id, sId] of this.connectedProfessionals.entries()) {
          if (sId === socket.id) {
            console.log(`❌ Profissional ${id} desconectado`);
            this.connectedProfessionals.delete(id);
            break;
          }
        }
      });
    });
  }

  routes() {
    this.app.use(routes);
  }
}

// Exporta o servidor http (com socket.io embutido)
module.exports = new App();
