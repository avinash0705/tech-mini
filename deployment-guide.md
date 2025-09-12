# Deployment Guide: Next.js + Express Server

## 🎯 Recommended Deployment Strategy

### Architecture Overview
- **Frontend (Next.js)**: Deploy to Vercel
- **Backend (Express API)**: Deploy to Railway
- **Communication**: Frontend calls backend via API endpoints

## 🚀 Step 1: Deploy Express Server to Railway

### 1.1 Prepare Backend for Production

Create a `railway.json` in your project root:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server/api-server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Update server/api-server.js for production

Add environment variable support:

```javascript
const PORT = process.env.PORT || 3001;

// Update CORS for production
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend-domain.vercel.app', // Add your Vercel domain
        process.env.FRONTEND_URL
    ],
    credentials: true
}));
```

### 1.3 Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select your repository
4. Railway will auto-detect and deploy your Node.js app
5. Set environment variables:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-app.vercel.app`

## 🌐 Step 2: Deploy Next.js to Vercel

### 2.1 Update Next.js Configuration

Update your API calls to point to Railway backend:

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

### 2.2 Update API calls in your React components

Replace localhost URLs with environment variable:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// In your API calls:
const response = await fetch(`${API_BASE_URL}/api/unified-feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

### 2.3 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app`
5. Deploy!

## 🔧 Alternative: Single Platform Deployment

### Option A: Railway (Full-Stack)

Deploy both apps as separate services on Railway:

1. **Service 1**: Express API
   - Root directory: `/`
   - Start command: `node server/api-server.js`

2. **Service 2**: Next.js Frontend
   - Root directory: `/`
   - Build command: `npm run build`
   - Start command: `npm start`

### Option B: DigitalOcean App Platform

1. Create new app on DigitalOcean
2. Add two components:
   - **API Component**: Node.js service
   - **Web Component**: Next.js static site

## 🌍 Environment Variables Setup

### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

## 📊 Cost Comparison

| Platform | Frontend | Backend | Total/Month |
|----------|----------|---------|-------------|
| Vercel + Railway | Free | Free | $0 |
| Railway (Both) | $5 | $5 | $10 |
| DigitalOcean | $12 | - | $12 |
| AWS/GCP | $5-20 | $5-20 | $10-40 |

## 🔍 Production Checklist

- [ ] Environment variables configured
- [ ] CORS properly set for production domains
- [ ] API URLs updated in frontend
- [ ] Build scripts working
- [ ] Error handling and logging setup
- [ ] SSL certificates (auto with Vercel/Railway)
- [ ] Domain names configured
- [ ] Performance monitoring setup

## 🚨 Important Notes

1. **API Proxy**: Your Express server is crucial for adding authentication headers to Naukri APIs
2. **CORS**: Make sure to update CORS origins for production domains
3. **Environment Variables**: Never commit sensitive keys to Git
4. **Monitoring**: Set up error tracking (Sentry) and analytics
5. **Backup**: Consider database backups if you add persistent storage later

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check frontend URL in backend CORS config
2. **API Calls Failing**: Verify NEXT_PUBLIC_API_URL is correct
3. **Build Failures**: Check package.json scripts and dependencies
4. **500 Errors**: Check server logs for missing environment variables

### Debug Commands:
```bash
# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Test API endpoint
curl https://your-railway-app.up.railway.app/health

# Check Next.js build
npm run build
```
