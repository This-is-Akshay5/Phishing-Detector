import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

// VirusTotal API Key (replace with your actual key)
const VIRUSTOTAL_API_KEY = "your-api-key-here";

// WHOIS Lookup API Key (replace if needed)
const WHOIS_API_KEY = "your-whois-api-key-here";

// 🔍 Check URL for phishing
app.post('/check-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ message: "⚠️ Please provide a URL!" });

    try {
        const vtResponse = await fetch(`https://www.virustotal.com/api/v3/urls`, {
            method: 'POST',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const vtData = await vtResponse.json();
        if (vtData.data && vtData.data.attributes.last_analysis_stats.malicious > 0) {
            return res.json({ message: "🚨 Malicious URL detected! Be cautious." });
        }
        
        return res.json({ message: "✅ URL seems safe." });

    } catch (error) {
        console.error("Error checking URL:", error);
        return res.json({ message: "❌ Error checking URL." });
    }
});

// 📧 Check Email for phishing
app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.json({ message: "⚠️ Please provide an email!" });

    const domain = email.split('@')[1];

    try {
        const whoisResponse = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOIS_API_KEY}&domainName=${domain}&outputFormat=json`);
        const whoisData = await whoisResponse.json();

        if (whoisData.WhoisRecord && whoisData.WhoisRecord.createdDate) {
            const domainAge = new Date().getFullYear() - new Date(whoisData.WhoisRecord.createdDate).getFullYear();
            if (domainAge < 1) {
                return res.json({ message: "⚠️ Email domain is very new. Be cautious!" });
            }
        }
        
        return res.json({ message: "✅ Email domain looks safe." });

    } catch (error) {
        console.error("Error checking email:", error);
        return res.json({ message: "❌ Error checking email." });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
