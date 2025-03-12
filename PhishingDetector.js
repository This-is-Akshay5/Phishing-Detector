import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port for deployment

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

// VirusTotal API Key (Replace with your actual key)
const VIRUSTOTAL_API_KEY = "32c8bdf6a79bba9cf518b189d8937e6b179c1bd1da33214dd3768df582b2b21b";

// 🔍 Check URL for phishing
app.post('/check-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ message: "⚠️ Please provide a URL!" });

    try {
        const response = await fetch("https://www.virustotal.com/api/v3/urls", {
            method: 'POST',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        if (data.data?.attributes?.last_analysis_stats?.malicious > 0) {
            return res.json({ message: "🚨 Malicious URL detected! Be cautious." });
        }
        
        return res.json({ message: "✅ URL seems safe." });

    } catch (error) {
        console.error("Error checking URL:", error);
        return res.status(500).json({ message: "❌ Error checking URL." });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
