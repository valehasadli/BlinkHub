import { Emitter } from '@/core/Emitter';

type MyEvents = {
    event: (arg: string) => void;
};

describe('Unsubscribe Events', () => {
    let emitter: Emitter<MyEvents>;

    beforeEach(() => {
        emitter = new Emitter<MyEvents>();
    });

    test('should unsubscribe a previously subscribed callback', () => {
        const callback = jest.fn();
        const unsubscribe = emitter.subscribe('event', callback);

        // Emitting event should call the callback
        emitter.emit('event', 'test-data');
        expect(callback).toHaveBeenCalledWith('test-data');

        // Unsubscribe the callback
        unsubscribe();

        // Reset the mock to clear the previous calls
        callback.mockReset();

        // Emitting event again should not call the callback
        emitter.emit('event', 'test-data');
        expect(callback).not.toHaveBeenCalled();
    });

    test('should allow multiple unsubscribes without errors', () => {
        const callback = jest.fn();
        const unsubscribe = emitter.subscribe('event', callback);

        // Unsubscribe the callback twice
        unsubscribe();
        expect(() => unsubscribe()).not.toThrow();
    });

    test('should not affect other callbacks when unsubscribing', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const unsubscribe1 = emitter.subscribe('event', callback1);
        emitter.subscribe('event', callback2);

        // Emitting event should call both callbacks
        emitter.emit('event', 'test-data');
        expect(callback1).toHaveBeenCalledWith('test-data');
        expect(callback2).toHaveBeenCalledWith('test-data');

        // Unsubscribe the first callback
        unsubscribe1();

        // Reset the mocks to clear the previous calls
        callback1.mockReset();
        callback2.mockReset();

        // Emitting event again should only call the second callback
        emitter.emit('event', 'test-data');
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledWith('test-data');
    });
});
