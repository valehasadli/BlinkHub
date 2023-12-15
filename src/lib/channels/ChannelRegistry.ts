import { Channel } from "./Channel";

export class ChannelRegistry<T extends Record<string, (...args: any[]) => void>> {
	private channels: Map<string, Channel<T>> = new Map();

	channel(name: string): Channel<T> {
		if (!this.channels.has(name)) {
			this.channels.set(name, new Channel<T>());
		}
		return this.channels.get(name)!;
	}
}
