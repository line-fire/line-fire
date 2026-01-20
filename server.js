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
            version: "2.0.0", 
            url: "https://download1350.mediafire.com/ibv77fm5wskg50Z435PxyRUKybBmctAaf_EjH3IT1WpSQCn5XSsBnHfkG7EMD7nA5UKB2GmbXTAfWiUdTuxqRbzyIht_SbPjCii1f_EspsjdkekWAfioCQLLsNkgx3-TzQhGhGwKlkLjc_yUGZnkJ6JK_wRLYxKrd2Nvl9IKpJXb/z2u9ad8ugw96jar/runrage.exe" 
        }));
    }

    else {
        res.end("Vanguard Server Online (Render)");
    }
});

server.listen(PORT, () => {
    console.log(`Server Render portunda (${PORT}) çalışıyor.`);
});
