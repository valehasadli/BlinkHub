import { Emitter } from '@/core/Emitter';

type MyEvents = {
    testEvent: (val: string) => string;
    event: (data: string) => void;
};
describe('Emitter with Priority', () => {
    const emitter = new Emitter<MyEvents>();

    test('should handle callbacks based on priority', () => {
        const results: string[] = [];

        emitter.subscribe('testEvent', (val: string) => {
            results.push('Default Priority');
            return val;
        });

        emitter.subscribe('testEvent', (val: string) => {
            results.push('Higher Priority');
            return val;
        }, 10);

        emitter.subscribe('testEvent', (val: string) => {
            results.push('Lower Priority');
            return val;
        }, -10);

        emitter.emit('testEvent', '');

        expect(results).toEqual(['Higher Priority', 'Default Priority', 'Lower Priority']);
    });

    test('should execute callbacks in order of subscription when priorities are equal', () => {
        const order: number[] = [];
        emitter.subscribe('event', () => order.push(1), 5);
        emitter.subscribe('event', () => order.push(2), 5);

        emitter.emit('event', 'data');
        expect(order).toEqual([1, 2]);
    });
});
