import { UIManager } from './ui/uiManager.js';
import { CombatManager } from './engine/combatManager.js';
import { StoryManager } from './engine/storyManager.js';
import { gameState } from './engine/gameState.js';

// Global game managers
let ui, story, combat;

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const newGameBtn = document.getElementById("new-game-btn");
    const continueGameBtn = document.getElementById("continue-game-btn");

    // Show Continue button if save exists
    if (localStorage.getItem("iron_rpg_save")) {
        continueGameBtn.classList.remove("hidden");
    }

    // Initialize game function
    function initializeGame(loadSave = false) {
        // Create managers
        ui = new UIManager();
        story = new StoryManager(ui, null);
        combat = new CombatManager(ui, story);

        // Circular wiring
        story.combatManager = combat;

        // Wire UI callbacks
        ui.choiceCallback = (choice) => story.handleChoice(choice);
        ui.combatCallback = (action) => {
            if (action === 'attack') combat.playerAttack();
            else if (action === 'defend') combat.playerDefend();
            else if (action === 'item') combat.useItem();
        };

        // Initial render
        ui.updatePlayerStats();

        // Start game
        if (loadSave) {
            if (gameState.load()) {
                console.log("Game loaded from save");
                story.transitionTo(gameState.progress.currentNodeId);
            } else {
                console.error("Failed to load save");
                story.start();
            }
        } else {
            // Reset game state for new game
            gameState.reset();
            console.log("Starting new game");
            story.start();
        }
    }

    // New Game button
    newGameBtn?.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        initializeGame(false);
    });

    // Continue Game button
    continueGameBtn?.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        initializeGame(true);
    });
});
