const { Server } = require("socket.io");
const http = require("http"); // Node.js'in kendi http modülünü ekledik

// 1. HTTP Sunucusunu oluşturuyoruz
const httpServer = http.createServer();

// 2. Render'ın verdiği portu alıyoruz
const PORT = process.env.PORT || 3000;

// 3. Socket.io'yu bu HTTP sunucusuna bağlıyoruz
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Her yerden erişime izin ver
        methods: ["GET", "POST"]
    }
});

console.log(`--- SERVER BAŞLATILIYOR (Port: ${PORT}) ---`);

io.on("connection", (socket) => {

    // Sinyal (Heartbeat) Geldiğinde
    socket.on("heartbeat", (data) => {
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        
        const mesajPaketi = {
            time: time,
            machineName: data.machineName,
            cpuUsage: data.cpuUsage
        };

        console.log(`[LOG] ${time} - ${data.machineName}`);

        // Mesajı Monitor'e ilet
        io.emit("monitor_update", mesajPaketi);
    });
    
    // Client ilk bağlandığında
    socket.on("register", (name) => {
        console.log(`[GİRİŞ] ${name} bağlandı.`);
    });
    
     socket.on("disconnect", () => {
        console.log(`[ÇIKIŞ] Bir bağlantı koptu.`);
    });
});

// 4. DİKKAT: Burada 'io.listen' DEĞİL, 'httpServer.listen' kullanıyoruz.
// Böylece portu sadece tek bir yapı dinlemiş oluyor.
httpServer.listen(PORT, () => {
    console.log(`✅ Sunucu ${PORT} portunda başarıyla çalışıyor!`);
});
