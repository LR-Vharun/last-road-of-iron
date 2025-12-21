import { UIManager } from './ui/uiManager.js';
import { CombatManager } from './engine/combatManager.js';
import { StoryManager } from './engine/storyManager.js';
import { gameState } from './engine/gameState.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIManager();
    const story = new StoryManager(ui, null); // Will set combat later
    const combat = new CombatManager(ui, story);

    // Circular wiring
    story.combatManager = combat;

    // Wire UI callbacks
    ui.choiceCallback = (choice) => story.handleChoice(choice);
    ui.combatCallback = () => combat.playerAttack();

    // Initial render
    ui.updatePlayerStats();

    console.log("Starting Story Manager...");
    try {
        story.start();
        console.log("Story Manager started.");
    } catch (e) {
        console.error("Failed to start story:", e);
    }

    console.log('Last Road of Iron initialized. Checking Story Data...');
    import('./data/story.js').then(m => {
        console.log("Story Data Loaded:", m.STORY ? "Yes" : "No");
        if (m.STORY && m.STORY['act1_start']) {
            console.log("Act 1 Start Node exists.");
        } else {
            console.error("Act 1 Start Node MISSING!");
        }
    });
});
