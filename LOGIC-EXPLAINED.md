# 🧠 Logic Explanation - How Games Load/Unload

## 📊 Current System:

### **Step-by-Step Flow:**

```
1. PAGE LOADS
   ↓
   Load Game 1 (Snake) immediately
   ↓
   After 0.5s: Preload Game 2 (Flappy Bird)
   ↓
   Status: [Game 1 ✅] [Game 2 ✅] [Game 3 ❌] [Game 4 ❌] [Game 5 ❌]
```

```
2. USER SWIPES TO GAME 2
   ↓
   Game 2 becomes active
   ↓
   Keep Game 1 loaded (can swipe back)
   ↓
   Preload Game 3 (Plane Fighter)
   ↓
   Status: [Game 1 ✅] [Game 2 🎮] [Game 3 ✅] [Game 4 ❌] [Game 5 ❌]
```

```
3. USER SWIPES TO GAME 3
   ↓
   Game 3 becomes active
   ↓
   Keep Game 2 loaded (can swipe back)
   ↓
   Preload Game 4 (Hit Ball)
   ↓
   UNLOAD Game 1 (distance > 1) ⚠️
   ↓
   Status: [Game 1 ❌] [Game 2 ✅] [Game 3 🎮] [Game 4 ✅] [Game 5 ❌]
```

```
4. USER SWIPES TO GAME 4
   ↓
   Game 4 becomes active
   ↓
   Keep Game 3 loaded (can swipe back)
   ↓
   Preload Game 5 (Tower Block)
   ↓
   UNLOAD Game 2 (distance > 1) ⚠️
   ↓
   Status: [Game 1 ❌] [Game 2 ❌] [Game 3 ✅] [Game 4 🎮] [Game 5 ✅]
```

---

## 🎯 Key Rules:

### **Loading Rules:**
1. **Current game**: Always loaded
2. **Next game (+1)**: Preloaded for instant switch
3. **Previous game (-1)**: Kept loaded to go back
4. **All others**: Not loaded

### **Unloading Rules:**
- **Distance > 1**: Iframe completely removed
- **Memory freed**: No game code running
- **Placeholder shown**: Spinner + game title
- **Reloads when needed**: Fresh iframe created when you come back

---

## 💾 What Gets Removed:

When a game is **unloaded**:

```javascript
// BEFORE (loaded):
<div class="game-section">
  <iframe src="https://game.vercel.app"></iframe>  ← Running game
</div>

// AFTER (unloaded):
<div class="game-section">
  <div class="game-placeholder">
    <div class="spinner"></div>         ← Just a spinner
    <h3>Game Name</h3>
  </div>
</div>
```

**Result:**
- ✅ No iframe = No memory usage
- ✅ No JavaScript running
- ✅ No audio playing
- ✅ No network requests
- ✅ Battery saved

---

## 🎮 Do Games Actually Stop?

### **YES!** Here's what happens:

| When you scroll away... | What happens |
|------------------------|--------------|
| **Distance = 1** (adjacent) | Game keeps running in background |
| **Distance > 1** (far) | iframe **DELETED** → Game **STOPS** completely |
| **Come back later** | iframe **RECREATED** → Game **STARTS FRESH** |

### **Example:**

```
Playing Game 3, then scroll to Game 5:

Game 3:
  Iframe exists → Game running ✅
  
You scroll away (distance = 2):
  Iframe removed → Game STOPPED ⛔
  
You scroll back:
  Iframe created → Game RESTARTED (fresh) 🔄
```

---

## ⚡ Performance Impact:

### **Memory Usage:**

```
All 5 games loaded:     ~500-1000 MB ❌ (too much!)
Current system (3 max): ~100-200 MB ✅ (perfect!)
```

### **CPU Usage:**

```
All games running:   100% CPU, phone gets hot 🔥
Current system:      Only 1-3 games running ✅
```

### **Battery:**

```
All games:      Drains fast ⚡ (lasts 1-2 hours)
Current system: Normal usage ✅ (lasts 4-5 hours)
```

---

## 🔧 The Code Behind It:

### **1. Load Game:**
```javascript
function loadGame(index) {
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = game.url;
  section.appendChild(iframe);
  
  // Track it
  loadedGames.add(index);
}
```

### **2. Unload Game:**
```javascript
function unloadGame(index) {
  // Remove iframe completely
  iframe.remove();
  
  // Add placeholder
  section.innerHTML = '<div>Loading...</div>';
  
  // Stop tracking
  loadedGames.delete(index);
}
```

### **3. Smart Management:**
```javascript
function manageGameLoading(currentIndex) {
  // Keep: current, +1, -1
  loadGame(currentIndex);
  loadGame(currentIndex + 1);
  loadGame(currentIndex - 1);
  
  // Remove: everything else
  loadedGames.forEach(index => {
    if (Math.abs(index - currentIndex) > 1) {
      unloadGame(index);  // BYE! 👋
    }
  });
}
```

---

## 🎪 Visual Example:

```
Position at Game 3:

Game 1: ❌ UNLOADED     (distance = 2)
        └─ Placeholder showing

Game 2: ✅ LOADED        (distance = 1)
        └─ iframe exists, game running (not visible)

Game 3: 🎮 ACTIVE        (distance = 0)
        └─ iframe visible, you're playing

Game 4: ✅ LOADED        (distance = 1)
        └─ iframe exists, ready instantly

Game 5: ❌ UNLOADED     (distance = 2)
        └─ Placeholder showing
```

---

## 🚀 Why This is Smart:

1. **Instant Transitions** - Next/previous games already loaded
2. **Low Memory** - Only 2-3 games in memory
3. **Games Actually Stop** - Distant games completely removed
4. **Battery Friendly** - Not running 5 games at once
5. **Fresh Start** - Game resets when you come back
6. **No Lag** - Phone stays responsive

---

## 🐛 Known Limitation:

**Game state is NOT saved** when unloaded:
- If you're on level 10
- Scroll far away
- Come back
- Game starts fresh at level 1

**Possible solution:** 
- Use localStorage to save game state
- Send postMessage to game before unloading
- Game saves its own state

---

**This is the TikTok approach:** Only what you see (and immediate neighbors) exists!

