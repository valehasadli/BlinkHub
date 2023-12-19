import Emitter from '../../src';

type MyEvents = {
    event: (arg1: string, arg2?: string) => void;
};

describe('Emitter Error Handling', () => {
    let emitter: Emitter<MyEvents>;

    beforeEach(() => {
        emitter = new Emitter<MyEvents>();
    });

    test('should continue executing remaining callbacks even if one throws an error', () => {
        const errorThrowingCallback = jest.fn(() => {
            throw new Error('Test error');
        });
        const regularCallback = jest.fn();

        emitter.subscribe('event', errorThrowingCallback);
        emitter.subscribe('event', regularCallback);

        expect(() => emitter.emit('event', 'data')).not.toThrow();
        expect(regularCallback).toHaveBeenCalledTimes(1);
    });

    test('should not call a callback subscribed during event emission', () => {
        const callback1 = jest.fn();
        const lateCallback = jest.fn();

        emitter.subscribe('event', () => {
            emitter.subscribe('event', lateCallback);
        });
        emitter.subscribe('event', callback1);

        emitter.emit('event', 'data');
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(lateCallback).not.toHaveBeenCalled();

        // Emit again to ensure lateCallback is now called
        emitter.emit('event', 'data');
        expect(callback1).toHaveBeenCalledTimes(2);
        expect(lateCallback).toHaveBeenCalledTimes(1);
    });
});
