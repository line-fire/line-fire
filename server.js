const { Server } = require("socket.io");
const http = require("http");
const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socket server active!");
});
const PORT = process.env.PORT || 3000;
const io = new Server(httpServer, {
    cors: {origin: "*",methods: ["GET", "POST"]}});
console.log(`--- SERVER Starting (Port: ${PORT}) ---`);
io.on("connection", (socket) => {
    socket.on("heartbeat", (data) => {
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        const mesajPaketi = {
            time: time,
            ...data};

        console.log(`[LOG] ${time} - ${data.machineName} data geting.`);
        io.emit("monitor_update", mesajPaketi);
    });
    socket.on("disconnect", () => {
        console.log(`[Leave] a disconnect.`);
    });
});
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server ${PORT} port ready!`);
});
