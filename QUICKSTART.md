# Quick Start Guide 🚀

Get your TikTok-style gaming website running in 3 minutes!

## Step 1: Add Your Game URLs

Open `script.js` and find the `GAMES` array (line 2):

```javascript
const GAMES = [
    {
        title: "Flappy Bird",
        url: "https://your-game-url.vercel.app",  // ← Change this!
        description: "Game description here"
    },
    // Add more games...
];
```

Replace `your-game-url.vercel.app` with your actual Vercel game URLs.

## Step 1.5: Configure Analytics (Optional)

The platform includes built-in analytics tracking. To customize:

### Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new property for your gaming platform
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
4. Update `index.html` line 27: `gtag('config', 'G-EPGJR8Y5XE', {` → `gtag('config', 'YOUR-ID', {`

### Microsoft Clarity
1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Create a new project for your gaming platform
3. Copy your Project ID from the setup code
4. Update `index.html` line 44: `"tnyu76yu2z");` → `"YOUR-ID");`

**Note:** Analytics IDs are already configured and working. You can keep them or replace with your own.

## Step 2: Test Locally

### Option A: Simple (just open the file)
Double-click `index.html` to open in your browser

### Option B: Local Server (recommended)
```bash
cd tiktok-gaming
python -m http.server 8000
# OR
npx http-server
```

Then open: http://localhost:8000

## Step 3: Test on Mobile

1. Connect phone to same WiFi as your computer
2. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`
3. On phone, visit: `http://YOUR-IP:8000`

## Step 4: Deploy to Vercel

```bash
npm install -g vercel  # One-time install
vercel                 # Deploy!
```

That's it! 🎉

## Performance Features

✅ **Only 1 game loads at a time** - just like TikTok  
✅ **Next/previous games preloaded** - instant transitions  
✅ **Distant games unloaded** - saves memory on mobile  

## Testing Checklist

- [ ] All game URLs work in a regular browser
- [ ] Games are mobile-responsive
- [ ] Games allow iframe embedding (no blocking)
- [ ] Tested on actual mobile device
- [ ] Smooth scrolling between games
- [ ] Game counter shows correct numbers
- [ ] Analytics events firing (check browser console for `[Analytics]` logs)
- [ ] Network requests to `google-analytics.com` and `clarity.ms` visible
- [ ] GA4 dashboard shows real-time data (wait 5-30 minutes)
- [ ] Clarity dashboard shows session recording (wait 2-5 minutes)

## Troubleshooting

**Game shows "Unable to load"?**
- Check if the URL is correct
- Try opening the game URL directly in a browser
- Make sure the game allows iframe embedding

**Scrolling not working?**
- Try on mobile or use browser mobile emulation (F12 → mobile view)

**Games not responsive?**
- Each game needs its own mobile optimization
- Check if game has proper viewport meta tags

**Analytics not working?**
- Wait 5-30 minutes for GA4 data to appear
- Check browser console for `[Analytics]` logs
- Verify GA4 and Clarity IDs are correct in `index.html`
- Try in incognito mode (no ad blockers)
- Check Network tab for requests to analytics services

## Need Help?

Check the main README.md for detailed documentation!

