# Simple Proxy

Clone this repo, run `npm i` to install all the packages.

Add `.env` file and type something as the example below

- PORT=3000
- HOST="0.0.0.0"
- TARGET_URL="https://openrouter.ai"
- PROXY_BASE_PATH="/openrouter-api"

Run `node index.js` to start the server.

All your requests from `http(s)://localhost:3000/openrouter-api` will be proxied to `https://openrouter.ai`
