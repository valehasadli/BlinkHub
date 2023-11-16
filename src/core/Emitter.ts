import { EventRegistry } from "@/core/EventRegistry";
import { ChannelRegistry } from "@/channels/ChannelRegistry";
import { Channel } from "@/channels/Channel";
import { IEvent } from "@/types/IEvent";

export class Emitter<T extends Record<string, (...args: any[]) => void>> implements IEvent<T>{
	private eventRegistry = new EventRegistry<T>();
	private channelRegistry = new ChannelRegistry<T>();

	subscribe<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		return this.eventRegistry.subscribe(name, callback, priority);
	}

	emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): (ReturnType<T[K]> | Error)[] {
		return this.eventRegistry.emit(name, ...args);
	}

	once<K extends keyof T>(name: K, callback: T[K], priority: number = 0): () => void {
		return this.eventRegistry.once(name, callback, priority);
	}

	subscribeList(eventCallbacks: { [K in keyof T]?: T[K] }): () => void {
		return this.eventRegistry.subscribeList(eventCallbacks);
	}

	channel(name: string): Channel<T> {
		return this.channelRegistry.channel(name);
	}
}
