const Fastify = require("fastify"); // Backend Framework
const { Sequelize } = require("sequelize"); // Object Relational Mapper
const path = require("path");
const models = require("./src/models");
const sanitizer = require("string-sanitizer");

let app = Fastify();

// Saving data to "./database/database.sqlite". Using SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "database/database.sqlite"),
});

/*
 * Hosting providers wants all Web Applications to bind
 * on PORT specified by them through environment variable `PORT`
 */
const PORT = process.env.PORT | 8080;

/*
 * General Structure of Request Handler
 *  app.[get|post|puts](<path>, (<Request Object>, <Response Object>) => {
 *    // Process Request and Return response by
 *    // <Response Object>.send(<Data to return>)
 *  });
 */
app.get("/", (req, res) => {
  res.send("Hello World");
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
 * Bind and Listen on specified PORT and address
 * Note: Some Hosting providers wants developers to host
 *  Web Application at all interface, example `0.0.0.0`.
 */
app.listen(PORT, "localhost", async (err, addr) => {
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
