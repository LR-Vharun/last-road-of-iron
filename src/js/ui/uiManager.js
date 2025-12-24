import { gameState } from '../engine/gameState.js';
import { narrator } from './narration.js';
import { CONSTANTS } from '../data/constants.js';
import { getItem } from '../data/items.js';

export class UIManager {
    constructor() {
        this.els = {
            // Stats Text
            hpText: document.getElementById('hp-text'),
            lives: document.getElementById('lives-display'),
            gold: document.getElementById('gold-display'),
            level: document.getElementById('level-display'),
            xpText: document.getElementById('xp-text'),

            // Bars
            hpFill: document.getElementById('hp-fill'),
            xpFill: document.getElementById('xp-fill'),

            log: document.getElementById('narrative-log'),
            choices: document.getElementById('choice-container'),
            imageArea: document.getElementById('image-area'),
            inventoryBtn: document.getElementById('inventory-btn'),
            inventoryModal: document.getElementById('inventory-modal'),
            closeInventory: document.getElementById('close-inventory'),
            equipmentSlots: document.getElementById('equipment-slots'),
            inventoryList: document.getElementById('inventory-list')
        };

        // Handle null elements gracefully if they don't exist yet (for safety)
        if (!this.els.hpText) console.warn("UI elements missing");

        this.choiceCallback = null;
        this.combatCallback = null;

        this.initListeners();

        // Subscribe to narrator
        narrator.subscribe(msg => this.appendLog(msg));

        // Subscribe to GameState changes for real-time UI updates
        gameState.subscribe(() => {
            this.updatePlayerStats();
            // Refresh Shop if active to update Sell list
            if (this.currentView === 'shop' && this.currentNode) {
                this.showShop(this.currentNode);
            }
        });

        this.currentView = null;
        this.currentNode = null;
    }

    initListeners() {
        // ... existing listeners ...
        this.els.inventoryBtn.onclick = () => this.openInventory();
        this.els.closeInventory.onclick = () => this.els.inventoryModal.classList.add('hidden');
    }

    updatePlayerStats() {
        const stats = gameState.totalStats;
        const current = gameState.player.stats;

        // HP Bar
        const hpPercent = Math.max(0, Math.min(100, (current.currentHp / stats.maxHp) * 100));
        this.els.hpFill.style.width = `${hpPercent}%`;
        this.els.hpText.textContent = `HP ${current.currentHp}/${stats.maxHp}`;

        // XP Bar
        const xpThreshold = current.level * 100;
        const xpPercent = Math.max(0, Math.min(100, (current.xp / xpThreshold) * 100));
        this.els.xpFill.style.width = `${xpPercent}%`;
        this.els.xpText.textContent = `XP ${current.xp}/${xpThreshold}`;

        // Other Stats
        this.els.lives.textContent = `Lives: ${current.lives}/${CONSTANTS.MAX_LIVES}`;
        this.els.gold.textContent = `Gold: ${current.gold}`;
        this.els.level.textContent = `LVL ${current.level}`;
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

    updateImage(node) {
        if (node.image) {
            // Check if user provided or generated (some have timestamp, some don't)
            // Just use the value directly since we mapped them exactly in story.js
            let src = `src/assets/images/${node.image}`;
            if (!node.image.endsWith('.png') && !node.image.endsWith('.jpg')) {
                src += '.png';
            }
            // Use innerHTML but include the overlay container
            this.els.imageArea.innerHTML = `
                <img src="${src}" class="location-banner" alt="Location Image">
                <div id="combat-status" class="combat-overlay" style="display: none;"></div>
            `;
        } else {
            // Default or Clear
            this.els.imageArea.innerHTML = `<div class="placeholder-art">The Last Road of Iron</div>`;
        }
    }

    // View States
    showStory(node) {
        this.currentView = 'story';
        this.currentNode = node;
        this.updateImage(node);
        // Hide combat overlay when returning to story
        const overlay = document.getElementById('combat-status');
        if (overlay) {
            overlay.style.display = 'none';
        }
        // Just render choices normally
        this.renderChoices(node.choices, (c) => this.choiceCallback(c));
    }

    showCombat(enemy) {
        this.currentView = 'combat';
        this.currentNode = null;
        // Keep previous image (likely the location where combat started)
        // Or we could have specific combat backgrounds later

        // Ensure overlay exists (in case we didn't come from a node with an image)
        let overlay = document.getElementById('combat-status');
        if (!overlay) {
            // Fallback if no image loaded
            this.els.imageArea.innerHTML += `<div id="combat-status" class="combat-overlay"></div>`;
        }

        this.updateCombatStats(enemy);

        // Render Combat Actions
        this.clearChoices();

        // Attack
        const attackBtn = document.createElement('button');
        attackBtn.className = 'choice-btn';
        attackBtn.textContent = `Attack ${enemy.name}`;
        attackBtn.onclick = () => this.combatCallback('attack');
        this.els.choices.appendChild(attackBtn);

        // Defend
        const defendBtn = document.createElement('button');
        defendBtn.className = 'choice-btn';
        defendBtn.textContent = "Defend";
        defendBtn.onclick = () => this.combatCallback('defend');
        this.els.choices.appendChild(defendBtn);

        // Item - Only show if inventory has CONSUMABLE items
        const hasConsumables = gameState.player.inventory.some(i => i.type === 'consumable');
        if (hasConsumables) {
            const itemBtn = document.createElement('button');
            itemBtn.className = 'choice-btn';
            itemBtn.textContent = "Use Item";
            itemBtn.onclick = () => this.combatCallback('item');
            this.els.choices.appendChild(itemBtn);
        }
    }

    updateCombatStats(enemy) {
        let overlay = document.getElementById('combat-status');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.textContent = `${enemy.name}: ${enemy.currentHp} / ${enemy.baseStats.hp} HP`;
        }
    }

    showTavern(node) {
        this.currentView = 'tavern';
        this.currentNode = node;
        this.updateImage(node);

        // Tavern Actions: Rest options
        const tavernChoices = [
            { text: "Visit Merchant", action: () => this.showShop(node) },
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
        this.currentView = 'shop';
        this.currentNode = node;
        // Override with specific merchant image
        this.updateImage({ image: 'merchant' });

        this.clearChoices();

        // Shop Header
        const header = document.createElement('h3');
        header.textContent = "Merchant's Wares";
        header.style.color = 'var(--c-accent)';
        this.els.choices.appendChild(header);

        // Buy Section
        // Buy Section
        const buyLabel = document.createElement('div');
        buyLabel.textContent = "--- Buy ---";
        buyLabel.className = 'shop-section-label';
        this.els.choices.appendChild(buyLabel);

        const currentTier = gameState.progress.storyTier;

        // Gather all purchasable items
        const allItems = [
            ...gameState.getAllItems().weapons,
            ...gameState.getAllItems().helmets,
            ...gameState.getAllItems().armor,
            ...gameState.getAllItems().accessories,
            ...gameState.getAllItems().consumables // Don't forget potions!
        ];

        // Group by Tier
        for (let t = 1; t <= currentTier; t++) {
            const tierItems = allItems.filter(i => i.tier === t && i.price > 0);

            if (tierItems.length > 0) {
                // Tier Header
                const tierHeader = document.createElement('h4');
                tierHeader.textContent = `Tier ${t} Gear`;
                tierHeader.style.color = t === currentTier ? '#ffd700' : '#888';
                tierHeader.style.borderBottom = '1px solid #333';
                tierHeader.style.marginTop = '10px';
                this.els.choices.appendChild(tierHeader);

                tierItems.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = 'choice-btn';
                    const cost = item.price;
                    const canAfford = gameState.player.stats.gold >= cost;

                    // Show stats diff? For MVP just description
                    btn.textContent = `Buy ${item.name} (${cost}g) - ${item.desc}`;
                    btn.disabled = !canAfford;
                    if (!canAfford) btn.style.color = 'var(--c-text-dim)';
                    if (t === currentTier && canAfford) btn.style.borderColor = 'var(--c-accent)';

                    btn.onclick = () => {
                        if (gameState.spendGold(cost)) {
                            gameState.addToInventory(item);
                            narrator.story(`Bought ${item.name}. (Check Inventory to Equip!)`);
                            this.updatePlayerStats();
                            this.showShop(node); // Re-render
                        }
                    };
                    this.els.choices.appendChild(btn);
                });
            }
        }

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
        leaveBtn.textContent = "Back to Tavern";
        leaveBtn.onclick = () => this.showTavern(node);
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
        const slots = ['weapon', 'helmet', 'armor', 'accessory'];

        slots.forEach(slot => {
            const item = gameState.player.equipment[slot];
            const div = document.createElement('div');
            div.className = 'item-slot equipped';

            const slotName = document.createElement('strong');
            slotName.style.color = '#888';
            slotName.textContent = slot.toUpperCase();

            const itemName = document.createElement('span');
            itemName.style.color = item ? '#ffd700' : '#555';
            itemName.textContent = item ? item.name : 'Empty';

            div.appendChild(slotName);
            div.appendChild(itemName);
            this.els.equipmentSlots.appendChild(div);
        });

        // Bag
        this.els.inventoryList.innerHTML = '<h3>Backpack</h3>';
        if (gameState.player.inventory.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = "Your bag is empty.";
            emptyMsg.style.color = '#666';
            emptyMsg.style.fontStyle = 'italic';
            this.els.inventoryList.appendChild(emptyMsg);
        } else {
            gameState.player.inventory.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn inventory-item';

                // Format stats nicely
                const statsStr = Object.entries(item.stats)
                    .map(([key, val]) => `${key.toUpperCase()}: +${val}`)
                    .join(', ');

                btn.innerHTML = `<span style="color: #ddd; font-weight: bold;">${item.name}</span> <span style="font-size: 0.8em; color: #888;">${statsStr}</span>`;

                btn.onclick = () => {
                    // If it's a consumable, USE it. If gear, EQUIP it.
                    if (item.type === 'consumable') {
                        // Implement consume logic or just ignore for now if not ready
                        narrator.story(`Used ${item.name}.`); // Placeholder
                        // actually remove/heal would happen in gameState
                        // For now, let's just assume equip for gear:
                    } else {
                        gameState.equipItem(item);
                        this.renderInventory();
                        this.updatePlayerStats();
                    }
                };
                this.els.inventoryList.appendChild(btn);
            });
        }
    }
}
