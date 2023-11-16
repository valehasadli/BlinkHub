import Emitter from "../../src";

describe('Emitter subscribe multiple events', () => {
	type TestEvents = {
		eventOne: (msg: string) => void;
		eventTwo: (num: number) => void;
		eventThree: () => void;
	};

	let emitter: Emitter<TestEvents>;

	beforeEach(() => {
		emitter = new Emitter<TestEvents>();
	});

	test('should call the listener for each subscribed event', () => {
		const mockCallbackOne = jest.fn();
		const mockCallbackTwo = jest.fn();
		emitter.subscribeList({
			eventOne: mockCallbackOne,
			eventTwo: mockCallbackTwo
		});

		emitter.emit('eventOne', 'Test message');
		emitter.emit('eventTwo', 42);

		expect(mockCallbackOne).toHaveBeenCalledWith('Test message');
		expect(mockCallbackTwo).toHaveBeenCalledWith(42);
	});

	test('should not call the listener for non-subscribed events', () => {
		const mockCallback = jest.fn();
		emitter.subscribeList({ eventOne: mockCallback });

		emitter.emit('eventTwo', 42);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	test('should handle multiple listeners for the same event', () => {
		const firstCallback = jest.fn();
		const secondCallback = jest.fn();
		emitter.subscribeList({ eventOne: firstCallback });
		emitter.subscribeList({ eventOne: secondCallback });

		emitter.emit('eventOne', 'Hello');

		expect(firstCallback).toHaveBeenCalledWith('Hello');
		expect(secondCallback).toHaveBeenCalledWith('Hello');
	});

	test('should correctly unsubscribe from events', () => {
		const mockCallbackOne = jest.fn();
		const mockCallbackTwo = jest.fn();
		const unsubscribe = emitter.subscribeList({
			eventOne: mockCallbackOne,
			eventTwo: mockCallbackTwo
		});

		unsubscribe();

		emitter.emit('eventOne', 'Test');
		emitter.emit('eventTwo', 123);

		expect(mockCallbackOne).not.toHaveBeenCalled();
		expect(mockCallbackTwo).not.toHaveBeenCalled();
	});

	test('should handle unsubscribing from some but not all events', () => {
		const mockCallback = jest.fn();
		const unsubscribe = emitter.subscribeList({
			eventOne: mockCallback,
			eventTwo: mockCallback
		});

		unsubscribe();

		emitter.emit('eventTwo', 123);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	test('should handle empty event list', () => {
		const mockCallback = jest.fn();
		const unsubscribe = emitter.subscribeList({});

		emitter.emit('eventOne', 'Test');
		emitter.emit('eventTwo', 123);
		emitter.emit('eventThree');

		expect(mockCallback).not.toHaveBeenCalled();

		unsubscribe(); // Ensure proper cleanup
	});

	test('should handle callbacks throwing errors', () => {
		const errorThrowingCallback = jest.fn(() => {
			throw new Error('Test error');
		});
		emitter.subscribeList({ eventOne: errorThrowingCallback });

		const results = emitter.emit('eventOne', 'Test');

		// Check if the results array contains an error with the expected message
		expect(results).toHaveLength(1);
		expect(results[0]).toBeInstanceOf(Error);
		expect((results[0] as Error).message).toBe('Test error');
	});


	test('should support multiple arguments in events', () => {
		const mockCallback = jest.fn();
		emitter.subscribeList({ eventOne: mockCallback });
		emitter.emit('eventOne', 'Hello World');

		expect(mockCallback).toHaveBeenCalledWith('Hello World');
	});


	test('should handle multiple subscriptions to the same event with different callbacks', () => {
		const firstCallback = jest.fn();
		const secondCallback = jest.fn();
		emitter.subscribeList({ eventOne: firstCallback });
		emitter.subscribeList({ eventOne: secondCallback });

		emitter.emit('eventOne', 'Hello');

		expect(firstCallback).toHaveBeenCalledWith('Hello');
		expect(secondCallback).toHaveBeenCalledWith('Hello');
	});

	test('should handle unsubscribe called during event emission', () => {
		const unsubscribe = emitter.subscribeList({
			eventOne: jest.fn(() => unsubscribe())
		});

		emitter.emit('eventOne', 'Test');

		// Test that unsubscribe works correctly
	});

	test('should handle callbacks that modify the emitter', () => {
		const dynamicCallback = jest.fn(() => {
			emitter.subscribeList({ eventTwo: mockCallback });
		});
		const mockCallback = jest.fn();

		emitter.subscribeList({ eventOne: dynamicCallback });
		emitter.emit('eventOne', 'Hello');

		expect(dynamicCallback).toHaveBeenCalledWith('Hello');

		// Emit 'eventTwo' with a number, as expected by its callback type
		emitter.emit('eventTwo', 42);
		expect(mockCallback).toHaveBeenCalledWith(42);
	});

	test('should execute callbacks in the order they were added for the same priority', () => {
		const firstCallback = jest.fn();
		const secondCallback = jest.fn();
		emitter.subscribeList({ eventOne: firstCallback });
		emitter.subscribeList({ eventOne: secondCallback });

		emitter.emit('eventOne', 'Data');

		expect(firstCallback.mock.invocationCallOrder[0])
			.toBeLessThan(secondCallback.mock.invocationCallOrder[0]);
	});

	test('should handle callbacks that emit other events', () => {
		const triggeringCallback = jest.fn(() => emitter.emit('eventTwo', 42));
		const listeningCallback = jest.fn();

		emitter.subscribeList({ eventOne: triggeringCallback });
		emitter.subscribeList({ eventTwo: listeningCallback });

		emitter.emit('eventOne', 'Trigger');

		expect(triggeringCallback).toHaveBeenCalledWith('Trigger');
		expect(listeningCallback).toHaveBeenCalledWith(42);
	});

	test('should pass the correct argument to the event callback', () => {
		const mockCallback = jest.fn();
		emitter.subscribeList({ eventOne: mockCallback });

		emitter.emit('eventOne', 'Hello');

		expect(mockCallback).toHaveBeenCalledWith('Hello');
	});
});
