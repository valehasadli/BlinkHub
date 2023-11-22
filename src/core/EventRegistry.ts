import { Listener } from "../types";
import PriorityQueue from "./PriorityQueue";

export class EventRegistry<T extends Record<string, (...args: any[]) => void>> {
	private events: Partial<Record<keyof T, PriorityQueue<T[keyof T]>>> = {};

	subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		if (!this.events[name]) {
			this.events[name] = new PriorityQueue<T[keyof T]>();
		}

		const listener: Listener<T[K]> = { callback, priority };
		this.events[name]!.enqueue(listener);

		return (): void => {
			this.events[name]?.remove(listener);
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

		const results: (ReturnType<T[K]> | Error)[] = [];
		const listeners = this.events[name]!.getListeners();

		for (const listener of listeners) {
			try {
				// Call the listener and capture any return value
				const result = listener.callback(...args);

				// If result is undefined (void), we don't push it to results
				if (result !== undefined) {
					results.push(result as ReturnType<T[K]>);
				}
			} catch (error) {
				results.push(error as Error);
			}
		}

		return results;
	}
}
