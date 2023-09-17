import Emitter from '../index';

type MyEvents = {
    event: (arg1: string, arg2?: string) => void;
    myEvent: () => number | boolean;
};

describe('Emitter', () => {
    let sub: () => void; // Unsubscribe function type
    const callback1 = jest.fn((arg1: string, args2?: string) => {});
    const callback2 = jest.fn((arg1: string, arg2?: string) => {});
    const emitter = new Emitter<MyEvents>();

    test('should trigger nothing', () => {
        emitter.emit('event', 'foo');
        expect(callback1).not.toHaveBeenCalled();
    });

    test('should trigger 1 callback', () => {
        sub = emitter.subscribe('event', callback1);
        emitter.emit('event', 'foo');
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback1).toHaveBeenCalledWith('foo');
    });

    test('should trigger 2 callbacks', () => {
        emitter.subscribe('event', callback2);
        emitter.emit('event', 'bar', 'baz');
        expect(callback1).toHaveBeenCalledTimes(2);
        expect(callback1).toHaveBeenCalledWith('bar', 'baz');
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledWith('bar', 'baz');
    });

    test('should release first callback, and call the second', () => {
        sub();
        emitter.emit('event', 'meow');
        expect(callback1).toHaveBeenCalledTimes(2); // same number as before
        expect(callback2).toHaveBeenCalledTimes(2);
        expect(callback2).toHaveBeenCalledWith('meow');
    });

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

    test('should not trigger after unsubscribe', () => {
        const mockCallback = jest.fn();
        const unsubscribe = emitter.subscribe('event', mockCallback);
        unsubscribe();
        emitter.emit('event', 'data');
        expect(mockCallback).not.toHaveBeenCalled();
    });

    test('should handle multiple unsubscribes gracefully', () => {
        const unsubscribe = emitter.subscribe('event', jest.fn());
        unsubscribe();
        expect(() => unsubscribe()).not.toThrow();
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

});
