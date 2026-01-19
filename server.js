const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const io = new Server(PORT, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
console.log(`--- SERVER BAŞLATILDI ---`);
io.on("connection", (socket) => {
    socket.on("heartbeat", (data) => {
        // Gelen veriye saat ekle
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        
        const mesajPaketi = {
            time: time,
            machineName: data.machineName,
            cpuUsage: data.cpuUsage
        };

        // Render'ın kendi loguna yaz
        console.log(`[LOG] ${time} - ${data.machineName}`);

        // ÖNEMLİ: Bu mesajı bağlı olan SANA (Monitor'e) gönder
        io.emit("monitor_update", mesajPaketi);
    });
});

io.listen(PORT);
