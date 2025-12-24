import { CONSTANTS } from '../data/constants.js';
import { getItem, ITEMS } from '../data/items.js';

class GameState {
    constructor() {
        this.listeners = [];
        this.reset();
    }

    // Observer Pattern
    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb());
    }

    reset() {
        this.player = {
            stats: {
                currentHp: 100,
                maxHp: 100,
                baseAttack: 1,
                baseDefense: 0,
                gold: 0,
                lives: CONSTANTS.MAX_LIVES,
                level: 1,
                xp: 0
            },
            equipment: {
                weapon: getItem('sword_t0'),
                helmet: null,
                armor: null,
                gloves: null,
                shield: null,
                boots: null,
                accessory: null
            },
            inventory: []
        };

        this.progress = {
            storyTier: 1,
            currentNodeId: 'act1_start',
            flags: {}
        };
        this.notify();
    }

    // Getters for calculated stats
    get totalStats() {
        let hp = this.player.stats.maxHp;
        let atk = this.player.stats.baseAttack;
        let def = this.player.stats.baseDefense;

        for (const key in this.player.equipment) {
            const item = this.player.equipment[key];
            if (item && item.stats) {
                if (item.stats.hp) hp += item.stats.hp;
                if (item.stats.attack) atk += item.stats.attack;
                if (item.stats.defense) def += item.stats.defense;
            }
        }

        return { maxHp: hp, attack: atk, defense: def };
    }

    get currentHp() {
        return this.player.stats.currentHp;
    }

    // Stat Modifiers
    heal(amount) {
        const max = this.totalStats.maxHp;
        this.player.stats.currentHp = Math.min(this.player.stats.currentHp + amount, max);
        this.notify();
    }

    takeDamage(amount) {
        this.player.stats.currentHp = Math.max(0, this.player.stats.currentHp - amount);
        this.notify();
    }

    loseLife() {
        if (this.player.stats.lives > 0) {
            this.player.stats.lives--;
        }
        this.notify();
        return this.player.stats.lives > 0;
    }

    recoverLife() {
        if (this.player.stats.lives < CONSTANTS.MAX_LIVES) {
            this.player.stats.lives++;
            this.notify();
            return true;
        }
        return false;
    }

    addGold(amount) {
        this.player.stats.gold += amount;
        this.notify();
    }

    addXp(amount) {
        this.player.stats.xp += amount;
        this.checkLevelUp();
        this.notify(); // checkLevelUp handles its own notify if level up happens, but safer here too
    }

    checkLevelUp() {
        const xpThreshold = this.player.stats.level * 100;
        if (this.player.stats.xp >= xpThreshold) {
            this.player.stats.xp -= xpThreshold; // Reset/Overflow logic
            this.player.stats.level++;

            // Increase Max HP
            this.player.stats.maxHp += 20;

            // Heal fully on level up
            this.player.stats.currentHp = this.totalStats.maxHp;

            // Recurse in case of massive XP gain
            this.checkLevelUp();
            this.notify();
        }
    }

    spendGold(amount) {
        if (this.player.stats.gold >= amount) {
            this.player.stats.gold -= amount;
            this.notify();
            return true;
        }
        return false;
    }

    equipItem(item) {
        // If slot is occupied, unequip first (move to inventory)
        const slot = item.slot;
        if (this.player.equipment[slot]) {
            this.player.inventory.push(this.player.equipment[slot]);
        }
        this.player.equipment[slot] = item;
        // Remove from inventory if it was there
        const idx = this.player.inventory.findIndex(i => i.id === item.id);
        if (idx !== -1) {
            this.player.inventory.splice(idx, 1);
        }
        this.notify();
    }

    addToInventory(item) {
        this.player.inventory.push(item);
        this.notify();
    }

    removeFromInventory(item) {
        const idx = this.player.inventory.indexOf(item);
        if (idx > -1) {
            this.player.inventory.splice(idx, 1);
        }
        this.notify();
    }

    getAllItems() {
        return ITEMS;
    }
}

export const gameState = new GameState();
