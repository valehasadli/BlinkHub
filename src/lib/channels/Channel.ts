import { EventRegistry } from '../events/EventRegistry';
import { IEventSubscriber } from '../interfaces/IEventSubscriber';

export class Channel<T extends Record<string, (...args: any[]) => void>> implements IEventSubscriber<T>{
	private eventRegistry = new EventRegistry<T>();

	subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		return this.eventRegistry.subscribe(name, callback, priority);
	}

	emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[] {
		return this.eventRegistry.emit(name, ...args);
	}
}
