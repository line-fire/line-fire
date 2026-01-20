const http = require('http');

// Render.com'un atadığı portu kullan, yoksa 3000'i kullan
const PORT = process.env.PORT || 3000;

const CURRENT_RELEASE = {
    version: "1.0.0", // Ajan bu versiyonu görünce güncelleme var sanacak
    // Gerçekte buraya exe/js indirme linkini koyarsın
    downloadUrl: "https://senin-siten.com/files/update_v105.js" 
};

const server = http.createServer((req, res) => {
    // 1. Ajanlar versiyon kontrolü için buraya ping atar
    if (req.url === '/check-update') {
        console.log("[BULUT] Bir ajan güncelleme kontrolü yaptı.");
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(CURRENT_RELEASE));
    }
    
    // 2. Ajanlar tehdit bulunca buraya raporlar
    else if (req.url === '/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            console.log(`[ALARM] Tehdit Raporu: ${body}`);
            res.end("Rapor Alindi");
        });
    }
    
    // Sağlık kontrolü (Render servisi ayakta mı diye bakmak için)
    else {
        res.end("Vanguard Server Online");
    }
});

server.listen(PORT, () => {
    console.log(`Sunucu Render üzerinde ${PORT} portunda çalışıyor.`);
});
