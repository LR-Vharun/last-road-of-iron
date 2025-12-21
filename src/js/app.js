console.log("DEBUG: check_1 - Start");

import { CONSTANTS } from './data/constants.js';
console.log("DEBUG: check_2 - constants imported", CONSTANTS);

import { getItem, ITEMS } from './data/items.js';
console.log("DEBUG: check_3 - items imported", ITEMS);

import { gameState } from './engine/gameState.js';
console.log("DEBUG: check_4 - gameState imported", gameState);

// import { narrator } from './ui/narration.js';
// console.log("DEBUG: check_5 - narrator imported");

// import { UIManager } from './ui/uiManager.js';
// console.log("DEBUG: check_6 - UIManager imported");

document.addEventListener('DOMContentLoaded', () => {
    const log = document.getElementById('narrative-log');
    if (log) log.innerHTML += "<p style='color:lime'>DEBUG: Import Check 1-4 SUCCESS</p>";
});
