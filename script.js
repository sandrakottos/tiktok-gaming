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

// ==================== SIMPLIFIED ANALYTICS SETUP ====================

// Simplified analytics - Only business-focused events
const analytics = {
    // Track when user scrolls to a new game (discovery)
    trackGameScroll(gameName, position, totalViewed) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'game_scroll', {
                game_name: gameName,
                game_position: position,
                session_games_viewed: totalViewed
            });
        }
        console.log(`[Analytics] Game Scroll: ${gameName} (position ${position}, total viewed: ${totalViewed})`);
    },
    
    // Track when user actually plays a game (10+ seconds engagement)
    trackGamePlay(gameName, position, duration) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'game_play', {
                game_name: gameName,
                game_position: position,
                play_duration: Math.round(duration)
            });
        }
        console.log(`[Analytics] Game Play: ${gameName} (${Math.round(duration)}s)`);
    },
    
    // Track session end (overall engagement)
    trackSessionComplete(totalTime, gamesViewed, gamesPlayed, completedFeed) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'session_complete', {
                total_time: Math.round(totalTime),
                games_viewed: gamesViewed,
                games_played: gamesPlayed,
                completed_feed: completedFeed
            });
        }
        console.log(`[Analytics] Session Complete: ${Math.round(totalTime)}s, viewed ${gamesViewed}, played ${gamesPlayed}, completed: ${completedFeed}`);
    }
};

// Session tracking state
const sessionStartTime = Date.now();
let gamesViewedInSession = new Set();
let gamesPlayedInSession = new Set();

// Note: page_view is tracked automatically by GA4

// ==================== END SIMPLIFIED ANALYTICS SETUP ====================

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
let activatedGames = new Set(); // Track which games have been activated (facade -> iframe)
let playTrackingTimers = new Map(); // Track play analytics timers for cleanup
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
    
    // Prepare ALL game facades immediately (they're lightweight - just click handlers)
    // This ensures every game is ready to activate on tap, no delays
    GAMES.forEach((game, index) => {
        loadGame(index);
    });
    
    // Auto-activate first game for instant play
    setTimeout(() => {
        activateGame(0, 'initial_load'); // Auto-activate first game (no tap needed)
    }, 100);
    
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
    
    // Initial game info (disabled - no overlay banner)
    // updateGameInfo(0);
    
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
                
                // AUTO-ACTIVATE: If game isn't activated yet, activate it automatically
                // This ensures games load when scrolled into view (no tap needed)
                if (!activatedGames.has(index)) {
                    console.log(`[Auto-activate] Game ${index + 1} came into view, activating...`);
                    activateGame(index);
                }
                
                // SIMPLIFIED ANALYTICS: Track game scroll (discovery)
                gamesViewedInSession.add(index);
                analytics.trackGameScroll(
                    GAMES[index].title,
                    index + 1,
                    gamesViewedInSession.size
                );
                
                // Update state
                if (index !== currentGameIndex) {
                    currentGameIndex = index;
                    currentGameEl.textContent = index + 1; // Update counter for all games
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

// Create empty game section (with facade - loads iframe on interaction)
function createEmptyGameSection(game, index) {
    const section = document.createElement('div');
    section.className = 'game-section';
    section.dataset.gameIndex = index;
    section.dataset.gameUrl = game.url;
    section.dataset.gameTitle = game.title;
    section.dataset.activated = 'false'; // Track if facade has been activated
    
    // Add facade (lightweight preview that loads iframe on tap)
    const facade = document.createElement('div');
    facade.className = 'game-facade';
    facade.innerHTML = `
        <div class="facade-content">
            <div class="facade-icon">🎮</div>
            <h3 class="facade-title">${game.title}</h3>
            <p class="facade-description">${game.description}</p>
            <div class="facade-play-button">
                <div class="play-icon">▶</div>
                <span>Tap to Play</span>
            </div>
            <div class="facade-hint">Game loads instantly on tap</div>
        </div>
    `;
    section.appendChild(facade);
    
    return section;
}

// Prepare game section (set up facade with click handler)
function loadGame(index) {
    if (index < 0 || index >= GAMES.length || loadedGames.has(index)) {
        return; // Already loaded or invalid index
    }
    
    const sections = document.querySelectorAll('.game-section');
    const section = sections[index];
    const game = GAMES[index];
    
    // Set up click/tap handler to activate the game (convert facade to iframe)
    const facade = section.querySelector('.game-facade');
    if (facade && section.dataset.activated === 'false') {
        facade.style.cursor = 'pointer';
        
        // Add click handler to activate game
        const activateHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`[User tap] Activating game ${index + 1}...`);
            activateGame(index, 'user_interaction');
        };
        
        facade.addEventListener('click', activateHandler, { once: true });
        facade.addEventListener('touchstart', activateHandler, { once: true, passive: false });
    }
    
    loadedGames.add(index);
    console.log(`Prepared game ${index + 1}: ${game.title} (facade ready)`);
}

// Activate game - convert facade to actual iframe (called on user interaction or auto-activate)
function activateGame(index, trigger = 'auto') {
    if (index < 0 || index >= GAMES.length || activatedGames.has(index)) {
        return; // Already activated or invalid index
    }
    
    const sections = document.querySelectorAll('.game-section');
    const section = sections[index];
    const game = GAMES[index];
    
    // Mark as activated
    section.dataset.activated = 'true';
    activatedGames.add(index);
    
    console.log(`[Game Activated] ${game.title} (trigger: ${trigger}, total in memory: ${activatedGames.size})`);
    
    // CASCADE PRELOAD: Activate adjacent games in background for instant transitions
    // This makes scrolling feel instantaneous
    setTimeout(() => {
        if (index + 1 < GAMES.length && !activatedGames.has(index + 1)) {
            console.log(`[Cascade] Preloading next game ${index + 2}...`);
            activateGame(index + 1, 'preload');
        }
    }, 500); // Preload after 500ms delay
    
    setTimeout(() => {
        if (index - 1 >= 0 && !activatedGames.has(index - 1)) {
            console.log(`[Cascade] Preloading previous game ${index}...`);
            activateGame(index - 1, 'preload');
        }
    }, 1000); // Preload previous game after 1s delay
    
    // SLIDING WINDOW MEMORY MANAGEMENT: Unload games outside centered window
    // Keeps memory usage constant regardless of total game count
    const WINDOW_SIZE = 7; // Keep 7 games in memory (current ± 3)
    const HALF_WINDOW = Math.floor(WINDOW_SIZE / 2); // 3 games on each side
    
    setTimeout(() => {
        const gamesToUnload = [];
        
        // Check all activated games and find ones outside the window
        activatedGames.forEach(gameIndex => {
            const distance = Math.abs(gameIndex - index);
            
            // If game is more than HALF_WINDOW positions away, mark for unload
            if (distance > HALF_WINDOW) {
                gamesToUnload.push(gameIndex);
            }
        });
        
        // Unload games outside the window
        if (gamesToUnload.length > 0) {
            console.log(`[Sliding Window] Current game: ${index + 1}, Window: [${Math.max(0, index - HALF_WINDOW) + 1}-${Math.min(GAMES.length - 1, index + HALF_WINDOW) + 1}]`);
            console.log(`[Sliding Window] Unloading ${gamesToUnload.length} games: ${gamesToUnload.map(i => i + 1).join(', ')}`);
            console.log(`[Memory] Before: ${activatedGames.size} games, After: ${activatedGames.size - gamesToUnload.length} games`);
            
            gamesToUnload.forEach(gameIndex => {
                // Use RAF to avoid performance impact during scrolling
                requestAnimationFrame(() => {
                    if (!isScrolling) {
                        unloadGame(gameIndex);
                    }
                });
            });
        }
    }, 2000); // Wait 2 seconds before cleanup (allows smooth scrolling)
    
    // Remove facade
    const facade = section.querySelector('.game-facade');
    if (facade) {
        facade.remove();
    }
    
    // Show loading state
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'game-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading ${game.title}...</p>
        </div>
    `;
    section.appendChild(loadingOverlay);
    
    // Performance tracking (console only - for debugging)
    const loadStartTime = performance.now();
    
    // Create and add iframe with lazy loading
    const iframe = document.createElement('iframe');
    iframe.className = 'game-frame';
    iframe.src = game.url;
    iframe.loading = 'lazy'; // Native lazy loading
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    
    // Track load completion (console only)
    iframe.onload = () => {
        const loadDuration = Math.round(performance.now() - loadStartTime);
        console.log(`[Performance] ${game.title} loaded in ${loadDuration}ms`);
        
        // Remove loading overlay
        if (loadingOverlay && loadingOverlay.parentNode) {
            loadingOverlay.remove();
        }
        
        // SIMPLIFIED ANALYTICS: Track play engagement (10+ seconds)
        // Only track if user stays on game for 10+ seconds
        let playTracked = false;
        const playStartTime = Date.now();
        
        // Clear any existing timer for this game (in case it's reloaded)
        if (playTrackingTimers.has(index)) {
            clearTimeout(playTrackingTimers.get(index));
        }
        
        // Set new timer and store it for cleanup
        const timerId = setTimeout(() => {
            // Check if game is still active and user hasn't navigated away
            if (!playTracked && 
                activeGameSection === section && 
                !document.hidden) {
                
                const playDuration = (Date.now() - playStartTime) / 1000;
                
                // Track as "played" if 10+ seconds
                if (playDuration >= 10) {
                    gamesPlayedInSession.add(index);
                    analytics.trackGamePlay(
                        game.title,
                        index + 1,
                        playDuration
                    );
                    playTracked = true;
                }
            }
            // Clean up timer reference
            playTrackingTimers.delete(index);
        }, 10000); // 10 second threshold for engagement
        
        // Store timer ID for cleanup
        playTrackingTimers.set(index, timerId);
    };
    
    // Track load errors (console only)
    iframe.onerror = () => {
        const loadDuration = Math.round(performance.now() - loadStartTime);
        console.error(`[Error] ${game.title} failed to load after ${loadDuration}ms`);
        
        // Remove loading overlay
        if (loadingOverlay && loadingOverlay.parentNode) {
            loadingOverlay.remove();
        }
        
        section.innerHTML = `
            <div style="text-align: center; padding: 20px; color: white;">
                <h2>⚠️ Unable to load game</h2>
                <p>${game.title}</p>
                <p style="margin-top: 10px; color: rgba(255,255,255,0.6);">Check the game URL</p>
            </div>
        `;
    };
    
    section.appendChild(iframe);
    
    console.log(`Activated game ${index + 1}: ${game.title} (iframe loading)`);
}

// Unload game iframe from a section (convert back to facade if needed)
function unloadGame(index) {
    if (index < 0 || index >= GAMES.length || !loadedGames.has(index)) {
        return; // Not loaded or invalid index
    }
    
    const sections = document.querySelectorAll('.game-section');
    const section = sections[index];
    const game = GAMES[index];
    
    // Only unload if it's been activated (has iframe)
    if (activatedGames.has(index)) {
        // Clear play tracking timer if it exists (performance optimization)
        if (playTrackingTimers.has(index)) {
            clearTimeout(playTrackingTimers.get(index));
            playTrackingTimers.delete(index);
        }
        
        // Remove iframe
        const iframe = section.querySelector('.game-frame');
        if (iframe) {
            iframe.remove();
        }
        
        // Remove loading overlay if present
        const loadingOverlay = section.querySelector('.game-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        // Add facade back
        const facade = document.createElement('div');
        facade.className = 'game-facade';
        facade.style.cursor = 'pointer';
        facade.innerHTML = `
            <div class="facade-content">
                <div class="facade-icon">🎮</div>
                <h3 class="facade-title">${game.title}</h3>
                <p class="facade-description">${game.description}</p>
                <div class="facade-play-button">
                    <div class="play-icon">▶</div>
                    <span>Tap to Play</span>
                </div>
                <div class="facade-hint">Game loads instantly on tap</div>
            </div>
        `;
        section.appendChild(facade);
        
        // Re-attach click handler to the new facade
        const activateHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`[User tap] Re-activating game ${index + 1}...`);
            activateGame(index, 'user_interaction');
        };
        
        facade.addEventListener('click', activateHandler, { once: true });
        facade.addEventListener('touchstart', activateHandler, { once: true, passive: false });
        
        // Reset activation state
        section.dataset.activated = 'false';
        activatedGames.delete(index);
        
        console.log(`[Unloaded] Game ${index + 1}: ${game.title} (Memory: ${activatedGames.size} games)`);
    }
    
    // Keep it in loadedGames so it can be quickly reactivated
    // Don't delete from loadedGames unless you want to remove the click handler too
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

// Update game info overlay (only shows on first game as a guide)
function updateGameInfo(index) {
    const game = GAMES[index];
    
    // Only show info overlay on first game (to guide users to swipe)
    if (index !== 0) {
        return; // Don't show overlay for other games
    }
    
    // Use RAF to batch DOM updates (prevent reflows during scroll)
    requestAnimationFrame(() => {
        // Update content (batched)
        gameTitle.textContent = game.title; // No "NEW" badge
        gameDescription.textContent = game.description;
        currentGameEl.textContent = index + 1;
        
        // Show game info briefly (after layout is stable)
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (!isScrolling) { // Only show if not scrolling
                    gameInfo.classList.add('visible');
                    
                    // Hide after 4 seconds (give users time to read)
                    setTimeout(() => {
                        gameInfo.classList.remove('visible');
                    }, 4000);
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

// ==================== SIMPLIFIED ANALYTICS: SESSION END ====================

// Track session complete (overall engagement metrics)
window.addEventListener('beforeunload', () => {
    const sessionDuration = (Date.now() - sessionStartTime) / 1000; // Convert to seconds
    const completedFeed = gamesViewedInSession.has(GAMES.length - 1); // Did they reach the last game?
    
    analytics.trackSessionComplete(
        sessionDuration,
        gamesViewedInSession.size,
        gamesPlayedInSession.size,
        completedFeed
    );
});

