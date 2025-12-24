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
        const rawDamage = playerStats.attack;
        const defense = this.currentEnemy.stats.defense;
        const damage = Math.max(1, rawDamage - defense);

        this.currentEnemy.currentHp -= damage;

        let msg = `You hit ${this.currentEnemy.name} for ${damage} damage`;
        if (defense > 0) {
            msg += ` (${defense} blocked)`;
        }
        msg += `.`;
        narrator.combat(msg);

        this.ui.updateCombatStats(this.currentEnemy);

        if (this.currentEnemy.currentHp <= 0) {
            this.handleVictory();
        } else {
            this.enemyTurn();
        }
    }

    playerDefend() {
        if (!this.currentEnemy) return;
        narrator.combat("You prepare to defend yourself.");
        // Mitigation logic could go here, for now just skip to enemy turn with a flag? 
        // Or maybe reduce damage in enemyTurn?
        // Let's assume defence boosts stats temporarily.
        // For MVP: Just narrate and enemy turn (maybe implement mitigation later)
        this.enemyTurn(true); // Pass true for isDefending
    }

    useItem() {
        if (!this.currentEnemy) return;
        // Need to show inventory modal?
        // Or just use a potion?
        // UIManager calls this with 'item', maybe we should open inventory?
        this.ui.openInventory();
        // Combat doesn't progress until item is used or cancelled?
        // Actually, using an item should probably take a turn.
        // For now, let's just open inventory and let user decide.
        // If they use an item (e.g. potion), it should trigger a turn?
        // This requires more complex state management.
        // For MVP: Just log "Item usage not fully implemented in combat yet".
        narrator.combat("You check your inventory...");
        this.ui.openInventory();
    }

    enemyTurn(isDefending = false) {
        if (!this.currentEnemy) return;

        setTimeout(() => {
            // Check again in case enemy was killed during the delay
            if (!this.currentEnemy) return;

            const enemyStats = this.currentEnemy.stats;
            const playerStats = gameState.totalStats;

            // Simple AI: Just attack
            const rawDamage = enemyStats.attack;
            const defense = playerStats.defense;
            let damage = Math.max(1, rawDamage - defense);
            let blocked = defense; // Base mitigation

            if (isDefending) {
                // If defending, add extra mitigation visualization if desired, or keep "You blocked" message
                damage = Math.floor(damage / 2); // 50% damage reduction after armor
                blocked += Math.floor((rawDamage - defense) / 2); // Approximate extra blocked
                narrator.combat(`You braced for impact!`);
            }

            gameState.takeDamage(damage);

            let msg = `${this.currentEnemy.name} attacks for ${damage} damage`;
            if (defense > 0 || isDefending) {
                // Calculate true blocked amount for clarity (Raw - Final)
                const totalBlocked = rawDamage - damage;
                msg += ` (${totalBlocked} blocked)`;
            }
            msg += `.`;
            narrator.combat(msg);

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
        // Default XP to 20 if not specified (simple scaling logic possible later)
        const xp = this.currentEnemy.baseStats && this.currentEnemy.baseStats.xp ? this.currentEnemy.baseStats.xp : 20;

        gameState.addGold(gold);
        gameState.addXp(xp);

        narrator.loot(`Gained ${gold} Gold and ${xp} XP.`);

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
        // Block input immediately
        this.ui.clearChoices();

        narrator.combat(`You died...`);
        const alive = gameState.loseLife();

        if (!alive) {
            this.ui.updatePlayerStats();
            setTimeout(() => {
                this.storyManager.transitionTo('game_over');
            }, 3000);
        } else {
            // Narrate message
            narrator.combat(`Darkness takes you... (Life lost)`);
            narrator.combat(`Spiriting away to safety...`);

            this.ui.updatePlayerStats();
            this.currentEnemy = null;

            setTimeout(() => {
                // Restore 50% HP
                gameState.player.stats.currentHp = Math.floor(gameState.totalStats.maxHp * 0.5);
                this.ui.updatePlayerStats();

                // Determine safe spot based on Tier
                // Determine safe spot based on Current Act (more reliable than storyTier which can drift)
                const currentNode = gameState.progress.currentNodeId;
                let act = 1;
                const match = currentNode.match(/^act(\d+)_/);
                if (match) {
                    act = parseInt(match[1]);
                }

                let safeNodeId = 'act1_tavern'; // Default

                switch (act) {
                    case 1: safeNodeId = 'act1_tavern'; break;
                    case 2: safeNodeId = 'act1_tavern'; break;
                    case 3: safeNodeId = 'act3_rest'; break;
                    case 4: safeNodeId = 'act4_tavern'; break;
                    case 5: safeNodeId = 'act5_start'; break;
                    case 6: safeNodeId = 'act5_start'; break;
                    default: safeNodeId = 'act1_tavern';
                }

                narrator.story("You gasp for air, waking up in a safe place. Your wounds are tended.");
                this.storyManager.transitionTo(safeNodeId);
            }, 3000); // 3 second delay
        }
    }
}
