# Deployment Guide - Lions Den Glass

## One-Click Deployment to Render.com

### Steps:

1. **Create a Render.com Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect Your Repository**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Authorize Render to access your repo

3. **Configure Deployment**
   - **Name**: `lionsdenglass` (or your preferred name)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn -c backend/gunicorn_config.py backend/wsgi:app`
   - **Instance Type**: Free (or upgrade for more power)

4. **Your Live URL**
   After deployment, you'll get a URL like:
   - `https://lionsdenglass.onrender.com`
   - Or customize it to something cooler!

### Environment Variables (Set in Render Dashboard)
```
SECRET_KEY=your-production-secret-key
DEBUG=False
```

### Custom Domain (Optional)
- Add your own domain in Render settings
- Automatic HTTPS with Let's Encrypt

---

## Alternative: Deploy to Railway.app

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway automatically detects `Procfile`
4. Get your URL instantly

---

## Alternative: Deploy to Heroku (Limited Free Tier)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create lionsdenglass-unique-name

# Deploy
git push heroku main

# Open
heroku open
```

---

## Database Persistence

### Render.com
The SQLite databases (users.db, products.db) will be created fresh on each deployment.
For persistent data, upgrade to a PostgreSQL database:
1. In Render dashboard, create PostgreSQL instance
2. Update app.py to use PostgreSQL instead of SQLite

### Railway.app
Similar database options available

---

## Your Unique Cool URLs

Choose from these Render subdomain options:
- `https://glass-lions-den.onrender.com`
- `https://vape-glass-shop.onrender.com`
- `https://lions-den-glass.onrender.com`
- `https://glass-lounge.onrender.com`
- Or set your own custom domain!

---

## After Deployment

Your live website will include:
- ✅ Full ecommerce frontend
- ✅ Product detail modals
- ✅ Shopping cart
- ✅ User authentication
- ✅ HTTPS encryption
- ✅ Global CDN
- ✅ Automatic backups

---

## Monitoring

Check deployment status and logs:
- Render: Dashboard → Your App → Logs
- Railway: Dashboard → Deployments → View Logs
- Heroku: `heroku logs --tail`

---

## Troubleshooting

### Database Error
- First deployment creates fresh databases
- This is normal!

### Port Issues
- Render/Railway/Heroku automatically set PORT env variable
- Our app handles this automatically

### Build Fails
- Check `requirements.txt` has all dependencies
- Verify `Procfile` and `runtime.txt` are in root directory
