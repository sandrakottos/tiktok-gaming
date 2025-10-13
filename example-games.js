// ================================================
// EXAMPLE: How to add your Vercel game URLs
// ================================================

// Copy this array into script.js (line 2) and replace with your actual game URLs

const GAMES = [
    {
        title: "Flappy Bird",
        url: "https://your-flappybird.vercel.app",  // Replace with your actual URL
        description: "Tap to fly and avoid the pipes!"
    },
    {
        title: "Hit Ball",
        url: "https://your-hitball.vercel.app",  // Replace with your actual URL
        description: "Hit the ball and collect coins!"
    },
    {
        title: "Plane Fighter",
        url: "https://your-plane.vercel.app",  // Replace with your actual URL
        description: "Shoot down enemy planes!"
    },
    {
        title: "Snake Game",
        url: "https://your-snake.vercel.app",  // Replace with your actual URL
        description: "Classic snake game with a twist!"
    },
    {
        title: "Tower Block",
        url: "https://your-tower.vercel.app",  // Replace with your actual URL
        description: "Stack blocks as high as you can!"
    }
];

// ================================================
// Real example with actual domains:
// ================================================
/*
const GAMES = [
    {
        title: "Flappy Bird",
        url: "https://flappybird-game-suryansh.vercel.app",
        description: "Tap to fly and avoid the pipes!"
    },
    {
        title: "Hit Ball",
        url: "https://hitball-game-suryansh.vercel.app",
        description: "Hit the ball and collect coins!"
    }
];
*/

// ================================================
// IMPORTANT NOTES:
// ================================================
// 
// 1. Each game MUST be hosted on its own URL (Vercel, Netlify, etc.)
// 2. Games must allow iframe embedding (no X-Frame-Options: DENY)
// 3. URLs should use HTTPS for security
// 4. Test each URL in a browser first to make sure it works
// 5. Mobile-optimized games work best!
//
// ================================================

