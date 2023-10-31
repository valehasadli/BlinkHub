import { Callback } from "./types/callback";
import { Listener } from "./types/listener";

class Emitter<T extends Record<string, Callback<any[]>>> {
    private events: Partial<Record<keyof T, Set<Listener<Callback<any[]>>>>> = {};

    subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
        if (!this.events[name]) {
            this.events[name] = new Set();
        }

        const listener: Listener<T[K]> = { callback, priority };

        this.events[name] = new Set([...this.events[name]!]
            .concat(listener)
            .sort((a, b) => b.priority - a.priority));


        return () => {
            this.events[name]?.forEach(l => {
                if (l.callback === callback) {
                    this.events[name]?.delete(l);
                }
            });
        };
    }

    once<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
        let unsubscribe: (() => void) | null = null;

        const wrappedCallback = (...args: Parameters<T[K]>): void => {
            try {
                callback(...args);
            } finally {
                if (unsubscribe) {
                    unsubscribe();
                }
            }
        };

        unsubscribe = this.subscribe(name, wrappedCallback as any, priority);

        return unsubscribe;
    }

    emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[] {
        if (!this.events[name]) {
            return [];
        }

        const listeners = this.events[name]!;
        const results: (ReturnType<T[K]> | Error)[] = [];

        for (const listener of listeners) {
            try {
                const result = listener.callback(...args);
                results.push(result as ReturnType<T[K]>);
            } catch (error) {
                results.push(error as Error);
            }
        }

        return results;
    }
}

export default Emitter;
