import { CONSTANTS } from './constants.js';

export const ITEMS = {
    // Weapons (7 tiers)
    weapons: [
        { id: 'sword_t0', name: 'Worn Blade', type: 'gear', slot: 'weapon', tier: 0, stats: { attack: 2 }, price: 0, desc: "A chipped blade that has seen better days." },
        { id: 'sword_t1', name: 'Rusted Iron Sword', type: 'gear', slot: 'weapon', tier: 1, stats: { attack: 5 }, price: 50, desc: "Heavy, but sharp enough for bandits." },
        { id: 'sword_t2', name: 'Polished Iron Sword', type: 'gear', slot: 'weapon', tier: 2, stats: { attack: 12 }, price: 150, desc: "Standard issue for mercenaries." },
        { id: 'sword_t3', name: 'Forged Steel Sword', type: 'gear', slot: 'weapon', tier: 3, stats: { attack: 22 }, price: 400, desc: "A reliable weapon of war." },
        { id: 'sword_t4', name: 'Knight\'s Longsword', type: 'gear', slot: 'weapon', tier: 4, stats: { attack: 35 }, price: 1000, desc: "Carried by the elite guards of the capital." },
        { id: 'sword_t5', name: 'Royal Claymore', type: 'gear', slot: 'weapon', tier: 5, stats: { attack: 55 }, price: 2500, desc: "A massive blade for a master swordsman." },
        { id: 'sword_t6', name: 'The King\'s Oath', type: 'gear', slot: 'weapon', tier: 6, stats: { attack: 80 }, price: 9999, desc: "The legendary blade of the Champion." }
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
export function getItem(id) {
    const all = [
        ...ITEMS.weapons,
        ...ITEMS.helmets,
        ...ITEMS.armor,
        ...ITEMS.accessories
    ];
    return all.find(i => i.id === id);
}
