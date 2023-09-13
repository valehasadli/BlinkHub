import Emitter from '.';

// Define the signature of the event callbacks.
type Callback = (...args: any[]) => any;

describe('Emitter', () => {
    let sub: () => void; // Unsubscribe function type
    const callback1: Callback = jest.fn();
    const callback2: Callback = jest.fn();
    const emitter: Emitter = new Emitter(); // Assuming the type of Emitter is imported

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
        emitter.subscribe('myEvent', (): number => 1);
        emitter.subscribe('myEvent', (): number => 2);
        emitter.subscribe('myEvent', (): boolean => true);
        const result: Array<number | boolean> = emitter.emit('myEvent');
        expect(result).toEqual([1, 2, true]);
    });
});
