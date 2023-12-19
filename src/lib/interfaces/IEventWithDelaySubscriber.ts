export interface IEventWithDelaySubscriber<T extends Record<string, (...args: any[]) => void>> {
	subscribeWithDelay<K extends keyof T>(
		name: K,
		callback: T[K],
		delay: number,
		priority?: number
	): () => void;
}
