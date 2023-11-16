export interface IEvent<T extends Record<string, (...args: any[]) => void>> {
	subscribe<K extends keyof T>(name: K, callback: T[K], priority?: number): () => void;
	emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[];
}
