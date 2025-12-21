import { ENEMIES } from '../data/enemies.js';
import { gameState } from './gameState.js';
import { narrator } from '../ui/narration.js';
import { CONSTANTS } from '../data/constants.js';

export class CombatManager {
    constructor(uiManager, storyManager) {
        this.ui = uiManager;
        this.storyManager = storyManager;
        this.currentEnemy = null;
        this.victoryNodeId = null;
        this.isPlayerTurn = true;
    }

    startCombat(enemyId, victoryNodeId) {
        // Deep copy enemy and scale stats
        const template = ENEMIES[enemyId];
        if (!template) {
            console.error('Enemy not found:', enemyId);
            return;
        }

        const tier = gameState.progress.storyTier;
        const scale = CONSTANTS.SCALING;

        // Simple linearish scaling: Base * (1 + (Tier-1)*Factor)
        // Or just exponential. MVP: Linear multiplier based on tier diff if any?
        // Actually, prompt says "Enemy strength scales based on storyTier".
        // The definitions in data/enemies.js already have tiers assigned.
        // We should just use the base stats if the enemy is designed for that tier.
        // But if we reuse an enemy, we might scale.
        // For now, let's use the defined stats as they match the Acts.

        this.currentEnemy = {
            ...template,
            currentHp: template.baseStats.hp,
            maxHp: template.baseStats.hp,
            stats: { ...template.baseStats }
        };

        this.victoryNodeId = victoryNodeId;
        this.isPlayerTurn = true;

        narrator.combat(`Encountered ${this.currentEnemy.name}!`);
        this.ui.showCombat(this.currentEnemy);
    }

    playerAttack() {
        if (!this.currentEnemy) return;

        const playerStats = gameState.totalStats;
        const damage = Math.max(1, playerStats.attack - this.currentEnemy.stats.defense);

        this.currentEnemy.currentHp -= damage;
        narrator.combat(`You hit ${this.currentEnemy.name} for ${damage} damage.`);

        this.ui.updateCombatStats(this.currentEnemy);

        if (this.currentEnemy.currentHp <= 0) {
            this.handleVictory();
        } else {
            this.enemyTurn();
        }
    }

    enemyTurn() {
        if (!this.currentEnemy) return;

        setTimeout(() => {
            const enemyStats = this.currentEnemy.stats;
            const playerStats = gameState.totalStats;

            // Simple AI: Just attack
            const damage = Math.max(1, enemyStats.attack - playerStats.defense);

            gameState.takeDamage(damage);
            narrator.combat(`${this.currentEnemy.name} attacks you for ${damage} damage.`);

            this.ui.updatePlayerStats();

            if (gameState.currentHp <= 0) {
                this.handleDefeat();
            } else {
                this.isPlayerTurn = true;
                // UI enables buttons
            }
        }, 1000); // Delay for pacing
    }

    handleVictory() {
        narrator.combat(`Victory! Defeated ${this.currentEnemy.name}.`);

        // Loot
        const gold = this.currentEnemy.stats.gold;
        gameState.addGold(gold);
        narrator.loot(`Gained ${gold} Gold.`);

        // Item drops
        // MVP: Deterministic drop if first time? Or always?
        // Prompt says "Drops are deterministic, not random for MVP"
        // And "Only one gear drop per enemy"
        // Simplest: Just give the first item in drops list if valid
        if (this.currentEnemy.drops && this.currentEnemy.drops.length > 0) {
            // For MVP let's randomly pick ONE deterministic item per kill or just the first
            // Prompt says "Bosses drop guaranteed high-tier gear".
            // Let's just give the first item.
            this.storyManager.handleRewards({ item: this.currentEnemy.drops[0] });
        }

        this.currentEnemy = null;

        // Return to story
        setTimeout(() => {
            this.storyManager.transitionTo(this.victoryNodeId);
        }, 1500);
    }

    handleDefeat() {
        narrator.combat(`You were defeated...`);

        const alive = gameState.loseLife();
        this.ui.updatePlayerStats();

        if (!alive) {
            this.storyManager.transitionTo('game_over');
        } else {
            // Restore partial HP and retreat?
            // "Losing combat: Player loses 1 life, HP partially restored, Narrated failure"
            gameState.player.stats.currentHp = Math.floor(gameState.totalStats.maxHp * 0.5);
            narrator.combat(`You crawl away, clinging to life. (Life lost)`);

            // Where do they go? Back to previous node? Or restart fight?
            // "Losing combat... Narrated failure". Usually implies retry or retreat.
            // Let's restart the scene (Act start) or just the Tavern.
            // Simplest for MVP: Retreat to Tavern of current act if possible, or just reset node.
            // Let's go to Act Start trigger.
            // Or just stay in 'story' mode but trigger a 'Retreat' text.

            // Actually, let's just push them to the Tavern of the current tier.
            // Hacky way: find tavern node for this act.
            // Easy way: transition to current node again?

            this.currentEnemy = null;
            setTimeout(() => {
                // Return to story start of this node?
                this.storyManager.transitionTo(gameState.progress.currentNodeId);
            }, 2000);
        }
    }
}
