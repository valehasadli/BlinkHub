import Emitter from '../../src';

type TestEvents = {
	testEvent: (data: string) => void;
};

describe('Emitter subscribeWithDelay Tests', () => {
	let emitter: Emitter<TestEvents>;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		emitter = new Emitter<TestEvents>();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers(); // Complete only the timers in the current test
		jest.clearAllMocks(); // Clear mock function calls
	});

	afterAll(() => {
		jest.useRealTimers(); // Reset to real timers
	});

	test('should delay callback execution', () => {
		const callback = jest.fn();
		const delay = 1000; // 1 second delay

		emitter.subscribeWithDelay('testEvent', callback, delay);

		emitter.emit('testEvent', 'test-data');
		expect(callback).not.toHaveBeenCalled();

		// Fast-forward time by the specified delay
		jest.advanceTimersByTime(delay);
		expect(callback).toHaveBeenCalledWith('test-data');
	});

	test('should allow unsubscribing delayed callback', () => {
		const callback = jest.fn();
		const delay = 1000;

		const unsubscribe = emitter.subscribeWithDelay('testEvent', callback, delay);

		// Unsubscribe before the delay passes
		unsubscribe();

		// Fast-forward time
		jest.advanceTimersByTime(delay);
		expect(callback).not.toHaveBeenCalled();
	});

	test('multiple delayed subscriptions should work independently', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();
		const delay1 = 1000;
		const delay2 = 2000;

		emitter.subscribeWithDelay('testEvent', callback1, delay1);
		emitter.subscribeWithDelay('testEvent', callback2, delay2);

		emitter.emit('testEvent', 'test-data');
		expect(callback1).not.toHaveBeenCalled();
		expect(callback2).not.toHaveBeenCalled();

		// Fast-forward time to the first delay
		jest.advanceTimersByTime(delay1);
		expect(callback1).toHaveBeenCalledWith('test-data');
		expect(callback2).not.toHaveBeenCalled();

		// Fast-forward time to the second delay
		jest.advanceTimersByTime(delay2 - delay1);
		expect(callback2).toHaveBeenCalledWith('test-data');
	});


	test('should handle same callback subscribed multiple times with different delays', () => {
		const callback = jest.fn();
		const delay1 = 1000;
		const delay2 = 2000;

		emitter.subscribeWithDelay('testEvent', callback, delay1);
		emitter.subscribeWithDelay('testEvent', callback, delay2);

		emitter.emit('testEvent', 'test-data');
		jest.advanceTimersByTime(delay1);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(delay2 - delay1);
		expect(callback).toHaveBeenCalledTimes(2);
	});

	test('should handle zero delay', () => {
		const callback = jest.fn();
		const delay = 0;

		emitter.subscribeWithDelay('testEvent', callback, delay);
		emitter.emit('testEvent', 'immediate-data');
		jest.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalledWith('immediate-data');
	});


	test('should handle same callback subscribed multiple times with different delays', () => {
		const callback = jest.fn();
		const delay1 = 1000;
		const delay2 = 2000;

		emitter.subscribeWithDelay('testEvent', callback, delay1);
		emitter.subscribeWithDelay('testEvent', callback, delay2);

		emitter.emit('testEvent', 'test-data');
		jest.advanceTimersByTime(delay1);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(delay2 - delay1);
		expect(callback).toHaveBeenCalledTimes(2);
	});
	test('should execute multiple callbacks in the correct order based on delay', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();
		const delay1 = 1000;
		const delay2 = 500; // shorter delay

		emitter.subscribeWithDelay('testEvent', callback1, delay1);
		emitter.subscribeWithDelay('testEvent', callback2, delay2);

		emitter.emit('testEvent', 'test-data');
		jest.advanceTimersByTime(delay2);
		expect(callback2).toHaveBeenCalledWith('test-data');
		expect(callback1).not.toHaveBeenCalled();

		jest.advanceTimersByTime(delay1 - delay2);
		expect(callback1).toHaveBeenCalledWith('test-data');
	});
	test('should not call callback if unsubscribed after delay but before execution', () => {
		const callback = jest.fn();
		const delay = 1000;

		const unsubscribe = emitter.subscribeWithDelay('testEvent', callback, delay);

		// Fast-forward time, but callback not called yet
		jest.advanceTimersByTime(delay);

		// Unsubscribe before the callback is called
		unsubscribe();

		// Manually trigger any pending timers (if your implementation supports this)
		jest.runOnlyPendingTimers();

		expect(callback).not.toHaveBeenCalled();
	});
});