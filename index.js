const Fastify = require("fastify"); // Backend Framework
const { Sequelize } = require("sequelize"); // Object Relational Mapper
const path = require("path");
const models = require("./src/models");

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

app.get("/v1/getNotifications", async (req, res) => {
  const notifications = await models.notifications(sequelize);
  let result = await notifications.findAll();
  res.send(result);
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
