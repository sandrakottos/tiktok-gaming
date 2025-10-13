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

## Need Help?

Check the main README.md for detailed documentation!

