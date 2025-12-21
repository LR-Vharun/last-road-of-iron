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

export const narrator = new NarrationManager();
