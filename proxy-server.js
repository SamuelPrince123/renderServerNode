const corsAnywhere = require("cors-anywhere");

const host = "0.0.0.0";
const port = 8080;

corsAnywhere
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
    httpProxyOptions: {
      changeOrigin: true,
      secure: false,
    },
  })
  .listen(port, host, () => {
    console.log(`Running CORS Anywhere on ${host}:${port}`);
  });
