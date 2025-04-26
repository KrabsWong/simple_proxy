const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const TARGET_URL = process.env.TARGET_URL;
const PROXY_BASE_PATH = process.env.PROXY_BASE_PATH;

const proxyOptions = {
  target: TARGET_URL,
  changeOrigin: true,
  pathRewrite: (path, _req) => {
    const newPath = path.replace(PROXY_BASE_PATH, "/api/v1");
    console.log(`Rewriting path from "${path}" to "${newPath}"`);
    return newPath;
  },
  on: {
    proxyReq: (proxyReq, req) => {
      // TODO: Log request count and some other infos. DO NOT LOG AUTH TOKEN
      console.log(
        `[${new Date().toISOString()}] Proxying request: ${req.method} ${req.originalUrl} -> ${API_URL}${proxyReq.path}`,
      );
    },
    proxyRes: (_proxyRes, _req, _res) => {},
  },
  logLevel: "error",
};

const openRouterProxy = createProxyMiddleware(proxyOptions);

app.use(PROXY_BASE_PATH, openRouterProxy);
console.log(`Proxy middleware mounted for path: ${PROXY_BASE_PATH}`);

app.get("/proxy-status", (_req, res) => {
  res.status(200).send("OpenRouter Proxy Server is running.");
});

app.listen(PORT, HOST, () => {
  console.log(`\nNode.js Proxy Server started.`);
  console.log(`Listening on: ${HOST}:${PORT}`);
  console.log(
    `Proxying requests from '${PROXY_BASE_PATH}' to '${API_URL}/api/v1'`,
  );
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // process.exit(1);
});
