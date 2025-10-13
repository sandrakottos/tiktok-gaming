# TikTok-Style Gaming Website 🎮

A mobile-optimized gaming platform with vertical scrolling, similar to TikTok's interface. Swipe up or down to switch between different games hosted on Vercel.

## Features

✨ **TikTok-Style Interface**: Vertical scrolling with snap-scroll behavior  
📱 **Mobile Optimized**: Touch gestures, responsive design, and mobile-first approach  
🎮 **One Game at a Time**: Only the current game is active, just like TikTok videos  
⚡ **Smart Preloading**: Automatically preloads next/previous games for instant scrolling  
🚀 **Ultra Lightweight**: Unloads games that are far away to save memory  
🔢 **Game Counter**: See which game you're on and total games available  
💨 **Instant Performance**: Optimized specifically for mobile devices  
🎯 **Keyboard Support**: Arrow keys work on desktop for testing

## Setup Instructions

### 1. Add Your Game URLs

Open `script.js` and update the `GAMES` array with your Vercel-hosted game URLs:

```javascript
const GAMES = [
    {
        title: "Your Game Name",
        url: "https://your-game.vercel.app",
        description: "Game description here!"
    },
    // Add more games...
];
```

### 2. Local Testing

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and connect to Vercel for automatic deployments.

## How It Works

### Performance Optimization (TikTok-Style)

The website uses intelligent loading to ensure **only one game is active at a time**:

1. **Current Game**: Fully loaded and playable
2. **Next/Previous Games**: Preloaded for instant transition when you swipe
3. **Distant Games**: Automatically unloaded to free up memory
4. **Result**: Buttery smooth performance even on low-end phones

### Technical Details

- **Vertical Scrolling**: Uses CSS `scroll-snap` for smooth, full-screen transitions
- **Dynamic Loading**: Iframes are created/destroyed based on scroll position
- **Memory Efficient**: Only keeps 2-3 games in memory at most
- **Touch Optimized**: Native touch gestures work perfectly on mobile
- **Instant Transitions**: Preloading ensures zero lag when switching games

## Customization

### Styling

Edit `styles.css` to customize:
- Colors and themes
- Header design
- Game info overlay
- Animations

### Behavior

Edit `script.js` to modify:
- Scroll behavior
- Game loading strategy
- Info display duration
- Keyboard controls

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS and macOS)
- ✅ Firefox
- ✅ Mobile browsers

## Tips

- Make sure your games are mobile-responsive
- Games should be hosted on HTTPS for iframe compatibility
- Test on actual mobile devices for best results
- Consider adding `allow` attributes to iframes for game features (audio, fullscreen, etc.)

## Troubleshooting

**Game not loading?**
- Check if the URL is correct
- Ensure the game allows iframe embedding (no X-Frame-Options blocking)
- Check browser console for errors

**Scrolling feels sluggish?**
- Make sure you're testing on mobile or using mobile emulation
- Try adjusting the CSS scroll-behavior property

**Games not responsive?**
- Ensure your games have proper viewport meta tags
- Check if games are mobile-optimized

## License

Free to use and modify!

