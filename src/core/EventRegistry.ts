import { Listener } from "../types";

export class EventRegistry<T extends Record<string, (...args: any[]) => void>> {
	private events: Partial<Record<keyof T, Set<Listener<T[keyof T]>>>> = {};

	subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		if (!this.events[name]) {
			this.events[name] = new Set();
		}

		const listener: Listener<T[K]> = { callback, priority };

		this.events[name] = new Set([...this.events[name]!]
			.concat(listener)
			.sort((a, b) => b.priority - a.priority));

		return (): void => {
			this.events[name]?.forEach(listener => {
				if (listener.callback === callback) {
					this.events[name]?.delete(listener);
				}
			});
		};
	}

	subscribeList(eventCallbacks: { [K in keyof T]?: T[K] }): () => void {
		const unsubscribeFunctions: (() => void)[] = [];

		(Object.keys(eventCallbacks) as Array<keyof T>).forEach(eventName => {
			const callback = eventCallbacks[eventName];
			if (callback) {
				const unsubscribe = this.subscribe(eventName, callback);
				unsubscribeFunctions.push(unsubscribe);
			}
		});

		return (): void => {
			unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
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
