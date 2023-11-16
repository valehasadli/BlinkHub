import { Emitter } from '@/core/Emitter';

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
});
