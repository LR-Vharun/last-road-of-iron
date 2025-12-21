import { STORY } from '../data/story.js';
import { gameState } from './gameState.js';
import { narrator } from '../ui/narration.js';
import { getItem } from '../data/items.js';

export class StoryManager {
    constructor(uiManager, combatManager) {
        this.ui = uiManager;
        this.combatManager = combatManager; // Circular dep handling: pass in or use event bus. 
        // Better: Main.js orchestrates. But for MVP, passing instance is fine.
    }

    start() {
        this.transitionTo('act1_start');
    }

    transitionTo(nodeId) {
        const node = STORY[nodeId];
        if (!node) {
            console.error(`Node ${nodeId} not found`);
            return;
        }

        gameState.progress.currentNodeId = nodeId;

        // Handle Action Hooks (e.g. advance_tier)
        if (node.choices && node.choices.some(c => c.action === 'reset_game')) {
            // Special handling for reset? Or just handled in handleChoice
        }

        // Narrate text
        narrator.story(node.text);

        // Give Rewards immediately if present in node (e.g. loot crate)
        if (node.rewards) {
            this.handleRewards(node.rewards);
        }

        // Determine View State
        if (node.type === 'tavern') {
            this.ui.showTavern(node);
        } else if (node.type === 'shop') {
            this.ui.showShop(node);
        } else {
            this.ui.showStory(node);
        }
    }

    handleChoice(choice) {
        if (choice.action === 'reset_game') {
            gameState.reset();
            this.start();
            return;
        }

        if (choice.action === 'advance_tier') {
            gameState.progress.storyTier++;
            narrator.log(`Entered Story Tier ${gameState.progress.storyTier}`, 'story');
        }

        if (choice.type === 'story') {
            this.transitionTo(choice.target);
        } else if (choice.type === 'combat') {
            // Hand off to combat manager
            this.combatManager.startCombat(choice.enemyId, choice.target);
        }
    }

    handleRewards(rewards) {
        if (rewards.gold) {
            gameState.addGold(rewards.gold);
            narrator.loot(`Found ${rewards.gold} Gold.`);
        }
        if (rewards.item) {
            const item = getItem(rewards.item);
            if (item) {
                gameState.addToInventory(item);
                narrator.loot(`Found Item: ${item.name}`);
            }
        }
    }
}
