import Emitter from "../../src";

type MyEvents = {
    sampleEvent: (msg: string) => void;
};

describe('Emitter .once() method', (): void => {
    let emitter: Emitter<MyEvents>;

    beforeEach(() => {
        emitter = new Emitter<MyEvents>();
    });

    test('should execute the listener only once', (): void => {
        let callCount: number = 0;
        emitter.once('sampleEvent', (_: string): void => {
            callCount++;
        });

        emitter.emit('sampleEvent', 'test');
        emitter.emit('sampleEvent', 'test again');

        expect(callCount).toBe(1);
    });

    test('should work with multiple listeners', (): void => {
        let onceListenerCalled: boolean = false;
        let regularListenerCalled: number = 0;

        emitter.once('sampleEvent', (_: string): void => {
            onceListenerCalled = true;
        });

        emitter.subscribe('sampleEvent', (_: string): void => {
            regularListenerCalled++;
        });

        emitter.emit('sampleEvent', 'test');
        emitter.emit('sampleEvent', 'test again');

        expect(onceListenerCalled).toBe(true);
        expect(regularListenerCalled).toBe(2);
    });

    test('should handle manual unsubscription', (): void => {
        let callCount = 0;
        const unsubscribe = emitter.once('sampleEvent', (_: string): void => {
            callCount++;
        });

        unsubscribe();

        emitter.emit('sampleEvent', 'test');

        expect(callCount).toBe(0);
    });

    test('unsubscribe removes listener', (): void => {
        let callCount = 0;
        const unsubscribe = emitter.once('sampleEvent', (): void => {
            callCount++;
        });

        emitter.emit('sampleEvent', 'test');
        unsubscribe(); // Unsubscribe here

        emitter.emit('sampleEvent', 'test again');

        expect(callCount).toBe(1); // The listener should still be called once
    });

    test('should pass arguments to the listener', (): void => {
        let receivedMessage: string = '';

        emitter.once('sampleEvent', (message): void => {
            receivedMessage = message;
        });

        emitter.emit('sampleEvent', 'Hello!');

        expect(receivedMessage).toBe('Hello!');
    });

    test('should respect priorities', (): void => {
        let sequence: string[] = [];

        emitter.once('sampleEvent', (_): void => {
            sequence.push('high');
        }, 10);

        emitter.subscribe('sampleEvent', (_: string): void => {
            sequence.push('low');
        }, -10);

        emitter.emit('sampleEvent', 'test');

        expect(sequence).toEqual(['high', 'low']);
    });

    test('should handle errors and not re-invoke listener', (): void => {
        let callCount: number = 0;

        emitter.once('sampleEvent', (_): void => {
            callCount++;
            throw new Error("Test error");
        });

        const results1 = emitter.emit('sampleEvent', 'test');
        const results2 = emitter.emit('sampleEvent', 'test again');

        expect(results1[0]).toBeInstanceOf(Error);
        expect(callCount).toBe(1);
        expect(results2.length).toBe(0);
    });
});
