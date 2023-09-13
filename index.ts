type Callback = (...args: any[]) => any;

class Emitter {
    private events: Map<string, Set<Callback>>;

    constructor() {
        this.events = new Map();
    }

    subscribe(name: string, callback: Callback): () => void {
        if (!this.events.has(name)) {
            this.events.set(name, new Set());
        }

        const callbacks = this.events.get(name) as Set<Callback>;
        callbacks.add(callback);

        const unsubscribe = () => {
            callbacks.delete(callback);
        };

        return unsubscribe;
    }

    emit(name: string, ...args: any[]): any[] {
        if (!this.events.has(name)) {
            return [];
        }

        const callbacks = this.events.get(name) as Set<Callback>;
        const results: any[] = [];

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
