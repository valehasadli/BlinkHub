export interface IEventOnceSubscriber<T extends Record<string, (...args: any[]) => void>> {
	once<K extends keyof T>(name: K, callback: T[K], priority: number): () => void;
}
