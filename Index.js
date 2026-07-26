const WebSocket = require("ws");
const net = require("net");

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });
console.log("Cloud Proxy online");

wss.on("connection", (ws) => {
  const s = new net.Socket();
  s.connect(3336, "flex.zpool.ca", () => {
    console.log("Connected to ZPool TCP");
  });

  s.on("data", (d) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(d);
  });

  ws.on("message", (m) => {
    s.write(m);
  });

  s.on("close", () => ws.close());
  s.on("error", () => ws.close());
  ws.on("close", () => s.destroy());
  ws.on("error", () => s.destroy());
});
