type Callback<T extends any[]> = (...args: T) => void;

class Emitter<T extends Record<string, Callback<any[]>>> {
    private events: Record<keyof T, Set<Callback<any[]>>> = {} as Record<keyof T, Set<Callback<any[]>>>;

    subscribe<K extends keyof T>(name: K, callback: T[K]): () => void {
        if (!this.events[name]) {
            this.events[name] = new Set();
        }

        this.events[name].add(callback);

        return () => {
            this.events[name].delete(callback);
        };
    }

    emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): ReturnType<T[K]>[] {
        if (!this.events[name]) {
            return [];
        }

        const callbacks = this.events[name];
        const results: ReturnType<T[K]>[] = [];

        for (const callback of callbacks) {
            try {
                results.push(callback(...args) as ReturnType<T[K]>);
            } catch (error) {
                console.error(`Error in callback for event '${name.toString()}'`, error);
                results.push(null as any); // you might want to be more specific about error handling here
            }
        }

        return results;
    }

}

export default Emitter;
