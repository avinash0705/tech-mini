const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', // Local development
        'https://www.naukrigulf.com/', // Your Vercel deployment
        process.env.FRONTEND_URL, // Additional production URL from environment
        /\.vercel\.app$/, // Allow all Vercel subdomains
    ].filter(Boolean), // Remove any undefined values
    credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

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
        const url = `https://www.naukri.com/cloudgateway-mynaukri/naukri-content-management-services/v0/public/feed?${queryString}`;
        
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

// File Conversion API Proxy
app.post('/api/file/convert/TEXT', upload.single('file'), async (req, res) => {
    try {
        console.log('🎯 File conversion request received');
        console.log('📋 Headers:', req.headers);
        console.log('📁 File info:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file uploaded');
        console.log('📦 Body fields:', req.body);

        if (!req.file) {
            return res.status(400).json({ 
                error: 'No file uploaded',
                details: 'Please provide a file in the request' 
            });
        }

        // Parse the orchestration request from the form data
        let orchestrationRequest;
        try {
            orchestrationRequest = JSON.parse(req.body.orchestrationRequest);
        } catch (parseError) {
            return res.status(400).json({ 
                error: 'Invalid orchestration request',
                details: 'orchestrationRequest must be valid JSON' 
            });
        }

        // Prepare the form data for the external API
        const FormData = require('form-data');
        const formData = new FormData();
        
        // Add the orchestration request
        formData.append('orchestrationRequest', JSON.stringify(orchestrationRequest), {
            contentType: 'application/json'
        });
        
        // Add the file
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // External API URL
        const url = 'http://staging.naukrigulf.restapis.services.resdex.com/file-orchestration-services/v0/orchestration/files';
        
        console.log('🎯 Proxying to:', url);
        
        // Headers for the external API
        const headers = {
            'appid': req.headers.appid || '123',
            'flowKey': req.headers.flowkey || 'NG_CONVERT_TEXT',
            'stepId': req.headers.stepid || 'NG_TEXT_CONVERT',
            ...formData.getHeaders()
        };
        
        console.log('📤 Sending headers:', headers);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
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
        console.log('✅ File conversion successful!');
        
        res.json(data);
    } catch (error) {
        console.error('💥 File conversion error:', error);
        res.status(500).json({ 
            error: 'File conversion server error',
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
    console.log(`   POST http://localhost:${PORT}/api/file/convert/TEXT`);
    console.log(`   GET  http://localhost:${PORT}/health`);
});
