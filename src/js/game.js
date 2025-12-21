console.log("GAME.JS STARTING");
window.gameLoaded = true;

// Bundle Start
// File: src/js/data/constants.js
const CONSTANTS = {
    MAX_LIVES: 3,
    MAX_ACTS: 6,

    SLOTS: {
        WEAPON: 'weapon',
        HELMET: 'helmet',
        ARMOR: 'armor',
        GLOVES: 'gloves',
        SHIELD: 'shield',
        BOOTS: 'boots',
        ACCESSORY: 'accessory'
    },

    ITEM_TYPES: {
        GEAR: 'gear',
        CONSUMABLE: 'consumable' // Maybe not needed for MVP but good to have
    },

    // Multipliers for enemies per tier
    SCALING: {
        HP_MULT: 1.5,
        ATK_MULT: 1.2,
        DEF_MULT: 1.1,
        GOLD_MULT: 1.5
    },

    SELL_RATIO: 0.5
};
// File: src/js/data/items.js


const ITEMS = {
    // Weapons (7 tiers)
    weapons: [
        { id: 'sword_t0', name: 'Worn Blade', type: 'gear', slot: 'weapon', tier: 0, stats: { attack: 5 }, price: 0, desc: "A chipped blade that has seen better days." },
        { id: 'sword_t1', name: 'Rusted Iron Sword', type: 'gear', slot: 'weapon', tier: 1, stats: { attack: 10 }, price: 50, desc: "Heavy, but sharp enough for bandits." },
        { id: 'sword_t2', name: 'Polished Iron Sword', type: 'gear', slot: 'weapon', tier: 2, stats: { attack: 20 }, price: 150, desc: "Standard issue for mercenaries." },
        { id: 'sword_t3', name: 'Forged Steel Sword', type: 'gear', slot: 'weapon', tier: 3, stats: { attack: 35 }, price: 400, desc: "A reliable weapon of war." },
        { id: 'sword_t4', name: 'Knight\'s Longsword', type: 'gear', slot: 'weapon', tier: 4, stats: { attack: 55 }, price: 1000, desc: "Carried by the elite guards of the capital." },
        { id: 'sword_t5', name: 'Royal Claymore', type: 'gear', slot: 'weapon', tier: 5, stats: { attack: 80 }, price: 2500, desc: "A massive blade for a master swordsman." },
        { id: 'sword_t6', name: 'The King\'s Oath', type: 'gear', slot: 'weapon', tier: 6, stats: { attack: 120 }, price: 9999, desc: "The legendary blade of the Champion." }
    ],

    // Helmets
    helmets: [
        { id: 'helm_t1', name: 'Leather Cap', type: 'gear', slot: 'helmet', tier: 1, stats: { defense: 1, hp: 5 }, price: 30, desc: "Better than nothing." },
        { id: 'helm_t2', name: 'Iron Pot Helm', type: 'gear', slot: 'helmet', tier: 2, stats: { defense: 3, hp: 10 }, price: 100, desc: "Rings loudly when hit." },
        { id: 'helm_t3', name: 'Steel Visor', type: 'gear', slot: 'helmet', tier: 3, stats: { defense: 6, hp: 25 }, price: 300, desc: "Offers real protection." },
        { id: 'helm_t4', name: 'Full Helm', type: 'gear', slot: 'helmet', tier: 4, stats: { defense: 10, hp: 50 }, price: 800, desc: "Intimidating and sturdy." },
        { id: 'helm_t5', name: 'Royal Crown-Helm', type: 'gear', slot: 'helmet', tier: 5, stats: { defense: 15, hp: 100 }, price: 2000, desc: "Gilded steel." }
    ],

    // Armor
    armor: [
        { id: 'armor_t1', name: 'Tattered Tunic', type: 'gear', slot: 'armor', tier: 1, stats: { defense: 2, hp: 10 }, price: 40, desc: "Stained with road dust." },
        { id: 'armor_t2', name: 'Leather Jerkin', type: 'gear', slot: 'armor', tier: 2, stats: { defense: 5, hp: 20 }, price: 120, desc: "Stiff boiled leather." },
        { id: 'armor_t3', name: 'Chainmail Hauberk', type: 'gear', slot: 'armor', tier: 3, stats: { defense: 12, hp: 50 }, price: 500, desc: "Heavy, but stops a slash." },
        { id: 'armor_t4', name: 'Plate Mail', type: 'gear', slot: 'armor', tier: 4, stats: { defense: 20, hp: 100 }, price: 1200, desc: "Polished steel plates." },
        { id: 'armor_t5', name: 'Royal Guard Armor', type: 'gear', slot: 'armor', tier: 5, stats: { defense: 35, hp: 200 }, price: 3000, desc: "Masterwork craftsmanship." }
    ],

    // Accessories (Simple HP boosters)
    accessories: [
        { id: 'acc_t1', name: 'Iron Locket', type: 'gear', slot: 'accessory', tier: 1, stats: { hp: 20 }, price: 200, desc: "Contains a faded portrait." },
        { id: 'acc_t2', name: 'Warrior\'s Ring', type: 'gear', slot: 'accessory', tier: 3, stats: { attack: 5, hp: 50 }, price: 1000, desc: "A sign of veteran status." }
    ]

    // Simplified for MVP: Can add Boots/Gloves/Shields similarly if needed, but this covers core stat progression.
    // I shall add one of each for variety later if time permits, but this is a solid base.
};

// Helper to find item by ID
function getItem(id) {
    const all = [
        ...ITEMS.weapons,
        ...ITEMS.helmets,
        ...ITEMS.armor,
        ...ITEMS.accessories
    ];
    return all.find(i => i.id === id);
}
// File: src/js/data/enemies.js
const ENEMIES = {
    // Act 1
    // Act 1
    bandit: {
        id: 'bandit',
        name: 'Roadside Bandit',
        tier: 1,
        baseStats: { hp: 30, attack: 4, defense: 0, gold: 50, xp: 25 }, // 4 kills to level
        drops: ['sword_t1', 'armor_t1']
    },
    // Act 2
    mercenary: {
        id: 'mercenary',
        name: 'Hired Mercenary',
        tier: 2,
        baseStats: { hp: 80, attack: 10, defense: 3, gold: 150, xp: 60 },
        drops: ['sword_t2', 'helm_t2']
    },
    // Act 3
    fallen_knight: {
        id: 'fallen_knight',
        name: 'Fallen Knight',
        tier: 3,
        baseStats: { hp: 150, attack: 18, defense: 8, gold: 400, xp: 150 },
        drops: ['sword_t3', 'armor_t3']
    },
    // Act 4
    elite_guard: {
        id: 'elite_guard',
        name: 'Elite Guard',
        tier: 4,
        baseStats: { hp: 300, attack: 30, defense: 15, gold: 800, xp: 300 },
        drops: ['sword_t4', 'helm_t4']
    },
    // Act 5 (Mini-boss feel)
    royal_sentry: {
        id: 'royal_sentry',
        name: 'Royal Sentry',
        tier: 5,
        baseStats: { hp: 400, attack: 35, defense: 18, gold: 1500, xp: 800 },
        drops: ['sword_t5', 'armor_t5']
    },
    // Act 6 Final Boss
    kings_champion: {
        id: 'kings_champion',
        name: 'The King\'s Champion',
        level: 99, // Narrative level
        tier: 6,
        isBoss: true,
        baseStats: { hp: 1500, attack: 70, defense: 40, gold: 5000, xp: 5000 },
        drops: ['sword_t6']
    }
};
// File: src/js/data/story.js
const STORY = {
    // ACT 1
    'act1_start': {
        text: "The stones beneath your boots are cracked and overgrown. The road ahead disappears into fog and silence.\n\nYou are a swordsman without a banner, traveling the Last Road of Iron. The king has promised sanctuary to any who reach the gates.",
        choices: [
            { text: "Enter the village tavern", target: 'act1_tavern', type: 'story' },
            { text: "Continue down the road", target: 'act1_road_encounter', type: 'story' },
            { text: "Inspect abandoned cart", target: 'act1_cart_loot', type: 'story' }
        ]
    },
    'act1_cart_loot': {
        text: "The cart is rotten, but a crate remains intact. Inside, you find some loose coins and a slightly better grip for your sword.",
        rewards: { gold: 20 },
        choices: [
            { text: "Return to the road", target: 'act1_road_encounter', type: 'story' }
        ]
    },
    'act1_tavern': {
        text: "The 'Rusty Tankard' is quiet. A few weary travelers look up as you enter. This is a safe place to rest and trade before the danger ahead.",
        type: 'tavern', // Special UI state
        nextInfo: "When you are ready, the road awaits.",
        choices: [
            { text: "Leave the Tavern", target: 'act1_road_encounter', type: 'story' }
        ]
    },
    'act1_road_encounter': {
        text: "A figure blocks the path. A bandit, sword drawn, grinning through missing teeth.",
        choices: [
            { text: "Fight the Bandit", target: 'act1_victory', type: 'combat', enemyId: 'bandit' }
        ]
    },
    'act1_victory': {
        text: "The bandit falls. The road is clear for now, but the fog thickens as you climb higher.",
        // Rewards handled by combat drop
        choices: [
            { text: "Advance to Act 2", target: 'act2_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 2
    'act2_start': {
        text: "ACT 2 — THE MERCENARY PATH\n\nA forest pass lies ahead. Steel glints between the trees. Someone else has claimed this road.",
        choices: [
            { text: "Challenge the mercenaries", target: 'act2_combat', type: 'combat', enemyId: 'mercenary' },
            { text: "Return to the village (Backtrack)", target: 'act1_tavern', type: 'story' }
        ]
    },
    'act2_combat': {
        text: "The mercenary was skilled, but you were better. The path opens up.",
        choices: [
            { text: "Press onward", target: 'act3_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 3
    'act3_start': {
        text: "ACT 3 — THE KNIGHT’S FALL\n\nRuins of a royal outpost. Banners rot on broken walls. The King's men once held this ground, now only the fallen remain.",
        choices: [
            { text: "Search the outpost", target: 'act3_combat', type: 'combat', enemyId: 'fallen_knight' },
            { text: "Find a spot to rest (Campfire)", target: 'act3_rest', type: 'story' }
        ]
    },
    'act3_rest': {
        text: "You find a defensible corner to rest. It's not a tavern, but it will suffice.",
        type: 'tavern', // Reusing tavern logic for campfire rest
        choices: [
            { text: "Face the Fallen Knight", target: 'act3_combat', type: 'combat', enemyId: 'fallen_knight' }
        ]
    },
    'act3_combat': {
        text: "The knight's armor was rusted, but his blade was sharp. You find a journal on his corpse: 'The Capital... they locked us out.'",
        choices: [
            { text: "Advance to the Bridge", target: 'act4_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 4
    'act4_start': {
        text: "ACT 4 — THE IRON CROSSING\n\nA massive fortified bridge spans the chasm. Elite guards block the way. Retreat is not an option.",
        choices: [
            { text: "Charge the bridge", target: 'act4_combat', type: 'combat', enemyId: 'elite_guard' },
            { text: "Prepare (Tavern)", target: 'act4_tavern', type: 'story' }
        ]
    },
    'act4_tavern': {
        text: "A smuggler's hideout under the bridge serves as a resting spot.",
        type: 'tavern',
        choices: [
            { text: "Attack the Bridge", target: 'act4_combat', type: 'combat', enemyId: 'elite_guard' }
        ]
    },
    'act4_combat': {
        text: "The Elite Guard is defeated. The way to the final stretch is open.",
        choices: [
            { text: "Climb to the High Road", target: 'act5_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 5
    'act5_start': {
        text: "ACT 5 — THE LAST INN\n\nThe final tavern before the capital. The fire is warm, but the patrons are silent. No one here plans to go further.",
        type: 'tavern', // Force tavern entry
        choices: [
            { text: "Approach the Capital Gates", target: 'act6_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 6
    'act6_start': {
        text: "ACT 6 — THE GATE OF VALENHOLD\n\nThe gates stand closed. A lone figure waits, sword planted in stone. The King's Champion.",
        choices: [
            { text: "Challenge the Champion", target: 'act6_boss', type: 'combat', enemyId: 'kings_champion' }
        ]
    },
    'act6_boss': {
        text: "The Champion falls to his knees. 'Strong...' he whispers. 'The kingdom... needs strength.'",
        // Reward from boss drop
        choices: [
            { text: "Enter the Capital (Victory)", target: 'victory_screen', type: 'story' }]
    },
    'victory_screen': {
        text: "The gates open with a heavy groan. You step into Valenhold.\n\nYou do not cheer. You have seen what it cost to get here.\n\nCONGRATULATIONS. YOU HAVE CLEARED THE LAST ROAD OF IRON.",
        choices: [
            { text: "Play Again", target: 'act1_start', type: 'story', action: 'reset_game' }
        ]
    },
    'game_over': {
        text: "You have fallen. The road claims another name.\n\nGAME OVER.",
        choices: [
            { text: "Try Again", target: 'act1_start', type: 'story', action: 'reset_game' }
        ]
    }
};
// File: src/js/ui/narration.js
// Simple Event Bus for Narration
class NarrationManager {
    constructor() {
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    log(text, type = 'normal') {
        this.listeners.forEach(cb => cb({ text, type }));
    }

    // Shortcuts
    combat(text) { this.log(text, 'combat'); }
    loot(text) { this.log(text, 'loot'); }
    story(text) { this.log(text, 'story'); }
}

const narrator = new NarrationManager();
// File: src/js/engine/gameState.js



class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.player = {
            stats: {
                currentHp: 100,
                maxHp: 100,
                baseAttack: 5,
                baseDefense: 1,
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
    }

    takeDamage(amount) {
        this.player.stats.currentHp = Math.max(0, this.player.stats.currentHp - amount);
    }

    loseLife() {
        if (this.player.stats.lives > 0) {
            this.player.stats.lives--;
        }
        return this.player.stats.lives > 0;
    }

    recoverLife() {
        if (this.player.stats.lives < CONSTANTS.MAX_LIVES) {
            this.player.stats.lives++;
            return true;
        }
        return false;
    }

    addGold(amount) {
        this.player.stats.gold += amount;
    }

    spendGold(amount) {
        if (this.player.stats.gold >= amount) {
            this.player.stats.gold -= amount;
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
    }

    addToInventory(item) {
        this.player.inventory.push(item);
    }

    removeFromInventory(item) {
        const idx = this.player.inventory.indexOf(item);
        if (idx > -1) {
            this.player.inventory.splice(idx, 1);
        }
    }

    // Progression
    gainXp(amount) {
        this.player.stats.xp += amount;
        const req = this.xpToNextLevel;
        if (this.player.stats.xp >= req) {
            this.levelUp();
            return true;
        }
        return false;
    }

    get xpToNextLevel() {
        return this.player.stats.level * 100;
    }

    levelUp() {
        this.player.stats.xp -= this.xpToNextLevel;
        this.player.stats.level++;
        this.player.stats.maxHp += 10;
        this.player.stats.currentHp = this.player.stats.maxHp; // Full heal

        // Stat Choice handled by UI? Or logic here?
        // Let's rely on UI to prompt user, but for now we auto-increment?
        // User asked for "Choice: +1 Attack OR +1 Defense (Modal Prompt)"
        // We'll emit an event or set a flag.
        // Simple MVP: Just alert for now, or assume UI handles it?
        // We'll set a 'pendingLevelUp' flag or similar if we want to defer.
        // BUT better: call UI modal directly if possible? No, GameState shouldn't know UI.
        // We can publish an event if we had an event bus.
        // Hack: alert for MVP?
        // Better: Return true from gainXp if leveled up?
        // Let's assume the caller of gainXp (CombatManager) handles the UI prompt.
    }

    // Persistence
    save() {
        const data = JSON.stringify({
            player: this.player,
            progress: this.progress
        });
        localStorage.setItem('iron_rpg_save', data);
        console.log("Game Saved.");
    }

    load() {
        const data = localStorage.getItem('iron_rpg_save');
        if (data) {
            const parsed = JSON.parse(data);
            this.player = parsed.player;
            this.progress = parsed.progress;
            return true;
        }
        return false;
    }

    getAllItems() {
        return ITEMS;
    }
}

const gameState = new GameState();
// File: src/js/ui/uiManager.js





class UIManager {
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

        // Attack
        const btnAttack = document.createElement('button');
        btnAttack.className = 'choice-btn';
        btnAttack.textContent = `Attack ${enemy.name}`;
        btnAttack.onclick = () => this.combatCallback('attack');
        this.els.choices.appendChild(btnAttack);

        // Defend
        const btnDefend = document.createElement('button');
        btnDefend.className = 'choice-btn';
        btnDefend.textContent = `Defend (50% Dmg Red.)`;
        btnDefend.onclick = () => this.combatCallback('defend');
        this.els.choices.appendChild(btnDefend);

        // Item
        const btnItem = document.createElement('button');
        btnItem.className = 'choice-btn';
        btnItem.textContent = `Use Item`;
        btnItem.onclick = () => this.combatCallback('item');
        this.els.choices.appendChild(btnItem);
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
            { text: "Visit Merchant", action: () => this.showShop(node) },
            { text: "Patrol the Roads (Combat)", type: 'patrol' },
            { text: "Common Room (10g, +30% HP)", action: () => this.rest(10, 0.3) },
            { text: "Private Room (50g, +60% HP)", action: () => this.rest(50, 0.6) },
            { text: "Luxury Suite (100g, Full HP + Life)", action: () => this.rest(100, 1.0, true) }
        ];

        // Combine with node exit choices
        const combined = [
            ...tavernChoices.map(tc => ({
                text: tc.text,
                type: tc.type || 'custom',
                target: null,
                customAction: tc.action
            })),
            ...node.choices.map(c => ({ ...c, type: 'story' }))
        ];

        this.renderChoices(combined, (choice) => {
            if (choice.type === 'custom') {
                choice.customAction();
                // If the action was rest, we update stats. 
                // If it was showShop, showShop handles the view.
                if (choice.text.includes("Room")) this.updatePlayerStats();
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

        // Navigation Buttons

        // 1. Back to Tavern (if we are in a tavern node)
        if (node.type === 'tavern') {
            const backBtn = document.createElement('button');
            backBtn.className = 'choice-btn';
            backBtn.textContent = "Back to Tavern Menu";
            backBtn.style.marginTop = '1rem';
            backBtn.onclick = () => this.showTavern(node);
            this.els.choices.appendChild(backBtn);
        }

        // 2. Leave Shop (Exit Node)
        const leaveBtn = document.createElement('button');
        leaveBtn.className = 'choice-btn';
        leaveBtn.style.marginTop = '0.5rem';
        leaveBtn.style.border = '1px solid var(--c-accent)';
        leaveBtn.textContent = "Leave to Road";
        // Find the 'story' choice from the node to leave
        const exitChoice = node.choices.find(c => c.type === 'story');
        if (exitChoice) {
            leaveBtn.onclick = () => this.choiceCallback(exitChoice);
        } else {
            leaveBtn.style.display = 'none'; // Should not happen
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
// File: src/js/engine/storyManager.js





class StoryManager {
    constructor(uiManager, combatManager) {
        this.ui = uiManager;
        this.combatManager = combatManager; // Circular dep handling: pass in or use event bus. 
        // Better: Main.js orchestrates. But for MVP, passing instance is fine.
    }

    start() {
        if (localStorage.getItem('iron_rpg_save')) {
            this.showMainMenu();
        } else {
            this.transitionTo('act1_start');
        }
    }

    showMainMenu() {
        this.ui.clearChoices();
        narrator.story("THE LAST ROAD OF IRON");

        // Continue
        const btnContinue = document.createElement('button');
        btnContinue.className = 'choice-btn';
        btnContinue.textContent = "Continue Journey";
        btnContinue.onclick = () => {
            if (gameState.load()) {
                narrator.story("Journey resumed.");
                this.transitionTo(gameState.progress.currentNodeId);
            }
        };
        this.ui.els.choices.appendChild(btnContinue);

        // New Game
        const btnNew = document.createElement('button');
        btnNew.className = 'choice-btn';
        btnNew.textContent = "New Game";
        btnNew.style.marginTop = '1rem';
        btnNew.onclick = () => {
            if (confirm("Start new game? Saved progress will be lost.")) {
                gameState.reset();
                this.transitionTo('act1_start');
            }
        };
        this.ui.els.choices.appendChild(btnNew);
    }

    transitionTo(nodeId) {
        const node = STORY[nodeId];
        if (!node) {
            console.error(`Node ${nodeId} not found`);
            return;
        }

        gameState.progress.currentNodeId = nodeId;
        gameState.save(); // Auto-save

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
        } else if (choice.type === 'patrol') {
            // Endless grinding loop
            const enemies = ['bandit', 'mercenary', 'fallen_knight', 'elite_guard', 'royal_sentry', 'royal_sentry'];
            const tier = gameState.progress.storyTier || 1;
            const enemyId = enemies[tier - 1] || 'bandit';
            this.combatManager.startCombat(enemyId, gameState.progress.currentNodeId);
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
// File: src/js/engine/combatManager.js





class CombatManager {
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
        this.isDefending = false;

        narrator.combat(`Encountered ${this.currentEnemy.name}!`);
        this.ui.showCombat(this.currentEnemy);
    }

    handleAction(action) {
        if (!this.isPlayerTurn) return;

        if (action === 'attack') {
            this.playerAttack();
        } else if (action === 'defend') {
            this.playerDefend();
        } else if (action === 'item') {
            this.playerUseItem();
        }
    }

    playerDefend() {
        this.isDefending = true;
        narrator.combat("You raise your guard.");
        this.enemyTurn();
    }

    playerUseItem() {
        // Open mini inventory? Or just use Potion if exists?
        // Let's implement full inventory select for "consumable"
        // For MVP, if we don't have consumables, checking inventory is safest.
        this.ui.showInventoryModal((item) => {
            if (item.type === 'consumable' || item.type === 'potion') { // adjust types
                // Use it
                // Need a useItem method in GameState or here.
                // Assuming GameState has robust item logic, but it mainly has stats.
                // Let's implement specific potion logic here for MVP.
                if (item.id.includes('potion')) {
                    // Heal
                    gameState.heal(50); // Hardcoded potion?
                    gameState.removeFromInventory(item);
                    narrator.combat(`Used ${item.name}.`);
                    this.ui.updatePlayerStats();
                    this.ui.els.inventoryModal.classList.add('hidden'); // Close
                    this.enemyTurn();
                } else {
                    alert("That cannot be used in combat.");
                }
            }
        });
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
            let damage = Math.max(1, enemyStats.attack - playerStats.defense);

            if (this.isDefending) {
                damage = Math.floor(damage * 0.5);
                this.isDefending = false; // Reset
            }

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
        const gold = this.currentEnemy.stats.gold || 0;
        const xp = this.currentEnemy.stats.xp || 0;
        gameState.addGold(gold);
        const leveledUp = gameState.gainXp(xp);
        narrator.loot(`Gained ${gold} Gold and ${xp} XP.`);

        this.ui.updatePlayerStats(); // Immediate update

        // Item drops
        if (this.currentEnemy.drops && this.currentEnemy.drops.length > 0) {
            // Give the first item in drops list
            this.storyManager.handleRewards({ item: this.currentEnemy.drops[0] });
        }

        if (leveledUp) {
            narrator.story("You feel stronger! (Level Up)");
            // Delay to let user see victory message, then modal
            setTimeout(() => {
                this.ui.showLevelUpModal(() => {
                    this.endCombatTransition();
                });
            }, 1000);
        } else {
            this.endCombatTransition();
        }
    }

    endCombatTransition() {
        this.currentEnemy = null;
        // Return to story
        setTimeout(() => {
            this.storyManager.transitionTo(this.victoryNodeId);
        }, 500); // Shorter delay since we already waited
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
// File: src/js/main.js





console.log("GAME.JS - Initializing Components...");
try {
    const ui = new UIManager();
    const story = new StoryManager(ui, null);
    const combat = new CombatManager(ui, story);

    // Expose for debugging/console access
    window.ui = ui;
    window.story = story;
    window.combat = combat;
    window.gameState = gameState;

    story.combatManager = combat;

    ui.choiceCallback = (choice) => story.handleChoice(choice);
    ui.combatCallback = (action) => combat.handleAction(action);

    ui.updatePlayerStats();

    console.log("Starting Story Manager...");
    story.start();
    console.log("Last Road of Iron initialized.");
} catch (e) {
    console.error("CRITICAL INIT ERROR:", e);
    // Print to DOM so we can see it in screenshot
    const c = document.getElementById('choice-container');
    if (c) c.innerHTML = `<h3 style='color:red'>ERROR: ${e.message}</h3>`;
}
