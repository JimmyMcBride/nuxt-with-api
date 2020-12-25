const express = require("express");
const consola = require("consola");
const bodyParser = require("body-parser");
const { Nuxt, Builder } = require("nuxt");

const app = express();

require("dotenv").config();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
const rootRouter = require("./api");
config.dev = process.env.NODE_ENV !== "production";

// Setup database
const conn = require("./dbConfig");

(async function start() {
  app.use(bodyParser.json()); // for parsing application/json

  conn.connect();

  app.use("/api", rootRouter);
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port} 🚀`,
    badge: true,
  });
})();
