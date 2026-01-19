const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const io = new Server(PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
console.log(`--- SERVER START (Port: ${PORT}) ---`);
io.on("connection", (socket) => {
    socket.on("register", (machineName) => {
        console.log(`[CONNECT] ${machineName} LOGIN DONE.`);
    });
    socket.on("heartbeat", (data) => {
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        console.log(`[PING - ${time}] ${data.machineName} -> CPU: %${data.cpuUsage}`);
    });
    socket.on("disconnect", () => {
        console.log(`[LEAVE] SERVER DISCONNECT.`);
    });
});
io.listen(PORT);
