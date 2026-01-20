const http = require('http');

const PORT = process.env.PORT || 3000;

// RAM Veritabanı (Anlık durumlar burada tutuluyor)
let clientStatus = {};

const server = http.createServer((req, res) => {
    // CORS AYARLARI (Admin paneli dışarıdan veriyi okuyabilsin diye şart)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // 1. AJAN RAPORLAMA ENDPOINTI (POST)
    if (req.url === '/report' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            clientStatus[data.name] = data; // Veriyi kaydet
            console.log(`[LOG] ${data.name} durum bildirdi: ${data.status}`);
            res.end("OK");
        });
    }

    // 2. ADMIN PANELİ İÇİN VERİ ÇEKME ENDPOINTI (GET)
    else if (req.url === '/api/all-clients') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Bütün veriyi admin paneline yolla
        res.end(JSON.stringify(clientStatus));
    }

        
        
    // 3. GÜNCELLEME KONTROL
    else if (req. === '/check-update') {
        res.end(JSON.stringify({ version: "2.0.0", : "https://download1326.mediafire.com/48v3synk22ngLYkVHJBuaStUlxjQfVPotr_3bU3xHe-mLBL00y9-dAAOfa4E7Hh829tmDUrSwhqQ0Xreji58Q8uI9opZBIAM7kPtt4cnlpVUqfOTfjdwvd8KepnVKl2YgheXQkvzp-MlscJVml7urEXr-V8NpNmDCX4gYPAc5iJG/msb0cqy3szzlfb5/Two+Watch.exe" }));
    }
    
    else {
        res.end("Server Online");
    }
});

server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
