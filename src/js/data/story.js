export const STORY = {
    // ACT 1
    'act1_start': {
        text: "The stones beneath your boots are cracked and overgrown. The road ahead disappears into fog and silence.\n\nYou are a swordsman without a banner, traveling the Last Road of Iron. The king has promised sanctuary to any who reach the gates.",
        image: 'act1_road_1766550570054',
        choices: [
            { text: "Enter the village tavern", target: 'act1_tavern', type: 'story' },
            { text: "Continue down the road", target: 'act1_road_encounter', type: 'story' },
            { text: "Inspect abandoned cart", target: 'act1_cart_loot', type: 'story' }
        ]
    },
    'act1_cart_loot': {
        text: "The cart is rotten, but a crate remains intact. Inside, you find some loose coins and a slightly better grip for your sword.",
        rewards: { gold: 20 },
        image: 'act1_road_1766550570054', // Reusing road image
        choices: [
            { text: "Return to the road", target: 'act1_road_encounter', type: 'story' }
        ]
    },
    'act1_tavern': {
        text: "The 'Rusty Tankard' is quiet. A few weary travelers look up as you enter. This is a safe place to rest and trade before the danger ahead.",
        type: 'tavern', // Special UI state
        image: 'act1_tavern_1766550591824',
        nextInfo: "When you are ready, the road awaits.",
        choices: [
            { text: "Leave the Tavern", target: 'act1_road_encounter', type: 'story' }
        ]
    },
    'act1_road_encounter': {
        text: "A figure blocks the path. A bandit, sword drawn, grinning through missing teeth.",
        image: 'act1_road_1766550570054',
        choices: [
            { text: "Fight the Bandit", target: 'act1_victory', type: 'combat', enemyId: 'bandit' },
            { text: "Retreat to Tavern", target: 'act1_tavern', type: 'story' }
        ]
    },
    'act1_victory': {
        text: "The bandit falls. The road is clear for now, but the fog thickens as you climb higher.",
        image: 'act1_road_1766550570054',
        // Rewards handled by combat drop
        choices: [
            { text: "Advance to Act 2", target: 'act2_start', type: 'story', action: 'advance_tier' },
            { text: "Roam the road (Find more enemies)", target: 'act1_road_encounter', type: 'story' }
        ]
    },

    // ACT 2
    'act2_start': {
        text: "ACT 2 — THE MERCENARY PATH\n\nA forest pass lies ahead. Steel glints between the trees. Someone else has claimed this road.",
        image: 'act2_mercenary_path_1766550609997',
        choices: [
            { text: "Challenge the mercenaries", target: 'act2_combat', type: 'combat', enemyId: 'mercenary' },
            { text: "Return to the village (Backtrack)", target: 'act1_tavern', type: 'story' }
        ]
    },
    'act2_combat': {
        text: "The mercenary was skilled, but you were better. The path opens up.",
        image: 'act2_mercenary_path_1766550609997',
        choices: [
            { text: "Press onward", target: 'act3_start', type: 'story', action: 'advance_tier' },
            { text: "Roam the forest (Find more enemies)", target: 'act2_start', type: 'story' }
        ]
    },

    // ACT 3
    'act3_start': {
        text: "ACT 3 — THE KNIGHT’S FALL\n\nRuins of a royal outpost. Banners rot on broken walls. The King's men once held this ground, now only the fallen remain.",
        image: 'act3_ruins_1766550651471',
        choices: [
            { text: "Search the outpost", target: 'act3_combat', type: 'combat', enemyId: 'fallen_knight' },
            { text: "Find a spot to rest (Campfire)", target: 'act3_rest', type: 'story' }
        ]
    },
    'act3_rest': {
        text: "You find a defensible corner to rest. It's not a tavern, but it will suffice.",
        type: 'tavern', // Reusing tavern logic for campfire rest
        image: 'act3_campfire_1766550679214',
        choices: [
            { text: "Face the Fallen Knight", target: 'act3_combat', type: 'combat', enemyId: 'fallen_knight' }
        ]
    },
    'act3_combat': {
        text: "The knight's armor was rusted, but his blade was sharp. You find a journal on his corpse: 'The Capital... they locked us out.'",
        image: 'act3_ruins_1766550651471',
        choices: [
            { text: "Advance to the Bridge", target: 'act4_start', type: 'story', action: 'advance_tier' },
            { text: "Roam the ruins (Find more enemies)", target: 'act3_start', type: 'story' }
        ]
    },

    // ACT 4
    'act4_start': {
        text: "ACT 4 — THE IRON CROSSING\n\nA massive fortified bridge spans the chasm. Elite guards block the way. Retreat is not an option.",
        image: 'act4_bridge',
        choices: [
            { text: "Charge the bridge", target: 'act4_combat', type: 'combat', enemyId: 'elite_guard' },
            { text: "Prepare (Tavern)", target: 'act4_tavern', type: 'story' }
        ]
    },
    'act4_tavern': {
        text: "A smuggler's hideout under the bridge serves as a resting spot.",
        type: 'tavern',
        image: 'act4_hideout',
        choices: [
            { text: "Attack the Bridge", target: 'act4_combat', type: 'combat', enemyId: 'elite_guard' }
        ]
    },
    'act4_combat': {
        text: "The Elite Guard is defeated. The way to the final stretch is open.",
        image: 'act4_bridge',
        choices: [
            { text: "Climb to the High Road", target: 'act5_start', type: 'story', action: 'advance_tier' },
            { text: "Roam the bridge (Find more enemies)", target: 'act4_start', type: 'story' }
        ]
    },

    // ACT 5
    'act5_start': {
        text: "ACT 5 — THE LAST INN\n\nThe final tavern before the capital. The fire is warm, but the patrons are silent. No one here plans to go further.",
        type: 'tavern', // Force tavern entry
        image: 'act5_inn',
        choices: [
            { text: "Approach the Capital Gates", target: 'act6_start', type: 'story', action: 'advance_tier' }
        ]
    },

    // ACT 6
    'act6_start': {
        text: "ACT 6 — THE GATE OF VALENHOLD\n\nThe gates stand closed. A lone figure waits, sword planted in stone. The King's Champion.",
        image: 'act5_capital_gates', // Used for Act 5/6 transition
        choices: [
            { text: "Challenge the Champion", target: 'act6_boss', type: 'combat', enemyId: 'kings_champion' }
        ]
    },
    'act6_boss': {
        text: "The Champion falls to his knees. 'Strong...' he whispers. 'The kingdom... needs strength.'",
        image: 'act6_boss_champion',
        // Reward from boss drop
        choices: [
            { text: "Enter the Capital (Victory)", target: 'victory_screen', type: 'story' }]
    },
    'victory_screen': {
        text: "The gates open with a heavy groan. You step into Valenhold.\n\nYou do not cheer. You have seen what it cost to get here.\n\nCONGRATULATIONS. YOU HAVE CLEARED THE LAST ROAD OF IRON.",
        image: 'act6_gate_final',
        choices: [
            { text: "Play Again", target: 'act1_start', type: 'story', action: 'reset_game' }
        ]
    },
    'game_over': {
        text: "You have fallen. The road claims another name.\n\nGAME OVER.",
        image: 'act1_road_1766550570054', // Fallback to foggy road
        choices: [
            { text: "Try Again", target: 'act1_start', type: 'story', action: 'reset_game' }
        ]
    }
};
