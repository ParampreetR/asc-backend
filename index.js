const Fastify = require("fastify"); // Backend Framework
let app = Fastify();

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
 * Bind and Listen on specified PORT and address
 * Note: Some Hosting providers wants developers to host
 *  Web Application at all interface, example `0.0.0.0`.
 */
app.listen(PORT, "localhost", (err, addr) => {
  if (err) {
    console.err(err);
    process.exit(1);
  }

  console.info("Server live at " + addr);
});
