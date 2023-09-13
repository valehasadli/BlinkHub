import Emitter from '.'

describe('Emitter', () => {
    let sub
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const emitter = new Emitter()

    test('should trigger nothing', () => {
        emitter.emit('event', 'foo')
        expect(callback1).not.toHaveBeenCalled()
    })

    test('should trigger 1 callback', () => {
        sub = emitter.subscribe('event', callback1)
        emitter.emit('event', 'foo')
        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback1).toHaveBeenCalledWith('foo')
    })

    test('should trigger 2 callbacks', () => {
        emitter.subscribe('event', callback2)
        emitter.emit('event', 'bar', 'baz')
        expect(callback1).toHaveBeenCalledTimes(2)
        expect(callback1).toHaveBeenCalledWith('bar', 'baz')
        expect(callback2).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledWith('bar', 'baz')
    })

    test('should release first callback, and call the second', () => {
        sub()
        emitter.emit('event', 'meow')
        expect(callback1).toHaveBeenCalledTimes(2) // same number as before
        expect(callback2).toHaveBeenCalledTimes(2)
        expect(callback2).toHaveBeenCalledWith('meow')
    })

    test('should return the return values of all the events in the callstack', () => {
        emitter.subscribe('myEvent', () => 1)
        emitter.subscribe('myEvent', () => 2)
        emitter.subscribe('myEvent', () => true)
        const result = emitter.emit('myEvent')
        expect(result).toEqual([1, 2, true])
    })
})
