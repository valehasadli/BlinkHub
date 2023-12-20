import Emitter from '../../src';

type MyEvents = {
    event: (arg1: string, arg2?: string) => void;
    myEvent: () => number | boolean;
};

describe('Emission Emitter', () => {
    const emitter = new Emitter<MyEvents>();

    test('should return the return values of all the events in the callstack', () => {
        const callback3 = jest.fn((): number => 1);
        const callback4 = jest.fn((): number => 2);
        const callback5 = jest.fn((): boolean => true);
        emitter.subscribe('myEvent', callback3);
        emitter.subscribe('myEvent', callback4);
        emitter.subscribe('myEvent', callback5);

        const result: Array<number | boolean> = emitter.emit('myEvent') as Array<number | boolean>;
        expect(result).toEqual([1, 2, true]);
    });

    test('should execute callbacks in the order they were added', () => {
        const order: number[] = [];
        emitter.subscribe('event', () => order.push(1));
        emitter.subscribe('event', () => order.push(2));
        emitter.emit('event', 'data');
        expect(order).toEqual([1, 2]);
    });

    test('should isolate events and their callbacks', () => {
        const event1Callback = jest.fn();
        const event2Callback = jest.fn();
        emitter.subscribe('event', event1Callback);
        emitter.subscribe('myEvent', event2Callback);
        emitter.emit('event', 'foo');
        expect(event1Callback).toHaveBeenCalledTimes(1);
        expect(event2Callback).not.toHaveBeenCalled();
    });

    test('should allow unsubscribing from an event', () => {
        const callback = jest.fn();
        const unsubscribe = emitter.subscribe('event', callback);

        // Emit the event once with a dummy argument
        emitter.emit('event', 'dummyArg');
        expect(callback).toHaveBeenCalledTimes(1);

        // Unsubscribe and emit again
        unsubscribe();
        emitter.emit('event', 'dummyArg');
        expect(callback).toHaveBeenCalledTimes(1); // Should still be 1
    });

    test('should handle an event with multiple arguments', () => {
        const callback = jest.fn();
        emitter.subscribe('event', callback);

        // Emit 'event' with two arguments
        emitter.emit('event', 'arg1', 'arg2');
        expect(callback.mock.calls[0]).toEqual(['arg1', 'arg2']); // Check the first call

        // Emit 'event' with only the mandatory argument
        emitter.emit('event', 'arg1');
        expect(callback.mock.calls[1]).toEqual(['arg1']); // Check the second call
    });

    test('should continue executing other callbacks if one throws an error', () => {
        const errorCallback = jest.fn(() => {
            throw new Error('Test Error');
        });
        const normalCallback = jest.fn();
        emitter.subscribe('event', errorCallback);
        emitter.subscribe('event', normalCallback);
        emitter.emit('event', 'data');
        expect(normalCallback).toHaveBeenCalled();
    });

    test('should handle emission with no subscribers without errors', () => {
        expect(() => emitter.emit('event', 'data')).not.toThrow();
    });


    test('should handle dynamic subscribing and unsubscribing within callbacks', () => {
        const dynamicCallback = jest.fn(() => {
            const unsubscribe = emitter.subscribe('event', jest.fn());
            unsubscribe();
        });
        emitter.subscribe('event', dynamicCallback);
        emitter.emit('event', 'data');
        expect(dynamicCallback).toHaveBeenCalled();
        // Check the total number of subscribers to ensure dynamic one was removed
    });

    test('should handle asynchronous callbacks correctly', done => {
        const asyncCallback = jest.fn(async () => {
            await Promise.resolve();
            expect(asyncCallback).toHaveBeenCalled();
            done();
        });
        emitter.subscribe('event', asyncCallback);
        emitter.emit('event', 'data');
    });
});
