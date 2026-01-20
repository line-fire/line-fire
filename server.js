const http = require('http');

const PORT = process.env.PORT || 3000;
const LATEST_VERSION = "2.0.0"; // Hedeflediğimiz yeni sürüm
let clientStatus = {};

const server = http.createServer((req, res) => {
    
    // ----------------------------------------------------------------
    // 1. AJANLARIN RAPOR GÖNDERDİĞİ YER (API)
    // ----------------------------------------------------------------
    if (req.url === '/report-update-status' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            // Gelen veriyi kaydet: { name: "Mehmet", status: "ERROR", error: "Disk Dolu" }
            clientStatus[data.name] = {
                status: data.status, // "SUCCESS" veya "ERROR"
                errorMessage: data.error || "-",
                currentVersion: data.version,
                lastSeen: new Date()
            };
            console.log(`[RAPOR] ${data.name}: ${data.status}`);
            res.end("Rapor alındı");
        });
    }

    // ----------------------------------------------------------------
    // 2. AJANLARIN GÜNCELLEME KONTROLÜ YAPTIĞI YER
    // ----------------------------------------------------------------
    else if (req.url === '/check-update') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            version: LATEST_VERSION,
            url: "https://download1326.mediafire.com/48v3synk22ngLYkVHJBuaStUlxjQfVPotr_3bU3xHe-mLBL00y9-dAAOfa4E7Hh829tmDUrSwhqQ0Xreji58Q8uI9opZBIAM7kPtt4cnlpVUqfOTfjdwvd8KepnVKl2YgheXQkvzp-MlscJVml7urEXr-V8NpNmDCX4gYPAc5iJG/msb0cqy3szzlfb5/Two+Watch.exe"
        }));
    }

    // ----------------------------------------------------------------
    // 3. SENİN PANELİN (Geliştirici Dashboard)
    // ----------------------------------------------------------------
    else if (req.url === '/panel') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        
        let html = `
        <html>
        <head>
            <title>Geliştirici Update Paneli</title>
            <meta http-equiv="refresh" content="3"> <style>
                body { background: #121212; color: white; font-family: sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #333; padding: 10px; text-align: left; }
                td { border-bottom: 1px solid #333; padding: 10px; }
                .success { color: #00ff00; font-weight: bold; }
                .error { color: #ff3333; font-weight: bold; }
                .badge { padding: 5px 10px; border-radius: 4px; font-size: 12px; }
                .bg-green { background: #004d00; }
                .bg-red { background: #4d0000; }
            </style>
        </head>
        <body>
            <h2>📡 GÜNCELLEME DAĞITIM RAPORU (v${LATEST_VERSION})</h2>
            <table>
                <tr>
                    <th>Kullanıcı (PC)</th>
                    <th>Durum</th>
                    <th>Yüklü Sürüm</th>
                    <th>Hata Mesajı (Varsa)</th>
                    <th>Son İletişim</th>
                </tr>
        `;

        // Kayıtlı cihazları listele
        for (const [name, info] of Object.entries(clientStatus)) {
            const statusClass = info.status === 'SUCCESS' ? 'success' : 'error';
            const rowClass = info.status === 'SUCCESS' ? 'bg-green' : 'bg-red';
            
            html += `
                <tr class="${rowClass}">
                    <td>${name}</td>
                    <td class="${statusClass}">${info.status}</td>
                    <td>${info.currentVersion}</td>
                    <td>${info.errorMessage}</td> <td>${info.lastSeen.toLocaleTimeString()}</td>
                </tr>
            `;
        }

        html += `</table></body></html>`;
        res.end(html);
    } 
    else {
        res.end("Vanguard Server Running...");
    }
});

server.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
