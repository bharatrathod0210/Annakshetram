# Environment Variables Setup Guide

## ⚠️ IMPORTANT: Security Notice

**NEVER commit `.env` files to Git!**

The `.env` files contain sensitive information like:
- Database credentials
- API keys
- Secret tokens
- Payment gateway keys

## Setup Instructions

### 1. Client (Frontend) Setup

```bash
cd client
cp .env.example .env
```

Then edit `client/.env` and add your values:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
VITE_CLIENT_URL=http://localhost:5173
```

### 2. Server (Backend) Setup

```bash
cd server
cp .env.example .env
```

Then edit `server/.env` and add your actual values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
WHATSAPP_NUMBER=your-whatsapp-number
SEED_SECRET=your-seed-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Getting API Keys

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<dbname>`

### Cloudinary
1. Go to https://cloudinary.com/
2. Sign up for free account
3. Get your Cloud Name, API Key, and API Secret from dashboard

### Razorpay
1. Go to https://razorpay.com/
2. Sign up and verify your account
3. Get Test Keys from Dashboard → Settings → API Keys
4. For production, get Live Keys after KYC verification

## Environment Files

- `.env` - Your actual environment variables (NEVER commit)
- `.env.example` - Template file (safe to commit)
- `.env.local` - Local development overrides (NEVER commit)
- `.env.production` - Production values (NEVER commit)

## Verification

After setup, verify your configuration:

```bash
# Client
cd client
npm run dev
# Should start on http://localhost:5173

# Server
cd server
npm run dev
# Should start on http://localhost:5000
```

## Troubleshooting

### "Cannot connect to database"
- Check your `MONGO_URI` is correct
- Verify IP whitelist in MongoDB Atlas (use 0.0.0.0/0 for development)
- Check username and password are correct

### "Razorpay authentication failed"
- Verify your Razorpay keys are correct
- Make sure you're using Test keys for development
- Check if keys have proper permissions

### "CORS error"
- Verify `CLIENT_URL` in server `.env` matches your frontend URL
- Check CORS configuration in `server/index.js`

## Production Deployment

For production, create separate `.env` files with production values:

**Client:**
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_URL=https://your-backend-url.com
VITE_CLIENT_URL=https://your-frontend-url.com
```

**Server:**
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
RAZORPAY_KEY_ID=rzp_live_xxxxx (Use LIVE keys)
RAZORPAY_KEY_SECRET=your-live-secret
```

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use different keys for development and production
3. ✅ Rotate secrets regularly
4. ✅ Use environment variables on hosting platforms
5. ✅ Keep `.env.example` updated but without real values
6. ✅ Add `.env*` to `.gitignore`
7. ✅ Use strong, random secrets for JWT_SECRET
8. ✅ Never share your `.env` file with anyone

## Need Help?

If you need the actual environment values:
1. Contact the project administrator
2. Never share credentials via email or chat
3. Use secure methods like password managers or encrypted channels
