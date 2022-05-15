const Fastify = require("fastify"); // Backend Framework
const { Sequelize } = require("sequelize"); // Object Relational Mapper
const path = require("path");
const sqlite3 = require("sqlite3");
const models = require("./src/models");
const sanitizer = require("string-sanitizer");
const fastifySession = require("@fastify/session");
const fastifyCookie = require("fastify-cookie");
const sqliteStoreFactory = require("express-session-sqlite").default;

const SqliteStore = sqliteStoreFactory(fastifySession);
let app = Fastify();

app.register(fastifyCookie);
app.register(fastifySession, {
  secret: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  cookie: {
    secure: false,
  },
  store: new SqliteStore({
    // Database library to use
    driver: sqlite3.Database,
    // Saving sessions to "database/session.sqlite"
    path: path.resolve(__dirname, "database/session.sqlite"),
    // Session TTL in milliseconds
    ttl: 50000,
    // (optional) Session id prefix. Default is no prefix.
    prefix: "s:",
  }),
});

// Saving data to "./database/database.sqlite". Using SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "database/database.sqlite"),
});

/*
 * Hosting providers wants all Web Applications to bind
 * on PORT specified by them through environment variable `PORT`
 */
const PORT = process.env.PORT || 8080;

/*
 * General Structure of Request Handler
 *  app.[get|post|puts](<path>, (<Request Object>, <Response Object>) => {
 *    // Process Request and Return response by
 *    // <Response Object>.send(<Data to return>)
 *  });
 */
app.get("/", (req, res) => {
  res.send("AS Collage API");
});

/*
 * Notifications
 */
app.get("/v1/getNotifications", async (req, res) => {
  const notifications = await models.notifications(sequelize);
  let result = await notifications.findAll();
  res.send(result);
});

/*
 * QuickLinks
 */
app.get("/v1/getQuickLinks", async (req, res) => {
  const quickLinks = await models.quickLinks(sequelize);
  let result = await quickLinks.findAll();
  res.send(result);
});

/*
 * Events
 */
app.get("/v1/getEvents", async (req, res) => {
  const events = await models.events(sequelize);
  let result = await events.findAll();
  res.send(result);
});

/*
 * Articles
 */
app.get("/v1/getArticles", async (req, res) => {
  const articles = await models.articles(sequelize);
  let result = await articles.findAll();
  res.send(result);
});

/*
 * Add new notification to database
 *
 * Requires "Content-Type: application/json"
 * Parameters: title, url
 */
app.post("/v1/addNotification", async (req, res) => {
  if (req.body.title && req.body.url) {
    try {
      const notifications = await models.notifications(sequelize);
      await notifications.create({
        title: sanitizer.sanitize(req.body.title),
        url: sanitizer.sanitize(req.body.url),
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Add new quicklink to database
 *
 * Requires "Content-Type: application/json"
 * Parameters: title, url, info?
 */
app.post("/v1/addQuickLink", async (req, res) => {
  if (req.body.title && req.body.url) {
    try {
      const quickLinks = await models.quickLinks(sequelize);
      await quickLinks.create({
        title: sanitizer.sanitize(req.body.title),
        url: sanitizer.sanitize(req.body.url),
        info: req.body.info ? sanitizer.sanitize(req.body.info) : undefined,
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Add new event to database
 *
 * Requires "Content-Type: application/json"
 * Parameters: id, title, info?
 */
app.post("/v1/addEvents", async (req, res) => {
  if (req.body.title && req.body.url) {
    try {
      const events = await models.events(sequelize);
      await events.create({
        id: sanitizer.sanitize(req.body.id),
        title: sanitizer.sanitize(req.body.title),
        info: req.body.info ? sanitizer.sanitize(req.body.info) : undefined,
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Add new event to database
 *
 * Requires "Content-Type: application/json"
 * Parameters: title, url, info?
 */
app.post("/v1/addArticle", async (req, res) => {
  if (req.body.title && req.body.url) {
    try {
      const events = await models.events(sequelize);
      await events.create({
        title: sanitizer.sanitize(req.body.title),
        url: sanitizer.sanitize(req.body.url),
        info: req.body.info ? sanitizer.sanitize(req.body.info) : undefined,
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Delete notification from database
 *
 * Requires "Content-Type: application/json"
 * Parameters: id
 */
app.post("/v1/delNotification", async (req, res) => {
  if (req.body.id) {
    try {
      const notifications = await models.notifications(sequelize);
      await notifications.destroy({
        where: {
          id: parseInt(req.body.id),
        },
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Delete quicklink from database
 *
 * Requires "Content-Type: application/json"
 * Parameters: id
 */
app.post("/v1/delQuickLink", async (req, res) => {
  if (req.body.id) {
    try {
      const quickLinks = await models.quickLinks(sequelize);
      await quickLinks.destroy({
        where: {
          id: parseInt(req.body.id),
        },
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Delete event from database
 *
 * Requires "Content-Type: application/json"
 * Parameters: id
 */
app.post("/v1/delEvent", async (req, res) => {
  if (req.body.id) {
    try {
      const events = await models.events(sequelize);
      await events.destroy({
        where: {
          id: parseInt(req.body.id),
        },
      });
      res.send("OK");
    } catch (err) {
      res.status(500);
    }
  } else {
    res.status(404);
  }
});

/*
 * Bind and Listen on specified PORT and address
 * Note: Some Hosting providers wants developers to host
 *  Web Application at all interface, example `0.0.0.0`.
 */
app.listen(PORT, "0.0.0.0", async (err, addr) => {
  if (err) {
    console.log("[  -  ] Error in binding to port");
    console.err(err);
    process.exit(1);
  }
  try {
    await sequelize.authenticate();
    await models.syncAllTables(sequelize);
  } catch (err) {
    console.log("[  -  ] Error in setting up database");
    console.log(err);
    process.exit(1);
  }
  console.info("Server live at " + addr);
});
