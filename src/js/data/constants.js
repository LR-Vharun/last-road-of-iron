export const CONSTANTS = {
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
