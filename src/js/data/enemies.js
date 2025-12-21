export const ENEMIES = {
    // Act 1
    bandit: {
        id: 'bandit',
        name: 'Roadside Bandit',
        tier: 1,
        baseStats: { hp: 30, attack: 4, defense: 0, gold: 10 },
        drops: ['sword_t1', 'armor_t1']
    },
    // Act 2
    mercenary: {
        id: 'mercenary',
        name: 'Hired Mercenary',
        tier: 2,
        baseStats: { hp: 80, attack: 10, defense: 3, gold: 30 },
        drops: ['sword_t2', 'helm_t2']
    },
    // Act 3
    fallen_knight: {
        id: 'fallen_knight',
        name: 'Fallen Knight',
        tier: 3,
        baseStats: { hp: 150, attack: 18, defense: 8, gold: 80 },
        drops: ['sword_t3', 'armor_t3']
    },
    // Act 4
    elite_guard: {
        id: 'elite_guard',
        name: 'Elite Guard',
        tier: 4,
        baseStats: { hp: 300, attack: 30, defense: 15, gold: 150 },
        drops: ['sword_t4', 'helm_t4']
    },
    // Act 5 (Mini-boss feel)
    royal_sentry: {
        id: 'royal_sentry',
        name: 'Royal Sentry',
        tier: 5,
        baseStats: { hp: 600, attack: 45, defense: 25, gold: 300 },
        drops: ['sword_t5', 'armor_t5']
    },
    // Act 6 Final Boss
    kings_champion: {
        id: 'kings_champion',
        name: 'The King\'s Champion',
        level: 99, // Narrative level
        tier: 6,
        isBoss: true,
        baseStats: { hp: 1500, attack: 70, defense: 40, gold: 1000 },
        drops: ['sword_t6']
    }
};
