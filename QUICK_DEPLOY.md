# Lions Den Glass - Unique URL Setup Guide

## 🚀 Your Website URL Options

### Option A: Render.com (Recommended - Easiest)
**URL Examples:**
- `https://lionsdenglass.onrender.com`
- `https://glass-lounge-vape.onrender.com`
- `https://lions-den-premium.onrender.com`

### Option B: Railway.app
**URL Examples:**
- `https://lionsdenglass.railway.app`
- `https://glass-shop-lions-den.railway.app`

### Option C: Vercel (Frontend) + Render (API)
- Frontend: `https://lionsdenglass.vercel.app`
- API: Served from same domain

---

## 🎯 Quick Deploy to Render.com

### Step-by-Step:

1. Go to **https://render.com**
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository
4. Fill in the form:
   - **Name:** `lionsdenglass` (this becomes your URL)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn -c backend/gunicorn_config.py backend/wsgi:app`
   - **Free Plan:** ✅ Selected

5. Click **"Create Web Service"**
6. Wait 2-5 minutes for deployment
7. Your URL appears automatically! 🎉

**Your deployed site will be at:**
```
https://lionsdenglass.onrender.com
```

---

## 🌟 Make Your URL Cooler

### Custom Render Subdomain
During setup, you can name it anything:
- `https://glass-lounge.onrender.com`
- `https://lions-premium-glass.onrender.com`
- `https://vape-glass-emporium.onrender.com`
- `https://the-glass-den.onrender.com`

### Add Your Own Custom Domain
1. In Render Dashboard: **Settings → Custom Domain**
2. Add domain (e.g., `www.lionsdenglass.com`)
3. Update DNS settings with your registrar
4. Get free HTTPS instantly

---

## 📊 What You Get

✅ **Free Tier Includes:**
- 0.5 GB RAM
- Shared CPU
- 100 GB bandwidth/month
- Automatic HTTPS/SSL
- GitHub integration
- Auto-deploys on git push
- Email support

✅ **Your Website Features:**
- Full ecommerce functionality
- Product catalog with modal details
- Shopping cart
- User authentication
- Responsive design
- Professional appearance

---

## 🔄 Auto-Deploy from GitHub

After initial setup:
1. Push code to GitHub: `git push`
2. Render automatically rebuilds and deploys
3. Your site updates instantly! 🚀

---

## 🛠️ Environment Setup for Deployment

All configured! Just push to deploy:
- ✅ `Procfile` - Web service command
- ✅ `runtime.txt` - Python 3.13.9
- ✅ `requirements.txt` - Dependencies
- ✅ `WSGI` - Ready for production
- ✅ `Gunicorn` - Production server

---

## 📝 Recommended URL Names

**Professional:**
- `lionsdenglass.onrender.com`
- `lions-glass-shop.onrender.com`

**Cool/Trendy:**
- `glass-lounge-vape.onrender.com`
- `lions-premium-glass.onrender.com`
- `the-glass-den.onrender.com`
- `vape-glass-emporium.onrender.com`

**Short & Catchy:**
- `glass-lions.onrender.com`
- `ld-glass.onrender.com`
- `den-glass.onrender.com`

---

## 🎬 Next Steps

1. **Sign up:** https://render.com (free account)
2. **Connect GitHub:** Authorize Render
3. **Create Web Service:** Select your repository
4. **Deploy:** Click "Create"
5. **Share:** Get your live URL in 2-5 minutes

That's it! Your Lions Den Glass website will be live on the internet! 🌍

