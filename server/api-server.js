const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow Next.js frontend
    credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`🚀 ${req.method} ${req.path}`);
    console.log('📋 Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// API Routes

// Unified Feed API Proxy
app.post('/api/unified-feed', async (req, res) => {
    try {
        const queryString = new URLSearchParams(req.query).toString();
        const url = `https://www.naukri.com/cloudgateway-mynaukri/naukri-content-management-services/v0/public/unified/feed?${queryString}`;
        
        console.log('🎯 Proxying to:', url);
        
        // Headers from your working curl
        const headers = {
            'appid': '135',
            'content-type': 'application/json',
            'systemid': '135, jobseeker',
            'Cookie': 'J=0; _t_ds=50e036e51757329900-1050e036e5-050e036e5'
        };
        
        console.log('📤 Sending headers:', headers);
        console.log('📤 Sending body:', JSON.stringify(req.body, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            return res.status(response.status).json({ 
                error: `API Error: ${response.status}`,
                details: errorText 
            });
        }
        
        const data = await response.json();
        console.log('✅ Success! Returning data', data);
        
        res.json(data);
    } catch (error) {
        console.error('💥 Proxy error:', error);
        res.status(500).json({ 
            error: 'Proxy server error',
            details: error.message 
        });
    }
});

// Regular Feed API Proxy  
app.post('/api/feed', async (req, res) => {
    try {
        const queryString = new URLSearchParams(req.query).toString();
        const url = `https://www.naukri.com/cloudgateway-mynaukri/naukri-content-management-services/v0/public/unified/feed?${queryString}`;
        
        console.log('🎯 Proxying to:', url);
        
        // Headers from your working curl
        const headers = {
            'appid': '135',
            'systemid': 'naukriIndia',
            'Content-Type': 'application/json',
        };
        
        console.log('📤 Sending headers:', headers);
        console.log('📤 Sending body:', JSON.stringify(req.body, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            return res.status(response.status).json({ 
                error: `API Error: ${response.status}`,
                details: errorText 
            });
        }
        
        const data = await response.json();
        console.log('✅ Success! Returning data');
        
        res.json(data);
    } catch (error) {
        console.error('💥 Proxy error:', error);
        res.status(500).json({ 
            error: 'Proxy server error',
            details: error.message 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'API Server is running!', port: PORT });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/unified-feed`);
    console.log(`   POST http://localhost:${PORT}/api/feed`);
    console.log(`   GET  http://localhost:${PORT}/health`);
});
