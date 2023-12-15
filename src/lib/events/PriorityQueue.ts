import { Listener } from '../types';

export default class PriorityQueue<T extends (...args: any[]) => any> {
	private items: Array<Listener<T>> = [];

	enqueue(listener: Listener<T>): void {
		let index = this.items.findIndex(item => item.priority < listener.priority);
		index = index === -1 ? this.items.length : index;
		this.items.splice(index, 0, listener);
	}

	getListeners(): Array<Listener<T>> {
		return [...this.items];
	}

	remove(listenerToRemove: Listener<T>): void {
		const index = this.items.findIndex(listener =>
			listener.callback === listenerToRemove.callback &&
			listener.priority === listenerToRemove.priority
		);

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}
