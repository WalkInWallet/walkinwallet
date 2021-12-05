const cors_proxy = require("cors-anywhere");
const port = 3005;

cors_proxy
  .createServer({
    originWhitelist: [],
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie"],
  })
  .listen(port, "localhost", () => {
    console.log("Running CORS Anywhere on localhost:" + port);
  });
