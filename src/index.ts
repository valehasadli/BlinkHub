type Callback<T extends any[]> = (...args: T) => void;

class Emitter<T extends Record<string, Callback<any[]>>> {
    private events: Partial<Record<keyof T, Set<Callback<any[]>>>> = {};

    subscribe<K extends keyof T>(name: K, callback: T[K]): () => void {
        if (!this.events[name]) {
            this.events[name] = new Set();
        }

        this.events[name]!.add(callback);

        return () => {
            this.events[name]?.delete(callback);
        };
    }

    unsubscribeAll<K extends keyof T>(name: K): void {
        this.events[name]?.clear();
    }

    hasSubscribers<K extends keyof T>(name: K): boolean {
        const subscribers = this.events[name];
        return Boolean(subscribers && subscribers.size);
    }

    private isAnError(value: unknown): value is Error {
        return value instanceof Error;
    }

    emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[] {
        if (!this.events[name]) {
            return [];
        }

        const callbacks = this.events[name]!;
        const results: (ReturnType<T[K]> | Error)[] = [];

        for (const callback of callbacks) {
            const potentialResult = callback(...args);
            if (this.isAnError(potentialResult)) {
                console.error(`Error in callback for event '${name.toString()}'`, potentialResult);
                results.push(potentialResult);
            } else {
                results.push(potentialResult as ReturnType<T[K]>);
            }
        }

        return results;
    }
}

export default Emitter;
