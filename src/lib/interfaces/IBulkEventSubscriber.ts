export interface IBulkEventSubscriber<T extends Record<string, (...args: any[]) => void>> {
	subscribeList(eventCallbacks: { [K in keyof T]?: T[K] }): () => void;
}
