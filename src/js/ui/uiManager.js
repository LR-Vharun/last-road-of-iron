import { gameState } from '../engine/gameState.js';
import { narrator } from './narration.js';
import { CONSTANTS } from '../data/constants.js';
import { getItem } from '../data/items.js';

export class UIManager {
    constructor() {
        this.els = {
            hp: document.getElementById('hp-display'),
            lives: document.getElementById('lives-display'),
            gold: document.getElementById('gold-display'),
            level: document.getElementById('level-display'),
            log: document.getElementById('narrative-log'),
            choices: document.getElementById('choice-container'),
            imageArea: document.getElementById('image-area'),
            inventoryBtn: document.getElementById('inventory-btn'),
            inventoryModal: document.getElementById('inventory-modal'),
            closeInventory: document.getElementById('close-inventory'),
            equipmentSlots: document.getElementById('equipment-slots'),
            inventoryList: document.getElementById('inventory-list')
        };

        this.choiceCallback = null;
        this.combatCallback = null;

        this.initListeners();

        // Subscribe to narrator
        narrator.subscribe(msg => this.appendLog(msg));
    }

    initListeners() {
        this.els.inventoryBtn.onclick = () => this.openInventory();
        this.els.closeInventory.onclick = () => this.els.inventoryModal.classList.add('hidden');
    }

    updatePlayerStats() {
        const stats = gameState.totalStats;
        const current = gameState.player.stats;

        this.els.hp.textContent = `HP: ${current.currentHp}/${stats.maxHp}`;
        this.els.lives.textContent = `Lives: ${current.lives}/${CONSTANTS.MAX_LIVES}`;
        this.els.gold.textContent = `Gold: ${current.gold}`;
        this.els.level.textContent = `Tier: ${gameState.progress.storyTier}`;
    }

    appendLog({ text, type }) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = `log-entry log-${type}`;
        this.els.log.appendChild(p);
        this.els.log.scrollTop = this.els.log.scrollHeight;
    }

    clearChoices() {
        this.els.choices.innerHTML = '';
    }

    renderChoices(choices, callback) {
        this.clearChoices();
        choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c.text;
            btn.onclick = () => callback(c);
            this.els.choices.appendChild(btn);
        });
    }

    // View States
    showStory(node) {
        // Just render choices normally
        this.renderChoices(node.choices, (c) => this.choiceCallback(c));
    }

    showCombat(enemy) {
        // Render Combat Actions
        this.clearChoices();
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = `Attack ${enemy.name}`;
        btn.onclick = () => this.combatCallback();
        this.els.choices.appendChild(btn);
    }

    updateCombatStats(enemy) {
        // Maybe show enemy HP somewhere? For MVP just log is fine?
        // Let's add a temporary enemy status line in the log or above buttons
        // For premium feel: Update the image area text?
        const status = document.querySelector('.placeholder-art');
        if (status) status.textContent = `${enemy.name} HP: ${enemy.currentHp}/${enemy.maxHp}`;
    }

    showTavern(node) {
        // Tavern Actions: Rest options
        const tavernChoices = [
            { text: "Common Room (10g, +30% HP)", action: () => this.rest(10, 0.3) },
            { text: "Private Room (50g, +60% HP)", action: () => this.rest(50, 0.6) },
            { text: "Luxury Suite (100g, Full HP + Life)", action: () => this.rest(100, 1.0, true) }
        ];

        // Combine with node exit choices
        const combined = [
            ...tavernChoices.map(tc => ({
                text: tc.text,
                type: 'custom',
                target: null,
                customAction: tc.action
            })),
            ...node.choices.map(c => ({ ...c, type: 'story' }))
        ];

        this.renderChoices(combined, (choice) => {
            if (choice.type === 'custom') {
                choice.customAction();
                this.updatePlayerStats();
            } else {
                this.choiceCallback(choice);
            }
        });
    }

    showShop(node) {
        this.clearChoices();

        // Shop Header
        const header = document.createElement('h3');
        header.textContent = "Merchant's Wares";
        header.style.color = 'var(--c-accent)';
        this.els.choices.appendChild(header);

        // Buy Section
        const buyLabel = document.createElement('div');
        buyLabel.textContent = "--- Buy ---";
        buyLabel.className = 'shop-section-label';
        this.els.choices.appendChild(buyLabel);

        const currentTier = gameState.progress.storyTier;

        // Gather all purchasable items up to current tier (excluding starter garbage)
        const allItems = [
            ...gameState.getAllItems().weapons,
            ...gameState.getAllItems().helmets,
            ...gameState.getAllItems().armor,
            ...gameState.getAllItems().accessories
        ].filter(i => i.tier <= currentTier && i.tier > 0 && i.price > 0);

        allItems.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            const cost = item.price;
            const canAfford = gameState.player.stats.gold >= cost;

            btn.textContent = `Buy ${item.name} (${cost}g) - ${item.desc}`;
            btn.disabled = !canAfford;
            if (!canAfford) btn.style.color = 'var(--c-text-dim)';

            btn.onclick = () => {
                if (gameState.spendGold(cost)) {
                    gameState.addToInventory(item);
                    narrator.story(`Bought ${item.name}.`);
                    this.updatePlayerStats();
                    this.showShop(node); // Re-render to update buttons
                }
            };
            this.els.choices.appendChild(btn);
        });

        // Sell Section
        const sellLabel = document.createElement('div');
        sellLabel.textContent = "--- Sell ---";
        sellLabel.className = 'shop-section-label';
        this.els.choices.appendChild(sellLabel);

        gameState.player.inventory.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            const sellPrice = Math.floor(item.price * CONSTANTS.SELL_RATIO);

            btn.textContent = `Sell ${item.name} (+${sellPrice}g)`;
            btn.onclick = () => {
                gameState.addGold(sellPrice);
                gameState.removeFromInventory(item); // Need to implement this in gameState
                narrator.story(`Sold ${item.name} for ${sellPrice}g.`);
                this.updatePlayerStats();
                this.showShop(node);
            };
            this.els.choices.appendChild(btn);
        });

        // Leave Button
        const leaveBtn = document.createElement('button');
        leaveBtn.className = 'choice-btn';
        leaveBtn.style.marginTop = '1rem';
        leaveBtn.style.border = '1px solid var(--c-accent)';
        leaveBtn.textContent = "Leave Shop";
        // Find the 'story' choice from the node to leave
        const exitChoice = node.choices.find(c => c.type === 'story');
        if (exitChoice) {
            leaveBtn.onclick = () => this.choiceCallback(exitChoice);
        } else {
            // Fallback if no exit defined (shouldn't happen with correct story data)
            leaveBtn.textContent = "Back";
            leaveBtn.onclick = () => console.warn("No exit choice defined for shop");
        }
        this.els.choices.appendChild(leaveBtn);
    }

    rest(cost, healPercent, restoreLife = false) {
        if (gameState.spendGold(cost)) {
            const healAmount = Math.floor(gameState.totalStats.maxHp * healPercent);
            gameState.heal(healAmount);
            if (restoreLife) gameState.recoverLife();
            narrator.story("You rested and recovered.");
        } else {
            narrator.story("Not enough gold.");
        }
    }

    openInventory() {
        this.els.inventoryModal.classList.remove('hidden');
        this.renderInventory();
    }

    renderInventory() {
        // Equipment
        this.els.equipmentSlots.innerHTML = '<h3>Equipped</h3>';
        Object.entries(gameState.player.equipment).forEach(([slot, item]) => {
            const div = document.createElement('div');
            div.textContent = `${slot.toUpperCase()}: ${item ? item.name : 'Empty'}`;
            this.els.equipmentSlots.appendChild(div);
        });

        // Bag
        this.els.inventoryList.innerHTML = '<h3>Bag (Click to Equip)</h3>';
        gameState.player.inventory.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = `${item.name} (${item.type}) - ${JSON.stringify(item.stats)}`;
            btn.onclick = () => {
                gameState.equipItem(item);
                this.renderInventory();
                this.updatePlayerStats();
            };
            this.els.inventoryList.appendChild(btn);
        });
    }
}
