const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const OPENROUTER_URL = process.env.OPENROUTER_URL;
const OPENROUTER_PATH = process.env.OPENROUTER_PATH;

// Build proxy options based on the env settings
const openRouterProxyOptions = {
  target: OPENROUTER_URL,
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

// const somethingElseProxyOptions = {}

const openRouterProxy = createProxyMiddleware(openRouterProxyOptions);
// Create proxy middleware for different proxy settings
// const somethingElseProxySettings = createProxyMiddleware(openRouterProxyOptions);

app.use(OPENROUTER_PATH, openRouterProxy);
// app.use(OPENROUTER_PATH, openRouterProxy);
console.log(`Proxy middleware mounted for path: ${OPENROUTER_PATH}`);

app.get("/", (_req, res) => {
  res.status(200).send("Struggle for Y.");
})

app.get("/proxy-status", (_req, res) => {
  res.status(200).send("Proxy Server is running.");
});

app.listen(PORT, HOST, () => {
  console.log(`\nNode.js Proxy Server started.`);
  console.log(`Listening on: ${HOST}:${PORT}`);
  console.log(
    `Proxying requests from 'http(s)://${HOST}:${PORT}/${OPENROUTER_PATH}' to ${OPENROUTER_URL}`
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
