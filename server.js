const { Server } = require("socket.io");
const http = require("http");

// 1. Render'ın "Çalışıyor musun?" kontrolüne cevap vermek ZORUNDAYIZ.
// Yoksa "Port tespit edilemedi" hatası verir.
const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socket Sunucusu Calisiyor - Her sey yolunda!");
});

const PORT = process.env.PORT || 3000;

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

console.log(`--- SERVER BAŞLATILIYOR (Port: ${PORT}) ---`);

io.on("connection", (socket) => {
    socket.on("file_data", (data) => {
    // Gelen dosya verisini Monitör'e pasla
    io.emit("monitor_file_update", data);
    console.log(`[DOSYA] ${data.machineName} dosya listesi gönderdi.`);
});
    // Client bağlandığında
    socket.on("register", (name) => {
        console.log(`[GİRİŞ] ${name} bağlandı.`);
    });

    // Kalp atışı geldiğinde
    socket.on("heartbeat", (data) => {
        const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
        
        const mesajPaketi = {
            time: time,
            machineName: data.machineName,
            cpuUsage: data.cpuUsage
        };

        // Konsola ve Monitör'e bas
        console.log(`[LOG] ${time} - ${data.machineName}`);
        io.emit("monitor_update", mesajPaketi);
    });

    socket.on("disconnect", () => {
        console.log(`[ÇIKIŞ] Bir bağlantı koptu.`);
    });
});

// 2. "0.0.0.0" ekleyerek Render'ın dışarıdan erişmesini garanti ediyoruz.
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Sunucu ${PORT} portunda ve 0.0.0.0 adresinde çalışıyor!`);
});

