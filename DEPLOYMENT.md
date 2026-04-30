# Annakshetram Deployment Guide

## Production URLs
- **Frontend**: https://apiszen.com/Annakshetram-v1/
- **Backend**: https://annakshetram.onrender.com/api

## Environment Setup

### Client (Frontend)
Production environment variables are in `client/.env.production`:
```env
VITE_API_URL=https://annakshetram.onrender.com/api
VITE_BASE_URL=https://annakshetram.onrender.com
VITE_CLIENT_URL=https://apiszen.com/Annakshetram-v1
```

Local development variables are in `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
VITE_CLIENT_URL=http://localhost:5173
```

### Server (Backend)
Update `server/.env` for production:
```env
NODE_ENV=production
CLIENT_URL=https://apiszen.com/Annakshetram-v1
RAZORPAY_KEY_ID=rzp_live_SjGpaUIin4oM7t
RAZORPAY_KEY_SECRET=ZtZxScb1CYHwSXK3wzDEB2K5
```

## Deployment Steps

### 1. Frontend Deployment (apiszen.com)

#### Build the frontend:
```bash
cd client
npm install
npm run build
```

#### Upload to hosting:
- Upload the contents of `client/dist/` folder to your hosting
- Make sure `.htaccess` file is included for proper routing
- Set base path if deploying to subdirectory: `/Annakshetram-v1/`

#### Vite Config (if needed):
```javascript
// vite.config.js
export default defineConfig({
  base: '/Annakshetram-v1/',
  // ... other config
})
```

### 2. Backend Deployment (Render.com)

#### On Render Dashboard:
1. Create new Web Service
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && node index.js`
5. Add environment variables from `server/.env`

#### Environment Variables to set on Render:
```
PORT=5000
MONGO_URI=mongodb+srv://bharat0210:Bharat123@hello.kmsnd1s.mongodb.net/annakshetram
JWT_SECRET=ljXLibfh6jK2DVJEjzL9w1HRSwAsu97raZrAUi2OGXl
JWT_EXPIRE=7d
NODE_ENV=production
WHATSAPP_NUMBER=919035735818
CLIENT_URL=https://apiszen.com/Annakshetram-v1
RAZORPAY_KEY_ID=rzp_live_SjGpaUIin4oM7t
RAZORPAY_KEY_SECRET=ZtZxScb1CYHwSXK3wzDEB2K5
CLOUDINARY_CLOUD_NAME=duto1rizq
CLOUDINARY_API_KEY=199273797932843
CLOUDINARY_API_SECRET=ocxwuO4kxjdGqZ22sf87yZmrP04
```

### 3. CORS Configuration
Backend is configured to allow:
- `https://apiszen.com`
- `https://www.apiszen.com`
- `https://annakshetram.onrender.com`
- Local development URLs

### 4. Payment Gateway
- Using **Razorpay Live Keys** for production
- Test keys are commented out in production `.env`

### 5. Database
- MongoDB Atlas cluster: `hello.kmsnd1s.mongodb.net`
- Database: `annakshetram`
- Make sure IP whitelist includes Render's IPs or use `0.0.0.0/0`

## Post-Deployment Checklist

- [ ] Frontend loads correctly at https://apiszen.com/Annakshetram-v1/
- [ ] Backend API responds at https://annakshetram.onrender.com/api
- [ ] CORS is working (no console errors)
- [ ] User registration/login works
- [ ] Products load correctly
- [ ] Cart functionality works
- [ ] Razorpay payment integration works with live keys
- [ ] Order creation and verification works
- [ ] Admin panel accessible
- [ ] Image uploads work (Cloudinary)
- [ ] Payment logs are being created

## Switching Between Environments

### For Local Development:
```bash
# Client
cd client
cp .env.local .env
npm run dev

# Server
cd server
# Update .env to use test keys and localhost
npm run dev
```

### For Production:
```bash
# Client
cd client
cp .env.production .env
npm run build

# Server - Deploy to Render with production .env
```

## Troubleshooting

### CORS Issues:
- Check if frontend URL is in allowed origins list in `server/index.js`
- Verify `CLIENT_URL` in server `.env` matches frontend URL

### Payment Issues:
- Verify Razorpay live keys are correct
- Check webhook URL if using webhooks
- Ensure amount is in paise (multiply by 100)

### Image Upload Issues:
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper MIME types

### Database Connection:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has proper permissions

## Monitoring

### Payment Logs:
- Database: Check `paymentlogs` collection in MongoDB
- Files: Check `server/logs/payment-YYYY-MM-DD.log`
- Admin Panel: Access payment logs via admin dashboard

### Server Logs:
- Render Dashboard → Logs tab
- Check for errors and warnings

## Support
For issues, check:
1. Server logs on Render
2. Browser console for frontend errors
3. Payment logs in admin panel
4. MongoDB Atlas logs
