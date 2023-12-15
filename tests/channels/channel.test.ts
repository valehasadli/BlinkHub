import Emitter from "../../src";
import { Channel } from "../../src/lib/channels/Channel";

type MyEvents = {
	eventName: (arg: string) => void;
};

describe('Emitter with Channels', () => {
	let emitter: Emitter<MyEvents>;
	let userChannel: Channel<MyEvents>;
	let adminChannel: Channel<MyEvents>;

	beforeEach(() => {
		emitter = new Emitter<MyEvents>();
		userChannel = emitter.channel('user');
		adminChannel = emitter.channel('admin');
	});

	test('Subscribing and Emitting on the Global Emitter', () => {
		let globalEventTriggered = false;

		emitter.subscribe('eventName', (arg: string) => {
			globalEventTriggered = true;
			expect(arg).toBe('TestArg');
		});

		emitter.emit('eventName', 'TestArg');
		expect(globalEventTriggered).toBe(true);
	});

	test('Subscribing and Emitting on a Channel', () => {
		let channelEventTriggered = false;

		userChannel.subscribe('eventName', (arg: string) => {
			channelEventTriggered = true;
			expect(arg).toBe('ChannelArg');
		});

		userChannel.emit('eventName', 'ChannelArg');
		expect(channelEventTriggered).toBe(true);
	});

	test('Isolation Between Channels', () => {
		let userEventTriggered = false;
		let adminEventTriggered = false;

		userChannel.subscribe('eventName', () => {
			userEventTriggered = true;
		});
		adminChannel.subscribe('eventName', () => {
			adminEventTriggered = true;
		});

		userChannel.emit('eventName', 'UserEvent');
		expect(userEventTriggered).toBe(true);
		expect(adminEventTriggered).toBe(false);
	});

	test('Channel Reusability', () => {
		const firstUserChannel = emitter.channel('user');
		const secondUserChannel = emitter.channel('user');

		expect(firstUserChannel).toBe(secondUserChannel);
	});

	test('Unsubscribing from a Channel', () => {
		let eventCount = 0;

		const unsubscribe = userChannel.subscribe('eventName', () => {
			eventCount++;
		});

		unsubscribe();

		userChannel.emit('eventName', 'TestArg');
		expect(eventCount).toBe(0);
	});

});
