const { Server } = require("socket.io");

// Render'ın atadığı portu kullanır
const PORT = process.env.PORT || 3000;

// CORS ayarı: Her yerden gelen bağlantıyı kabul et
const io = new Server(PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

console.log(`--- SERVER BAŞLATILDI (Port: ${PORT}) ---`);

io.on("connection", (socket) => {
    // Client bağlandığında
    socket.on("register", (machineName) => {
        console.log(`[BAĞLANDI] ${machineName} sisteme giriş yaptı.`);
    });

    // Kalp atışı geldiğinde
    socket.on("heartbeat", (data) => {
        // Türkiye saati ile zaman damgası
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        console.log(`[PING - ${time}] ${data.machineName} -> CPU: %${data.cpuUsage}`);
    });

    // Bağlantı koptuğunda
    socket.on("disconnect", () => {
        console.log(`[AYRILDI] Bir makine bağlantıyı kesti.`);
    });
});

// Render'ın portu dinlemesi için sunucuyu aktif tutuyoruz (Socket.io standalone modunda bu yeterlidir)
io.listen(PORT);