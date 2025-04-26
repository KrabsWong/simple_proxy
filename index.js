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
  pathRewrite: (path, req) => {
    console.log(`Rewrite path from '${req.originalUrl}' to ${path}`)
  },
  on: {
    proxyReq: (_proxyReq, _req, _res) => {},
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
    `Proxying requests from 'http(s)://${HOST}:${PORT}/${PROXY_BASE_PATH}' to ${TARGET_URL}`
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
