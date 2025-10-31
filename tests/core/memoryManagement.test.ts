import Emitter from '../../src/lib/events/Emitter';

type TestEvents = {
	data: (value: string) => void;
	update: (id: number) => void;
	error: (message: string) => void;
};

describe('Memory Management', () => {
	let emitter: Emitter<TestEvents>;
	let consoleWarnSpy: jest.SpyInstance;

	beforeEach(() => {
		emitter = new Emitter<TestEvents>();
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	describe('setMaxListeners() and getMaxListeners()', () => {
		it('should have default max listeners of 10', () => {
			expect(emitter.getMaxListeners()).toBe(10);
		});

		it('should set max listeners', () => {
			emitter.setMaxListeners(20);
			expect(emitter.getMaxListeners()).toBe(20);
		});

		it('should allow setting max listeners to 0 (unlimited)', () => {
			emitter.setMaxListeners(0);
			expect(emitter.getMaxListeners()).toBe(0);
		});

		it('should return this for chaining', () => {
			const result = emitter.setMaxListeners(15);
			expect(result).toBe(emitter);
		});

		it('should throw error for negative values', () => {
			expect(() => emitter.setMaxListeners(-1)).toThrow(RangeError);
			expect(() => emitter.setMaxListeners(-1)).toThrow('maxListeners must be a non-negative number');
		});
	});

	describe('Memory Leak Detection', () => {
		it('should warn when max listeners exceeded', () => {
			emitter.setMaxListeners(3);

			// Add 3 listeners (at limit)
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {});

			expect(consoleWarnSpy).not.toHaveBeenCalled();

			// Add 4th listener (exceeds limit)
			emitter.subscribe('data', () => {});

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Possible memory leak detected')
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('4 listeners added for event "data"')
			);
		});

		it('should only warn once per event', () => {
			emitter.setMaxListeners(2);

			// Add listeners exceeding limit
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {}); // Warning
			emitter.subscribe('data', () => {}); // No warning

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
		});

		it('should not warn when max listeners is 0 (unlimited)', () => {
			emitter.setMaxListeners(0);

			// Add many listeners
			for (let i = 0; i < 20; i++) {
				emitter.subscribe('data', () => {});
			}

			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});

	describe('listenerCount()', () => {
		it('should return 0 for event with no listeners', () => {
			expect(emitter.listenerCount('data')).toBe(0);
		});

		it('should return correct count for multiple listeners', () => {
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {});
			emitter.subscribe('data', () => {});
			expect(emitter.listenerCount('data')).toBe(3);
		});

		it('should decrease count when listener is removed', () => {
			const unsub1 = emitter.subscribe('data', () => {});
			const unsub2 = emitter.subscribe('data', () => {});

			expect(emitter.listenerCount('data')).toBe(2);

			unsub1();
			expect(emitter.listenerCount('data')).toBe(1);

			unsub2();
			expect(emitter.listenerCount('data')).toBe(0);
		});
	});

	describe('getEventNames()', () => {
		it('should return empty array when no events', () => {
			expect(emitter.getEventNames()).toEqual([]);
		});

		it('should return event names with listeners', () => {
			emitter.subscribe('data', () => {});
			emitter.subscribe('update', () => {});

			const names = emitter.getEventNames();
			expect(names).toHaveLength(2);
			expect(names).toContain('data');
			expect(names).toContain('update');
		});
	});

	describe('removeAllListeners()', () => {
		it('should remove all listeners for a specific event', () => {
			const cb = jest.fn();
			emitter.subscribe('data', cb);
			emitter.subscribe('data', cb);
			emitter.subscribe('update', cb);

			expect(emitter.listenerCount('data')).toBe(2);
			expect(emitter.listenerCount('update')).toBe(1);

			emitter.removeAllListeners('data');

			expect(emitter.listenerCount('data')).toBe(0);
			expect(emitter.listenerCount('update')).toBe(1);
		});

		it('should remove all listeners for all events when no name provided', () => {
			const cb = jest.fn();
			emitter.subscribe('data', cb);
			emitter.subscribe('update', cb);
			emitter.subscribe('error', cb);

			expect(emitter.getEventNames()).toHaveLength(3);

			emitter.removeAllListeners();

			expect(emitter.listenerCount('data')).toBe(0);
			expect(emitter.listenerCount('update')).toBe(0);
			expect(emitter.listenerCount('error')).toBe(0);
			expect(emitter.getEventNames()).toEqual([]);
		});

		it('should return this for chaining', () => {
			const result = emitter.removeAllListeners('data');
			expect(result).toBe(emitter);
		});
	});
});
