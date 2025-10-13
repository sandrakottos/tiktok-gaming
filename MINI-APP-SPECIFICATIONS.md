# 🎮 Mini App Specifications for TikTok Gaming Platform

## Document Overview

This document provides comprehensive specifications for creating high-quality mini apps (games) that integrate seamlessly with the TikTok Gaming platform. Follow these specifications to ensure optimal performance, user experience, and compatibility.

---

## 📋 Table of Contents

1. [Technical Requirements](#technical-requirements)
2. [Acceptable Technology Stacks](#acceptable-technology-stacks)
3. [Size & Performance Requirements](#size--performance-requirements)
4. [Touch & Interaction Requirements](#touch--interaction-requirements)
5. [Sound & Audio Requirements](#sound--audio-requirements)
6. [Visual & UI Specifications](#visual--ui-specifications)
7. [Mobile Optimization Requirements](#mobile-optimization-requirements)
8. [Iframe Integration Requirements](#iframe-integration-requirements)
9. [Testing Requirements](#testing-requirements)
10. [Deployment Requirements](#deployment-requirements)
11. [Best Practices & Guidelines](#best-practices--guidelines)
12. [Quality Checklist](#quality-checklist)

---

## Technical Requirements

### Mandatory Requirements

#### 1. HTTPS Hosting
- ✅ **MUST** be served over HTTPS
- ❌ HTTP will not work (browsers block mixed content)
- Use Vercel, Netlify, or similar platforms (free HTTPS)

#### 2. Iframe Embedding Allowed
- ✅ **MUST NOT** have `X-Frame-Options: DENY`
- ✅ **MUST** allow embedding from any origin (or specific origin)

**Correct Configuration (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ]
}
```

**Or allow specific origin:**
```json
{
  "key": "X-Frame-Options",
  "value": "ALLOW-FROM https://your-gaming-platform.vercel.app"
}
```

#### 3. Mobile Responsive Design
- ✅ **MUST** work on screens from 320px to 768px wide
- ✅ **MUST** adapt to portrait orientation (primary)
- ✅ **SHOULD** support landscape orientation (optional)
- ✅ **MUST** use viewport meta tag

**Required Viewport Tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

#### 4. No External Navigation
- ❌ **MUST NOT** redirect away from the game page
- ❌ **MUST NOT** open new windows/tabs automatically
- ✅ Links (if any) should open with `target="_blank"` and user confirmation

#### 5. Fast Load Time
- ✅ **MUST** load within 5 seconds on 4G connection
- ✅ Initial render should appear within 2 seconds
- ✅ Show loading indicator if load takes > 1 second

---

## Acceptable Technology Stacks

### ✅ Recommended Stacks (Best Performance)

#### 1. Pure Web Technologies (Preferred)
```
HTML5 + CSS3 + Vanilla JavaScript
```

**Pros:**
- Fastest load time (no framework overhead)
- Smallest bundle size
- Maximum compatibility
- No build process needed

**Examples:**
- Canvas-based games (2D graphics)
- DOM-based games (HTML elements)
- WebGL games (3D graphics)

#### 2. Lightweight Frameworks
```
- Phaser.js (game framework, ~1.2 MB)
- PixiJS (2D rendering, ~450 KB)
- Three.js (3D graphics, ~600 KB)
- Kaboom.js (game framework, ~200 KB)
```

**Pros:**
- Powerful game APIs
- Good performance
- Active communities
- Easy to learn

**Cons:**
- Larger bundle size than vanilla
- Requires build process

#### 3. Web Frameworks (If Necessary)
```
React (with careful optimization)
Vue.js (lightweight option)
Svelte (compiles to vanilla JS)
```

**Use only if:**
- Complex state management needed
- UI-heavy game
- Team already familiar with framework

**Requirements:**
- Code splitting implemented
- Lazy loading where possible
- Production build optimized
- Tree shaking enabled

### ❌ Not Recommended

- Heavy frameworks (Angular, Ember)
- Non-web technologies (Unity WebGL > 50MB)
- Flash/Shockwave (deprecated)
- Java applets (obsolete)

### Technology Stack Decision Matrix

| Stack Type | Load Time | Bundle Size | Performance | Mobile | Recommendation |
|------------|-----------|-------------|-------------|--------|----------------|
| Vanilla JS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Best Choice** |
| Phaser.js | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excellent |
| PixiJS | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excellent |
| Kaboom.js | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excellent |
| React | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Use if needed |
| Vue | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Good option |
| Unity WebGL | ⭐ | ⭐ | ⭐⭐ | ⭐ | Avoid |

---

## Size & Performance Requirements

### File Size Limits

#### Total Bundle Size
```
Strict: < 5 MB (all assets included)
Recommended: < 2 MB
Ideal: < 1 MB
```

**Why:**
- Mobile users on limited data plans
- Faster load times on slow connections
- Better user experience
- Less platform memory usage

#### Individual Asset Limits

| Asset Type | Maximum Size | Recommended | Notes |
|------------|--------------|-------------|-------|
| JavaScript | 500 KB | 200 KB | Minified + gzipped |
| CSS | 100 KB | 50 KB | Minified |
| HTML | 50 KB | 20 KB | - |
| Images (each) | 200 KB | 100 KB | Use WebP or AVIF |
| Audio (each) | 500 KB | 200 KB | Use MP3 or AAC |
| Fonts | 100 KB | 50 KB | Use system fonts if possible |
| Total Assets | 5 MB | 2 MB | Including all resources |

### Performance Benchmarks

#### Load Performance
```
Initial Load (4G):        < 3 seconds ✅
Initial Load (3G):        < 5 seconds ✅
Time to Interactive:      < 4 seconds ✅
First Contentful Paint:   < 2 seconds ✅
```

#### Runtime Performance
```
Frame Rate:               60 FPS (target)
Frame Rate:               30 FPS (minimum acceptable)
Memory Usage:             < 100 MB (recommended)
Memory Usage:             < 150 MB (maximum)
CPU Usage:                < 40% (on mid-range phones)
```

#### Battery Impact
```
Should NOT drain battery faster than:
- Video watching (~5% per 30 min)
- Audio streaming (~3% per 30 min)

Avoid:
- Continuous animations when idle
- Background processing
- Excessive network requests
```

### Optimization Techniques

#### 1. Image Optimization
```javascript
// Use modern formats
.webp (preferred)    // 30% smaller than JPEG
.avif (best)         // 50% smaller than JPEG

// Compress images
- TinyPNG (online tool)
- ImageOptim (macOS)
- Squoosh (web tool)

// Use sprites for multiple small images
// Lazy load images not immediately visible
```

#### 2. Code Optimization
```javascript
// Minify JavaScript
terser input.js -o output.min.js

// Remove console.logs in production
// Use code splitting
// Tree shake unused code
// Enable gzip compression
```

#### 3. Asset Loading Strategy
```javascript
// Preload critical assets
<link rel="preload" href="game.js" as="script">
<link rel="preload" href="player.png" as="image">

// Lazy load non-critical assets
const image = new Image();
image.src = 'background.png';  // Load when needed
```

---

## Touch & Interaction Requirements

### Touch Target Sizes

#### Minimum Touch Target Size
```
Minimum: 44x44 pixels (iOS Human Interface Guidelines)
Recommended: 48x48 pixels (Material Design)
Ideal: 56x56 pixels (for primary actions)
```

**Examples:**
```css
/* Buttons */
.game-button {
    min-width: 48px;
    min-height: 48px;
    padding: 12px 24px;
}

/* Touch areas */
.touch-area {
    width: 100px;
    height: 100px;
    /* Visual size can be smaller, but touch area should be large */
}
```

### Touch Gestures

#### Required Gestures
1. **Tap** - Primary interaction
   ```javascript
   element.addEventListener('touchstart', handleTap);
   // Or click event (works for both touch and mouse)
   element.addEventListener('click', handleTap);
   ```

2. **Hold** - Secondary actions (if needed)
   ```javascript
   let holdTimer;
   element.addEventListener('touchstart', () => {
       holdTimer = setTimeout(() => {
           handleHold();
       }, 500);
   });
   element.addEventListener('touchend', () => {
       clearTimeout(holdTimer);
   });
   ```

#### Optional Gestures
3. **Swipe** - Directional actions
   ```javascript
   let startX, startY;
   element.addEventListener('touchstart', (e) => {
       startX = e.touches[0].clientX;
       startY = e.touches[0].clientY;
   });
   element.addEventListener('touchend', (e) => {
       const endX = e.changedTouches[0].clientX;
       const endY = e.changedTouches[0].clientY;
       const deltaX = endX - startX;
       const deltaY = endY - startY;
       
       if (Math.abs(deltaX) > 50) {
           // Horizontal swipe
           if (deltaX > 0) handleSwipeRight();
           else handleSwipeLeft();
       }
   });
   ```

4. **Pinch** - Zoom (rarely needed for games)
5. **Rotate** - Rotation actions (rarely needed)

### Touch Optimization

#### 1. Prevent Default Browser Behaviors
```javascript
// Prevent pull-to-refresh
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Prevent double-tap zoom
document.addEventListener('dblclick', (e) => {
    e.preventDefault();
});

// Prevent text selection
body {
    -webkit-user-select: none;
    user-select: none;
}
```

#### 2. Remove Tap Highlights
```css
* {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
}
```

#### 3. Fast Click Response
```javascript
// Use touchstart for instant response (careful with scrolling)
// Or use pointer events (modern approach)
element.addEventListener('pointerdown', handleInteraction);
```

#### 4. Visual Feedback
```css
/* Show visual feedback on touch */
.button:active {
    transform: scale(0.95);
    opacity: 0.8;
}

/* Or use active state */
.button.pressed {
    background: #007bff;
}
```

### Interaction Guidelines

#### Do's ✅
- Use large touch targets (48x48px minimum)
- Provide immediate visual feedback
- Support both portrait and landscape
- Handle touch cancellation (user moves finger off target)
- Prevent accidental touches (confirmation for destructive actions)

#### Don'ts ❌
- Don't rely on hover states (mobile has no hover)
- Don't use double-click as primary action
- Don't require precise touches (< 40px targets)
- Don't use tiny buttons or UI elements
- Don't forget to handle multi-touch (if game needs it)

---

## Sound & Audio Requirements

### Audio File Specifications

#### File Formats
```
Recommended: MP3 (best compatibility)
Alternative: AAC, OGG
Avoid: WAV (too large), FLAC (too large)
```

#### File Size Limits
```
Sound Effects:    < 50 KB each
Background Music: < 500 KB (< 200 KB preferred)
Total Audio:      < 1 MB for all audio files
```

#### Audio Quality
```
Sample Rate: 44.1 kHz (CD quality) or 22.05 kHz (acceptable)
Bit Rate: 128 kbps (good) or 96 kbps (acceptable for mobile)
Channels: Stereo or Mono (mono is smaller)
```

### Audio Implementation Requirements

#### 1. User-Initiated Audio (Required)
```javascript
// ✅ Correct: Audio plays after user interaction
let audioContext;
let canPlayAudio = false;

document.addEventListener('click', () => {
    if (!canPlayAudio) {
        audioContext = new AudioContext();
        canPlayAudio = true;
    }
}, { once: true });

function playSound() {
    if (canPlayAudio) {
        sound.play();
    }
}
```

**Why:** Browsers block autoplay audio (user must interact first)

#### 2. Mute Button (Required)
```html
<button id="muteBtn" aria-label="Mute sound">
    🔊
</button>
```

```javascript
let isMuted = false;

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    
    // Mute all audio
    if (isMuted) {
        Howler.volume(0);  // If using Howler.js
        // or
        audio.forEach(a => a.volume = 0);
    }
});
```

#### 3. Volume Control (Recommended)
```html
<input type="range" id="volumeSlider" min="0" max="100" value="70">
```

```javascript
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    Howler.volume(volume);
});
```

#### 4. Audio Preloading
```javascript
// Preload audio files
const sounds = {
    jump: new Audio('jump.mp3'),
    coin: new Audio('coin.mp3'),
    music: new Audio('music.mp3')
};

// Set music to loop
sounds.music.loop = true;

// Preload
Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
});
```

#### 5. Handle Visibility Change
```javascript
// Pause audio when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        sounds.music.pause();
    } else {
        if (!isMuted) sounds.music.play();
    }
});
```

### Audio Best Practices

#### Do's ✅
- Provide mute button in prominent location
- Save mute preference to localStorage
- Compress audio files (use Audacity or online tools)
- Use audio sprites for multiple short sounds
- Fade in/out music (don't start/stop abruptly)
- Keep sound effects short (< 1 second)
- Test on iOS Safari (has strict autoplay policies)

#### Don'ts ❌
- Don't autoplay audio without user interaction
- Don't use large audio files (> 500 KB)
- Don't play multiple background music tracks simultaneously
- Don't forget to stop audio when game pauses
- Don't ignore mute preference

### Recommended Audio Library

**Howler.js** (Recommended)
```javascript
// Install
npm install howler

// Usage
import { Howl } from 'howler';

const sound = new Howl({
    src: ['sound.mp3'],
    volume: 0.5,
    onload: () => console.log('Loaded'),
    onplay: () => console.log('Playing')
});

sound.play();
```

**Benefits:**
- Handles browser quirks
- Audio sprite support
- Volume control
- Fallback support
- Small size (~9 KB)

---

## Visual & UI Specifications

### Viewport Specifications

#### Screen Sizes to Support

| Device | Width | Height | Orientation | Priority |
|--------|-------|--------|-------------|----------|
| iPhone SE | 375px | 667px | Portrait | High |
| iPhone 12/13 | 390px | 844px | Portrait | High |
| iPhone 14 Pro Max | 430px | 932px | Portrait | Medium |
| Small Android | 360px | 640px | Portrait | High |
| Medium Android | 412px | 915px | Portrait | High |
| Tablet | 768px | 1024px | Both | Low |

#### Design Recommendations

**Portrait Mode (Primary)**
```
Target Canvas Size: 375x667px (iPhone SE)
Safe Area: 350x600px (avoid edges)
UI Elements: Bottom 100px or top 60px
Game Area: Center 350x507px
```

**Landscape Mode (Optional)**
```
Target Canvas Size: 667x375px
Safe Area: 600x350px
UI Elements: Left/right 80px
Game Area: Center 507x350px
```

### UI Element Specifications

#### 1. Buttons

**Primary Button**
```css
.primary-button {
    min-width: 120px;
    min-height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    padding: 12px 24px;
    /* Touch target at least 48x48px */
}
```

**Secondary Button**
```css
.secondary-button {
    min-width: 100px;
    min-height: 44px;
    font-size: 14px;
    border-radius: 10px;
    padding: 10px 20px;
}
```

**Icon Button**
```css
.icon-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    /* Icon inside should be 24x24px */
}
```

#### 2. Typography

**Font Sizes**
```css
:root {
    --font-size-xs: 12px;    /* Small labels */
    --font-size-sm: 14px;    /* Body text */
    --font-size-md: 16px;    /* Primary text */
    --font-size-lg: 20px;    /* Headings */
    --font-size-xl: 24px;    /* Large headings */
    --font-size-2xl: 32px;   /* Hero text */
}
```

**Font Recommendations**
```css
/* Use system fonts for fastest load */
body {
    font-family: -apple-system, BlinkMacSystemFont, 
                 'Segoe UI', 'Roboto', 'Oxygen',
                 sans-serif;
}

/* Or use Google Fonts (add ~20KB) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
```

#### 3. Colors & Contrast

**Minimum Contrast Ratios (WCAG AA)**
```
Normal Text (16px+):  4.5:1
Large Text (24px+):   3:1
UI Components:        3:1
```

**Example Color Palette**
```css
:root {
    /* Dark mode (recommended for gaming) */
    --bg-primary: #0a0a0b;
    --bg-secondary: #1a1a1d;
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --accent: #3b82f6;      /* Blue */
    --success: #10b981;     /* Green */
    --danger: #ef4444;      /* Red */
    --warning: #f59e0b;     /* Orange */
}
```

#### 4. Safe Areas (Notched Devices)

```css
/* Account for notches and home indicators */
body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}

/* Or use max() for minimum padding */
.container {
    padding: max(20px, env(safe-area-inset-top)) 
             max(16px, env(safe-area-inset-right))
             max(20px, env(safe-area-inset-bottom))
             max(16px, env(safe-area-inset-left));
}
```

#### 5. Loading States

**Loading Spinner**
```html
<div class="loading">
    <div class="spinner"></div>
    <p>Loading game...</p>
</div>
```

```css
.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

**Progress Bar**
```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 75%"></div>
</div>
<p class="progress-text">Loading assets... 75%</p>
```

#### 6. Game States

**Required States:**
1. **Loading** - Initial load
2. **Menu** - Start screen
3. **Playing** - Active gameplay
4. **Paused** - Paused state
5. **Game Over** - End screen

**Example Menu Screen**
```html
<div class="menu-screen">
    <h1>Game Title</h1>
    <button class="play-button">Play</button>
    <button class="settings-button">⚙️</button>
    <button class="mute-button">🔊</button>
</div>
```

### Visual Best Practices

#### Do's ✅
- Use dark backgrounds (better for OLED screens)
- High contrast for text and UI elements
- Large, readable fonts (16px+ for body text)
- Colorblind-friendly color schemes
- Consistent visual language
- Smooth animations (60fps)

#### Don'ts ❌
- Don't use tiny text (< 12px)
- Don't use low contrast colors
- Don't rely solely on color to convey info
- Don't use flashing effects (seizure risk)
- Don't place important UI at screen edges
- Don't use custom fonts > 100KB

---

## Mobile Optimization Requirements

### Critical Optimizations

#### 1. Viewport Configuration (Required)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
```

#### 2. Dynamic Viewport Height (Required)
```css
/* Use dvh instead of vh for mobile browsers */
.game-container {
    height: 100dvh;  /* Accounts for browser UI */
    /* Fallback for older browsers */
    height: 100vh;
}
```

#### 3. Touch Action Optimization
```css
/* Allow only vertical scrolling (for platform scroll) */
body {
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
}

/* Disable scrolling in game area */
.game-canvas {
    touch-action: none;
}
```

#### 4. Prevent Zoom and Selection
```css
body {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
}

/* Prevent pinch zoom */
<meta name="viewport" content="maximum-scale=1.0">
```

#### 5. Hardware Acceleration
```css
/* Force GPU acceleration */
.game-canvas {
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}
```

#### 6. Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Performance Optimizations

#### 1. RequestAnimationFrame for Game Loop
```javascript
// ✅ Correct: Use RAF for 60fps
function gameLoop(timestamp) {
    update(timestamp);
    render();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// ❌ Wrong: Don't use setInterval
setInterval(gameLoop, 16); // Inconsistent timing
```

#### 2. Debounce Resize Events
```javascript
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        handleResize();
    }, 250);
});
```

#### 3. Object Pooling (For Games with Many Objects)
```javascript
class ObjectPool {
    constructor(createFn, size = 100) {
        this.pool = [];
        this.createFn = createFn;
        
        // Pre-create objects
        for (let i = 0; i < size; i++) {
            this.pool.push(createFn());
        }
    }
    
    get() {
        return this.pool.pop() || this.createFn();
    }
    
    return(obj) {
        this.pool.push(obj);
    }
}

// Usage
const bulletPool = new ObjectPool(() => new Bullet(), 50);
const bullet = bulletPool.get();
// ... use bullet ...
bulletPool.return(bullet);
```

#### 4. Lazy Loading Assets
```javascript
// Load assets on demand
async function loadLevel(levelNum) {
    const assets = await import(`./levels/${levelNum}.js`);
    // Use assets
}
```

#### 5. Canvas Optimization (For Canvas Games)
```javascript
// Use offscreen canvas for complex rendering
const offscreen = document.createElement('canvas');
const offscreenCtx = offscreen.getContext('2d');

// Render to offscreen canvas
offscreenCtx.drawImage(complexImage, 0, 0);

// Then copy to main canvas (faster)
ctx.drawImage(offscreen, 0, 0);
```

### Memory Management

#### 1. Clean Up Event Listeners
```javascript
class Game {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }
    
    start() {
        canvas.addEventListener('click', this.handleClick);
    }
    
    stop() {
        // Important: Remove listeners to prevent memory leaks
        canvas.removeEventListener('click', this.handleClick);
    }
}
```

#### 2. Dispose Assets When Not Needed
```javascript
// Remove images from memory
function disposeAssets() {
    images.forEach(img => {
        img.src = '';  // Clear source
        img = null;
    });
    images = [];
}
```

#### 3. Limit Array Sizes
```javascript
// Keep arrays bounded
const maxParticles = 100;
if (particles.length > maxParticles) {
    particles.shift();  // Remove oldest
}
```

### Battery Optimization

#### 1. Pause When Not Visible
```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        game.pause();
        audio.pause();
    } else {
        game.resume();
        audio.play();
    }
});
```

#### 2. Reduce Update Rate When Idle
```javascript
let lastActivity = Date.now();
let updateRate = 60;  // FPS

function checkActivity() {
    if (Date.now() - lastActivity > 5000) {
        updateRate = 30;  // Reduce to 30fps when idle
    } else {
        updateRate = 60;
    }
}
```

#### 3. Avoid Continuous Background Animations
```javascript
// ✅ Good: Only animate when needed
if (gameState === 'playing') {
    animateBackground();
}

// ❌ Bad: Always animating
setInterval(animateBackground, 16);
```

---

## Iframe Integration Requirements

### Required HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Game Title</title>
    
    <!-- Favicon -->
    <link rel="icon" href="favicon.ico">
    
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        /* Full viewport */
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
        }
        
        /* Game container */
        #game {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="game"></div>
    
    <script src="game.js"></script>
</body>
</html>
```

### PostMessage API Integration (Optional but Recommended)

**Allows platform to communicate with game:**

```javascript
// In your game code
window.addEventListener('message', (event) => {
    // Security: Verify origin
    // if (event.origin !== 'https://expected-origin.com') return;
    
    const { type, data } = event.data;
    
    switch(type) {
        case 'pause':
            game.pause();
            break;
        case 'resume':
            game.resume();
            break;
        case 'mute':
            audio.mute();
            break;
        case 'unmute':
            audio.unmute();
            break;
        case 'restart':
            game.restart();
            break;
    }
});

// Send messages to parent (optional)
function sendScore(score) {
    window.parent.postMessage({
        type: 'score',
        value: score
    }, '*');
}
```

### Save State Integration (Optional)

```javascript
// Use localStorage to save game state
function saveGameState() {
    const state = {
        level: currentLevel,
        score: score,
        timestamp: Date.now()
    };
    localStorage.setItem('gameState', JSON.stringify(state));
}

// Load state on startup
function loadGameState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const state = JSON.parse(saved);
        // Check if state is recent (< 24 hours)
        if (Date.now() - state.timestamp < 86400000) {
            return state;
        }
    }
    return null;
}

// Auto-save every 10 seconds
setInterval(saveGameState, 10000);

// Save before unload
window.addEventListener('beforeunload', saveGameState);
```

### Fullscreen API Support (Optional)

```javascript
// Add fullscreen button
<button id="fullscreenBtn">⛶ Fullscreen</button>

fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        console.log('Entered fullscreen');
    } else {
        console.log('Exited fullscreen');
    }
});
```

### Iframe Sandbox Awareness

**The platform may embed your game with these restrictions:**
```html
<iframe 
    src="your-game.html"
    sandbox="allow-scripts allow-same-origin allow-forms"
    allow="accelerometer; autoplay; encrypted-media; gyroscope"
></iframe>
```

**What this means:**
- ✅ JavaScript will run
- ✅ Same-origin requests work
- ✅ Forms work (if needed)
- ✅ Accelerometer/gyroscope access (if requested)
- ❌ Can't open popups
- ❌ Can't navigate top frame
- ❌ Can't access parent page (without postMessage)

---

## Testing Requirements

### Mandatory Testing

#### 1. Mobile Device Testing
```
Required Devices:
- iOS iPhone (iOS 15+)
- Android Phone (Android 10+)

Test on real devices (not just emulators)
```

#### 2. Browser Testing
```
Required Browsers:
- Safari iOS (primary)
- Chrome Android (primary)
- Chrome Desktop (for debugging)
- Safari Desktop (for debugging)
```

#### 3. Network Testing
```
Test on different speeds:
- 4G: Fast (good connection)
- 3G: Slow (160KB/s download)
- Slow 3G: Very slow (50KB/s download)

Use Chrome DevTools > Network > Throttling
```

#### 4. Performance Testing
```
Check with Chrome DevTools:
- Lighthouse Performance Score > 80
- Frame rate stays above 30fps
- Memory usage < 150MB
- No memory leaks (check over 5 minutes)
```

### Testing Checklist

#### Load Testing
- [ ] Game loads within 5 seconds on 4G
- [ ] Game loads within 10 seconds on 3G
- [ ] Loading indicator shows while loading
- [ ] No errors in browser console
- [ ] All assets load successfully

#### Touch Testing
- [ ] All buttons are tappable (44x44px minimum)
- [ ] Touch feedback is immediate (< 100ms)
- [ ] No accidental scrolling during gameplay
- [ ] Gestures work correctly
- [ ] Multi-touch works (if needed)

#### Audio Testing
- [ ] Audio doesn't autoplay (waits for user interaction)
- [ ] Mute button works
- [ ] Audio pauses when tab is hidden
- [ ] Audio resumes when tab is visible
- [ ] Audio volume is appropriate (not too loud)

#### Visual Testing
- [ ] Game fits in viewport (no scrolling)
- [ ] Text is readable (no text too small)
- [ ] Colors have sufficient contrast
- [ ] Animations are smooth (60fps)
- [ ] Safe areas respected (no UI under notch)

#### State Testing
- [ ] Game pauses when switching tabs
- [ ] Game resumes correctly
- [ ] Game state saves (if implemented)
- [ ] Game handles orientation change
- [ ] Game handles resize correctly

#### iframe Testing
- [ ] Game works when embedded in iframe
- [ ] No X-Frame-Options blocking
- [ ] No mixed content warnings
- [ ] postMessage works (if implemented)
- [ ] Game doesn't break out of iframe

#### Performance Testing
- [ ] 60fps during gameplay (30fps minimum)
- [ ] Memory usage under 150MB
- [ ] No memory leaks over 5 minutes
- [ ] Battery drain reasonable
- [ ] CPU usage under 50%

### Testing Tools

#### Chrome DevTools
```
Performance Tab: Check FPS, CPU usage
Memory Tab: Check for leaks
Network Tab: Check load times, file sizes
Lighthouse: Overall performance score
Device Emulation: Test different screen sizes
```

#### Mobile Testing
```
Safari Web Inspector (iOS)
Chrome Remote Debugging (Android)
```

#### Performance Testing Tools
```
WebPageTest.org - Real device testing
Google PageSpeed Insights - Performance analysis
GTmetrix - Load time analysis
```

---

## Deployment Requirements

### Hosting Requirements

#### 1. Static Hosting (Recommended)
```
Vercel (Recommended)
- Free tier available
- Automatic HTTPS
- Global CDN
- Fast deployment
- Custom domain support

Alternatives:
- Netlify
- GitHub Pages (with custom domain for HTTPS)
- Cloudflare Pages
- Firebase Hosting
```

#### 2. Deployment Configuration

**vercel.json (Required if using Vercel):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3. File Structure
```
your-game/
├── index.html          (entry point)
├── game.js             (game logic)
├── style.css           (styles)
├── assets/
│   ├── images/
│   │   ├── player.png
│   │   └── enemy.png
│   ├── audio/
│   │   ├── jump.mp3
│   │   └── music.mp3
│   └── fonts/          (if needed)
├── vercel.json         (deployment config)
└── README.md           (documentation)
```

### Pre-Deployment Checklist

#### Code Optimization
- [ ] JavaScript minified
- [ ] CSS minified
- [ ] HTML minified (optional)
- [ ] Images compressed
- [ ] Audio compressed
- [ ] Unused code removed
- [ ] Console.logs removed

#### Asset Optimization
- [ ] Images under 200KB each
- [ ] Audio under 500KB each
- [ ] Fonts under 100KB each
- [ ] Total bundle under 5MB
- [ ] Lazy loading implemented

#### Configuration
- [ ] vercel.json configured
- [ ] X-Frame-Options allows embedding
- [ ] Cache headers configured
- [ ] HTTPS enabled
- [ ] Custom domain (if needed)

#### Testing
- [ ] Tested on mobile devices
- [ ] Tested in iframe
- [ ] Tested on slow 3G
- [ ] Performance score > 80
- [ ] No console errors

### Post-Deployment Validation

```bash
# Check HTTPS
curl -I https://your-game.vercel.app

# Check headers
curl -I https://your-game.vercel.app | grep -i frame

# Check file sizes
curl -I https://your-game.vercel.app/game.js | grep -i content-length

# Test load time
curl -w "@curl-format.txt" -o /dev/null -s https://your-game.vercel.app
```

---

## Best Practices & Guidelines

### Code Quality

#### 1. Clean Code
```javascript
// ✅ Good: Clear variable names
const playerSpeed = 5;
const enemyHealth = 100;

// ❌ Bad: Unclear names
const ps = 5;
const eh = 100;
```

#### 2. Comments
```javascript
// ✅ Good: Explain why, not what
// Reduce speed when jumping to prevent wall clipping
if (isJumping) velocity.x *= 0.7;

// ❌ Bad: State the obvious
// Set x to 5
x = 5;
```

#### 3. Error Handling
```javascript
// ✅ Good: Handle errors gracefully
try {
    const data = await loadGameData();
    startGame(data);
} catch (error) {
    console.error('Failed to load game:', error);
    showErrorScreen('Game failed to load. Please refresh.');
}

// ❌ Bad: No error handling
const data = await loadGameData();
startGame(data);
```

### User Experience

#### 1. Loading Feedback
```javascript
// Show loading progress
function updateLoadingProgress(percent) {
    loadingBar.style.width = percent + '%';
    loadingText.textContent = `Loading... ${percent}%`;
}
```

#### 2. Error Messages
```javascript
// User-friendly error messages
const ERROR_MESSAGES = {
    LOAD_FAILED: 'Unable to load game. Please check your connection and try again.',
    AUDIO_FAILED: 'Audio couldn't load, but you can still play!',
    STORAGE_FULL: 'Can't save progress. Your device storage is full.'
};
```

#### 3. Onboarding
```javascript
// Show tutorial on first play
if (!localStorage.getItem('hasPlayedBefore')) {
    showTutorial();
    localStorage.setItem('hasPlayedBefore', 'true');
}
```

### Accessibility

#### 1. Keyboard Support (Desktop)
```javascript
// Support keyboard for desktop testing
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case ' ':
            jump();
            break;
    }
});
```

#### 2. ARIA Labels
```html
<button aria-label="Start game" class="play-button">
    ▶️
</button>

<button aria-label="Mute sound" class="mute-button">
    🔊
</button>
```

#### 3. Focus Management
```javascript
// Return focus to game after closing modal
function closeModal() {
    modal.style.display = 'none';
    gameCanvas.focus();
}
```

### Security

#### 1. Input Validation
```javascript
// Validate user input
function setPlayerName(name) {
    // Sanitize input
    const sanitized = name.trim().slice(0, 20);
    if (sanitized.length < 3) {
        return 'Name must be at least 3 characters';
    }
    playerName = sanitized;
}
```

#### 2. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
```

#### 3. Avoid eval()
```javascript
// ❌ Bad: Never use eval
eval(userInput);

// ✅ Good: Parse safely
JSON.parse(userInput);
```

---

## Quality Checklist

### Final Pre-Launch Checklist

#### Technical Quality ✅
- [ ] Load time < 5 seconds on 4G
- [ ] Frame rate ≥ 30fps (target 60fps)
- [ ] Memory usage < 150MB
- [ ] Bundle size < 5MB (target < 2MB)
- [ ] No console errors
- [ ] No memory leaks
- [ ] Works in iframe
- [ ] HTTPS enabled
- [ ] X-Frame-Options configured

#### Mobile Optimization ✅
- [ ] Viewport meta tags configured
- [ ] Touch targets ≥ 44x44px
- [ ] Safe areas respected
- [ ] Landscape/portrait support
- [ ] Tested on real devices
- [ ] No unwanted scrolling
- [ ] Touch feedback immediate
- [ ] Battery usage reasonable

#### Audio Quality ✅
- [ ] Audio doesn't autoplay
- [ ] Mute button present
- [ ] Audio files compressed
- [ ] Total audio < 1MB
- [ ] Pauses when tab hidden
- [ ] Respects user mute preference

#### Visual Quality ✅
- [ ] Responsive design (320px-768px)
- [ ] High contrast (4.5:1 for text)
- [ ] Readable fonts (≥ 14px body text)
- [ ] Loading state shown
- [ ] Smooth animations (60fps)
- [ ] No visual glitches
- [ ] Colorblind friendly

#### User Experience ✅
- [ ] Game instructions clear
- [ ] Controls intuitive
- [ ] Feedback immediate
- [ ] Error messages helpful
- [ ] Game state saves (optional)
- [ ] Restart button present
- [ ] Settings accessible

#### Code Quality ✅
- [ ] Code commented
- [ ] Error handling implemented
- [ ] No console.logs in production
- [ ] Assets optimized
- [ ] Unused code removed
- [ ] Clean file structure

#### Testing Complete ✅
- [ ] iOS Safari tested
- [ ] Chrome Android tested
- [ ] 3G network tested
- [ ] Lighthouse score > 80
- [ ] No iframe issues
- [ ] Orientation change tested
- [ ] 5+ minute play test (no crashes)

---

## Appendix: Example Mini App

### Minimal Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Simple Clicker Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a0b;
            color: #fff;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            user-select: none;
        }
        
        .score {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 40px;
        }
        
        .click-button {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border: none;
            font-size: 24px;
            color: white;
            cursor: pointer;
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
            transition: transform 0.1s;
            touch-action: manipulation;
        }
        
        .click-button:active {
            transform: scale(0.95);
        }
        
        .controls {
            position: absolute;
            top: 20px;
            right: 20px;
        }
        
        .icon-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            border: none;
            font-size: 24px;
            margin-left: 8px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="controls">
        <button class="icon-button" id="muteBtn">🔊</button>
        <button class="icon-button" id="resetBtn">↻</button>
    </div>
    
    <div class="score" id="score">0</div>
    <button class="click-button" id="clickBtn">
        Click Me!
    </button>
    
    <script>
        let score = 0;
        let isMuted = false;
        let canPlayAudio = false;
        
        const scoreEl = document.getElementById('score');
        const clickBtn = document.getElementById('clickBtn');
        const muteBtn = document.getElementById('muteBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        // Simple click sound (data URI for no external file)
        const clickSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGmi78uefTQwNUKjj8LhlGwU7k9nzx3oxBSV7zO3akDsIE162+OyrWxcMSKXh8bllHgU7k9nzx3oyBSZ8zO3akT0JFV+2+O2sWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHgU8lNr0yH0zBSd+zu/bkz0JFmC2+e6tWxgMSKXh8bllHg==');
        
        // Enable audio on first click
        clickBtn.addEventListener('click', () => {
            if (!canPlayAudio) {
                canPlayAudio = true;
            }
            
            score++;
            scoreEl.textContent = score;
            
            // Play sound
            if (canPlayAudio && !isMuted) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }
            
            // Save score
            localStorage.setItem('clickerScore', score);
        }, { passive: true });
        
        // Mute button
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            localStorage.setItem('clickerMuted', isMuted);
        });
        
        // Reset button
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset your score?')) {
                score = 0;
                scoreEl.textContent = score;
                localStorage.setItem('clickerScore', score);
            }
        });
        
        // Load saved data
        const savedScore = localStorage.getItem('clickerScore');
        if (savedScore) {
            score = parseInt(savedScore);
            scoreEl.textContent = score;
        }
        
        const savedMuted = localStorage.getItem('clickerMuted');
        if (savedMuted === 'true') {
            isMuted = true;
            muteBtn.textContent = '🔇';
        }
        
        // Pause when hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clickSound.pause();
            }
        });
    </script>
</body>
</html>
```

This example includes:
- ✅ Touch-optimized button (200x200px)
- ✅ Audio with user interaction requirement
- ✅ Mute button
- ✅ LocalStorage for saving state
- ✅ Responsive design
- ✅ Mobile viewport configuration
- ✅ Visual feedback on tap
- ✅ Self-contained (no external assets)
- ✅ < 5KB total size

---

## Contact & Support

For questions or clarifications about these specifications:
1. Review the main project README.md
2. Check LOGIC-EXPLAINED.md for technical details
3. See MOBILE-OPTIMIZATION.md for performance tips
4. Refer to example games in the workspace

---

**Last Updated:** January 2024  
**Specification Version:** 1.0  
**Platform Version:** 1.0.0

---

*Built with ❤️ for mobile gaming excellence*

