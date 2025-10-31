import { Listener } from '../types';
import PriorityQueue from './PriorityQueue';

export class EventRegistry<T extends Record<string, (...args: any[]) => void>> {
	private events: Partial<Record<keyof T, PriorityQueue<T[keyof T]>>> = {};
	private maxListeners: number = 10;
	private warningEmitted: Set<keyof T> = new Set();

	subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		if (!this.events[name]) {
			this.events[name] = new PriorityQueue<T[keyof T]>();
		}

		const listener: Listener<T[K]> = { callback, priority };
		this.events[name]!.enqueue(listener);

		// Check for potential memory leak
		this.checkMaxListeners(name);

		return (): void => {
			this.events[name]?.remove(listener);
		};
	}

	emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[] {
		if (!this.events[name]) {
			return [];
		}

		const results: (ReturnType<T[K]> | Error)[] = [];
		const listeners = this.events[name]!.getListeners();

		for (const listener of listeners) {
			try {
				const result = listener.callback(...args);

				if (result !== undefined) {
					results.push(result as ReturnType<T[K]>);
				}
			} catch (error) {
				results.push(error as Error);
			}
		}

		return results;
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

	subscribeWithDelay<K extends keyof T>(
		name: K,
		callback: T[K],
		delay: number,
		priority: number = 0
	): () => void {
		const wrappedCallback = (...args: Parameters<T[K]>): void => {
			setTimeout(() => callback(...args), delay);
		};

		return this.subscribe(name, wrappedCallback as any, priority);
	}

	/**
	 * Check if max listeners exceeded and emit warning
	 */
	private checkMaxListeners<K extends keyof T>(name: K): void {
		if (this.maxListeners === 0) return; // 0 means unlimited

		const count = this.events[name]?.size() || 0;
		if (count > this.maxListeners && !this.warningEmitted.has(name)) {
			this.warningEmitted.add(name);
			console.warn(
				`⚠️  Possible memory leak detected. ${count} listeners added for event "${String(name)}". ` +
				`Use setMaxListeners() to increase limit. Current limit: ${this.maxListeners}`
			);
		}
	}

	/**
	 * Set the maximum number of listeners per event
	 * @param n - Maximum number (0 for unlimited)
	 */
	setMaxListeners(n: number): void {
		if (n < 0) {
			throw new RangeError('maxListeners must be a non-negative number');
		}
		this.maxListeners = n;
		this.warningEmitted.clear(); // Reset warnings when limit changes
	}

	/**
	 * Get the maximum number of listeners per event
	 */
	getMaxListeners(): number {
		return this.maxListeners;
	}

	/**
	 * Get the number of listeners for a specific event
	 */
	listenerCount<K extends keyof T>(name: K): number {
		return this.events[name]?.size() || 0;
	}

	/**
	 * Get all event names that have listeners
	 */
	getEventNames(): (keyof T)[] {
		return Object.keys(this.events).filter(
			name => this.events[name as keyof T]?.size()! > 0
		) as (keyof T)[];
	}

	/**
	 * Get all listeners for a specific event
	 */
	getListeners<K extends keyof T>(name: K): T[K][] {
		if (!this.events[name]) return [];
		return this.events[name]!.getListeners().map(listener => listener.callback as T[K]);
	}

	/**
	 * Remove all listeners for a specific event or all events
	 */
	removeAllListeners<K extends keyof T>(name?: K): void {
		if (name !== undefined) {
			delete this.events[name];
			this.warningEmitted.delete(name);
		} else {
			this.events = {};
			this.warningEmitted.clear();
		}
	}
}
