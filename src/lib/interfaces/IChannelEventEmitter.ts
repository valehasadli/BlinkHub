import { Channel } from '../channels/Channel';

export interface IChannelEventEmitter<T extends Record<string, (...args: any[]) => void>> {
	channel(name: string): Channel<T>;
}
