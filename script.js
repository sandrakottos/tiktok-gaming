// Game configuration - Add your Vercel-hosted game URLs here
const GAMES = [
    {
        title: "Snake Game",
        url: "https://snakegame123.vercel.app",
        description: "Classic snake game - collect food and grow!"
    },
    {
        title: "Flappy Bird",
        url: "https://flappybird3.vercel.app",
        description: "Tap to fly and avoid the pipes!"
    },
    {
        title: "Plane Fighter",
        url: "https://plane-sable.vercel.app",
        description: "Shoot down enemy planes in the sky!"
    },
    {
        title: "Hit Ball",
        url: "https://hitball-game.vercel.app",
        description: "Hit the ball and collect coins!"
    },
    {
        title: "Tower Block",
        url: "https://tower-block-game.vercel.app",
        description: "Stack blocks as high as you can!"
    }
];

// ==================== ANALYTICS SETUP ====================

// Generate anonymous session ID (persists during browser session)
function getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

// Unified analytics wrapper - tracks to both GA4 and Clarity
const analytics = {
    track(eventName, params = {}) {
        const data = {
            session_id: getSessionId(),
            timestamp: Date.now(),
            ...params
        };

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Microsoft Clarity
        if (typeof clarity !== 'undefined') {
            try {
                clarity('event', eventName);
                // Set custom tags for filtering sessions
                Object.entries(data).forEach(([key, value]) => {
                    const stringValue = typeof value === 'object' 
                        ? JSON.stringify(value) 
                        : String(value);
                    clarity('set', key, stringValue);
                });
            } catch (e) {
                console.warn('Clarity error:', e);
            }
        }

        // Debug logging
        console.log('[Analytics]', eventName, data);
    }
};

// Track session start immediately
const sessionStartTime = Date.now();
analytics.track('session_started', {
    total_games: GAMES.length,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    user_agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language
});

// ==================== END ANALYTICS SETUP ====================

// DOM Elements
const scrollContainer = document.getElementById('scrollContainer');
const loading = document.getElementById('loading');
const scrollHint = document.getElementById('scrollHint');
const gameInfo = document.getElementById('gameInfo');
const gameTitle = document.getElementById('gameTitle');
const gameDescription = document.getElementById('gameDescription');
const currentGameEl = document.getElementById('current-game');
const totalGamesEl = document.getElementById('total-games');
const header = document.querySelector('.header');

// State
let currentGameIndex = 0;
let isScrolling = false;
let scrollTimeout;
let loadedGames = new Set(); // Track which games have iframes loaded
let headerTimeout; // Track header hide timeout
let headerVisible = true;
let intersectionObserver = null; // Rock-solid viewport detection
let activeGameSection = null;
let rafId = null; // RequestAnimationFrame ID for smooth 60fps
let lastScrollPosition = 0;
let gameStartTime = Date.now(); // Track time spent on each game

// Initialize
function init() {
    // Set total games
    totalGamesEl.textContent = GAMES.length;
    
    // Create empty game sections (no iframes yet)
    GAMES.forEach((game, index) => {
        const section = createEmptyGameSection(game, index);
        scrollContainer.appendChild(section);
    });
    
    // Aggressive preloading for instant first swipe
    loadGame(0); // Load current immediately
    
    // Preload next TWO games for instant swipe (warm feed)
    if (GAMES.length > 1) {
        // Next game loads almost immediately (100ms delay for current to start)
        setTimeout(() => loadGame(1), 100);
    }
    if (GAMES.length > 2) {
        // Game after that loads shortly after (keep feed warm)
        setTimeout(() => loadGame(2), 300);
    }
    
    // Hide loading (faster for perceived speed)
    setTimeout(() => {
        loading.classList.add('hidden');
        showScrollHint();
        // Start header auto-hide timer
        startHeaderAutoHide();
    }, 200); // Reduced from 500ms to 200ms for instant feel
    
    // Setup scroll listener (passive for 60fps smooth scroll)
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Show header on scroll (briefly, passive for performance)
    scrollContainer.addEventListener('scroll', () => {
        if (!headerVisible) {
            showHeader();
        }
    }, { passive: true });
    
    // Show header on touch (passive for no scroll delay)
    scrollContainer.addEventListener('touchstart', () => {
        if (!headerVisible) {
            showHeader();
        }
    }, { passive: true });
    
    // Initial game info
    updateGameInfo(0);
    
    // Hide hint after first interaction
    let hasScrolled = false;
    scrollContainer.addEventListener('scroll', () => {
        if (!hasScrolled) {
            hasScrolled = true;
            hideScrollHint();
        }
    }, { once: true });
    
    // Prevent pull-to-refresh on mobile
    document.body.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Setup Intersection Observer for rock-solid active game detection
    setupIntersectionObserver();
}

// Rock-solid viewport detection using IntersectionObserver
function setupIntersectionObserver() {
    const options = {
        root: scrollContainer,
        rootMargin: '-20% 0px -20% 0px', // Detect when 60% of card is visible
        threshold: [0, 0.5, 1.0]
    };
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const index = parseInt(section.dataset.gameIndex);
            
            // Card is prominently in view (> 50% visible)
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                // Remove active class from previous
                if (activeGameSection && activeGameSection !== section) {
                    activeGameSection.classList.remove('active');
                }
                
                // Add active class to current
                section.classList.add('active');
                activeGameSection = section;
                
                // ANALYTICS: Track game view
                analytics.track('game_viewed', {
                    game_title: GAMES[index].title,
                    game_index: index,
                    game_url: GAMES[index].url
                });
                
                // Update state and track game switch
                if (index !== currentGameIndex) {
                    // ANALYTICS: Track time spent on previous game
                    if (currentGameIndex >= 0) {
                        const timeSpent = Date.now() - gameStartTime;
                        analytics.track('game_time_spent', {
                            game_title: GAMES[currentGameIndex].title,
                            game_index: currentGameIndex,
                            duration_ms: timeSpent,
                            duration_seconds: Math.round(timeSpent / 1000)
                        });
                    }
                    
                    // ANALYTICS: Track the game switch
                    if (currentGameIndex >= 0) {
                        analytics.track('game_switched', {
                            from_game: GAMES[currentGameIndex].title,
                            from_index: currentGameIndex,
                            to_game: GAMES[index].title,
                            to_index: index
                        });
                    }
                    
                    currentGameIndex = index;
                    updateGameInfo(currentGameIndex);
                    gameStartTime = Date.now(); // Reset timer for new game
                }
            } else {
                // Card is leaving view
                section.classList.remove('active');
            }
        });
    }, options);
    
    // Observe all game sections
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(section => {
        intersectionObserver.observe(section);
    });
}

// Create empty game section (without iframe)
function createEmptyGameSection(game, index) {
    const section = document.createElement('div');
    section.className = 'game-section';
    section.dataset.gameIndex = index;
    section.dataset.gameUrl = game.url;
    section.dataset.gameTitle = game.title;
    
    // Add placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'game-placeholder';
    placeholder.innerHTML = `
        <div class="placeholder-content">
            <div class="placeholder-spinner"></div>
            <h3>${game.title}</h3>
        </div>
    `;
    section.appendChild(placeholder);
    
    return section;
}

// Load game iframe into a section
function loadGame(index) {
    if (index < 0 || index >= GAMES.length || loadedGames.has(index)) {
        return; // Already loaded or invalid index
    }
    
    const sections = document.querySelectorAll('.game-section');
    const section = sections[index];
    const game = GAMES[index];
    
    // Remove placeholder
    const placeholder = section.querySelector('.game-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // ANALYTICS: Track load start with network info
    const loadStartTime = performance.now();
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    analytics.track('game_load_start', {
        game_title: game.title,
        game_index: index,
        game_url: game.url,
        network_type: connection?.effectiveType || 'unknown',
        downlink_mbps: connection?.downlink || null
    });
    
    // Create and add iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'game-frame';
    iframe.src = game.url;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    
    // ANALYTICS: Track load completion
    iframe.onload = () => {
        const loadDuration = Math.round(performance.now() - loadStartTime);
        analytics.track('game_load_complete', {
            game_title: game.title,
            game_index: index,
            duration_ms: loadDuration,
            duration_seconds: (loadDuration / 1000).toFixed(2)
        });
        
        console.log(`[Performance] ${game.title} loaded in ${loadDuration}ms`);
    };
    
    // ANALYTICS: Track load errors
    iframe.onerror = () => {
        const loadDuration = Math.round(performance.now() - loadStartTime);
        analytics.track('game_load_error', {
            game_title: game.title,
            game_index: index,
            duration_ms: loadDuration
        });
        
        console.error(`[Error] ${game.title} failed to load after ${loadDuration}ms`);
        
        section.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>⚠️ Unable to load game</h2>
                <p>${game.title}</p>
                <p style="margin-top: 10px; color: rgba(255,255,255,0.6);">Check the game URL</p>
            </div>
        `;
    };
    
    section.appendChild(iframe);
    loadedGames.add(index);
    
    console.log(`Loaded game ${index + 1}: ${game.title}`);
}

// Unload game iframe from a section
function unloadGame(index) {
    if (index < 0 || index >= GAMES.length || !loadedGames.has(index)) {
        return; // Not loaded or invalid index
    }
    
    const sections = document.querySelectorAll('.game-section');
    const section = sections[index];
    const game = GAMES[index];
    
    // Remove iframe
    const iframe = section.querySelector('.game-frame');
    if (iframe) {
        iframe.remove();
    }
    
    // Add placeholder back
    const placeholder = document.createElement('div');
    placeholder.className = 'game-placeholder';
    placeholder.innerHTML = `
        <div class="placeholder-content">
            <div class="placeholder-spinner"></div>
            <h3>${game.title}</h3>
        </div>
    `;
    section.appendChild(placeholder);
    
    loadedGames.delete(index);
    
    console.log(`Unloaded game ${index + 1}: ${game.title}`);
}


// Handle scroll events (optimized for 60fps)
function handleScroll() {
    // Cancel any pending RAF
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    
    // Use RAF for smooth 60fps updates
    rafId = requestAnimationFrame(() => {
        // Only update if scroll position actually changed
        const currentScroll = scrollContainer.scrollTop;
        if (Math.abs(currentScroll - lastScrollPosition) < 5) {
            return; // Skip micro-scrolls
        }
        lastScrollPosition = currentScroll;
        
        isScrolling = true;
        
        // Hide game info while scrolling (no reflow)
        if (gameInfo.classList.contains('visible')) {
            gameInfo.classList.remove('visible');
        }
    });
    
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Debounced scroll end detection
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        updateCurrentGame();
    }, 200);
}

// Update current game index and UI (fallback for scroll detection)
function updateCurrentGame() {
    const scrollPosition = scrollContainer.scrollTop;
    const viewportHeight = window.innerHeight;
    let newIndex = Math.round(scrollPosition / viewportHeight);
    
    // Clamp to valid range (no infinite scroll)
    newIndex = Math.max(0, Math.min(newIndex, GAMES.length - 1));
    
    if (newIndex !== currentGameIndex) {
        const oldIndex = currentGameIndex;
        currentGameIndex = newIndex;
        
        // Manage game loading/unloading
        manageGameLoading(currentGameIndex, oldIndex);
    }
}

// Aggressive game loading for warm feed (instant swipes)
function manageGameLoading(currentIndex, previousIndex) {
    // Load current game immediately
    loadGame(currentIndex);
    
    // Keep feed WARM: preload next TWO games for instant swipe
    if (currentIndex + 1 < GAMES.length) {
        loadGame(currentIndex + 1); // Next game
    }
    if (currentIndex + 2 < GAMES.length) {
        setTimeout(() => loadGame(currentIndex + 2), 50); // Game after next
    }
    
    // Keep previous game loaded for back navigation
    if (currentIndex - 1 >= 0) {
        loadGame(currentIndex - 1);
    }
    
    // Only unload games that are FAR away (more than 2 away for warm feed)
    loadedGames.forEach(index => {
        const distance = Math.abs(index - currentIndex);
        if (distance > 2) {
            // Use RAF to unload during idle time (no scroll jank)
            requestAnimationFrame(() => {
                if (!isScrolling) {
                    unloadGame(index);
                }
            });
        }
    });
}

// Update game info overlay (optimized to prevent reflows)
function updateGameInfo(index) {
    const game = GAMES[index];
    
    // Use RAF to batch DOM updates (prevent reflows during scroll)
    requestAnimationFrame(() => {
        // Update content (batched)
        gameTitle.innerHTML = `
            ${game.title}
            <span class="game-badge">NEW</span>
        `;
        gameDescription.textContent = game.description;
        currentGameEl.textContent = index + 1;
        
        // Show game info briefly (after layout is stable)
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (!isScrolling) { // Only show if not scrolling
                    gameInfo.classList.add('visible');
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        gameInfo.classList.remove('visible');
                    }, 3000);
                }
            }, 300);
        });
    });
}

// Show scroll hint
function showScrollHint() {
    scrollHint.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideScrollHint();
    }, 5000);
}

// Hide scroll hint
function hideScrollHint() {
    scrollHint.classList.add('hidden');
}

// Header visibility management
function hideHeader() {
    header.classList.add('hidden');
    headerVisible = false;
}

function showHeader() {
    header.classList.remove('hidden');
    headerVisible = true;
    
    // Reset hide timer
    if (headerTimeout) {
        clearTimeout(headerTimeout);
    }
    
    // Auto-hide after 3 seconds
    headerTimeout = setTimeout(() => {
        hideHeader();
    }, 3000);
}

// Start auto-hide timer for header
function startHeaderAutoHide() {
    // Initial hide after 3 seconds
    headerTimeout = setTimeout(() => {
        hideHeader();
    }, 3000);
}

// Keyboard navigation (for testing on desktop)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        if (currentGameIndex < GAMES.length - 1) {
            scrollToGame(currentGameIndex + 1);
        } else {
            // At last game, loop to first
            scrollToGame(0);
        }
    } else if (e.key === 'ArrowUp') {
        if (currentGameIndex > 0) {
            scrollToGame(currentGameIndex - 1);
        } else {
            // At first game, loop to last
            scrollToGame(GAMES.length - 1);
        }
    }
});

// Scroll to specific game
function scrollToGame(index, smooth = true) {
    if (index >= 0 && index < GAMES.length) {
        const targetScroll = index * window.innerHeight;
        scrollContainer.scrollTo({
            top: targetScroll,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }
}

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden (user switched tabs/apps)
        console.log('Page hidden');
    } else {
        // Page is visible again
        console.log('Page visible');
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    // Recalculate positions after orientation change
    setTimeout(() => {
        scrollToGame(currentGameIndex);
    }, 100);
});

// Start the app
init();

// ==================== ANALYTICS: SESSION END & VISIBILITY ====================

// Track session end
window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStartTime;
    analytics.track('session_ended', {
        duration_ms: sessionDuration,
        duration_seconds: Math.round(sessionDuration / 1000),
        duration_minutes: (sessionDuration / 60000).toFixed(2)
    });
});

// Track visibility changes (tab hidden/visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        analytics.track('tab_hidden', {
            current_game: GAMES[currentGameIndex]?.title || 'none',
            game_index: currentGameIndex
        });
    } else {
        analytics.track('tab_visible', {
            current_game: GAMES[currentGameIndex]?.title || 'none',
            game_index: currentGameIndex
        });
    }
});

