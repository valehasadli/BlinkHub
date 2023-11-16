import Emitter from "../../src";

type MyEvents = {
    event: (arg1: string, arg2?: string) => void;
    myEvent: () => number | boolean;
};

describe('Subscription Emitter', () => {
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
});
