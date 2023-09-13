class Emitter {
    constructor() {
        this.events = new Map();
    }

    subscribe(name, callback) {
        if (typeof name !== 'string' || typeof callback !== 'function') {
            throw new Error('Invalid callback for subscribe');
        }

        if (!this.events.has(name)) {
            this.events.set(name, new Set());
        }

        const callbacks = this.events.get(name);
        callbacks.add(callback);

        const unsubscribe = () => {
            callbacks.delete(callback);
        };

        return unsubscribe;
    }

    emit(name, ...args) {
        if (!this.events.has(name)) {
            return [];
        }

        const callbacks = this.events.get(name);
        const results = [];

        for (let callback of callbacks) {
            try {
                results.push(callback(...args));
            } catch (error) {
                console.error(`Error in callback for event '${name}'`, error);
                results.push(null);
            }
        }

        return results;
    }
}

export default Emitter;
