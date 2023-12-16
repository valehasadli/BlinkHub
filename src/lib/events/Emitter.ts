import { EventRegistry } from './EventRegistry';
import { ChannelRegistry } from '../channels/ChannelRegistry';
import { Channel } from '../channels/Channel';
import { IEventSubscriber } from '../interfaces/IEventSubscriber';
import { IEventOnceSubscriber } from '../interfaces/IEventOnceSubscriber';
import { IBulkEventSubscriber } from '../interfaces/IBulkEventSubscriber';
import { IChannelEventEmitter } from '../interfaces/IChannelEventEmitter';
import {IEventWithDelaySubscriber} from "../interfaces/IEventWithDelaySubscriber";

export default class Emitter<T extends Record<string, (...args: any[]) => void>>
	implements IEventSubscriber<T>, IEventOnceSubscriber<T>, IBulkEventSubscriber<T>, IChannelEventEmitter<T>,
		IEventWithDelaySubscriber<T>  {
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

	subscribeWithDelay<K extends keyof T>(
		name: K,
		callback: T[K],
		delay: number,
		priority: number = 0
	): () => void {
		return this.eventRegistry.subscribeWithDelay(name, callback, delay, priority);
	}
}
