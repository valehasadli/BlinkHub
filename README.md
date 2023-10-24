# BlinkHub Emitter

A type-safe event emitter class built with TypeScript, which provides an interface for subscribing to and emitting events.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [Defining Events and Their Types](#defining-events-and-their-types)
    - [Subscribing to Events](#subscribing-to-events)
    - [Emitting Events](#emitting-events)
    - [Unsubscribing from Events](#unsubscribing-from-events)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [License](#license)

## Installation

`npm i blink-hub`

## Usage

### Defining Events and Their Types

To use the Emitter, you first need to define the types for your events:

```typescript
type MyEvents = {
  eventName: (arg1: string, arg2: string) => void;
  anotherEvent: (data: number) => void;
};
```

### Subscribing to Events

Now, you can create an instance of the <code>Emitter</code> and subscribe to events:

```typescript
const emitter = new Emitter<MyEvents>();

const unsubscribe = emitter.subscribe('eventName', (arg1: string, arg2: string) => {
    console.log(`Received ${arg1} and ${arg2}`);
});
```

### Emitting Events

You can emit events while ensuring the types of the emitted values match the expected ones:

```typescript
emitter.emit('eventName', 'Hello', 'World'); // Outputs: Received Hello and World
```

### Unsubscribing from Events

To remove a listener from an event:

```typescript
unsubscribe(); // This will remove the callback from the event listeners.
```

### Error Handling

If an error occurs within a callback, the emitter will catch it and log it to the console. The emitter also pushes a null value to the results array in case of errors, though this behavior can be customized.

```typescript
emitter.subscribe('eventName', () => {
    throw new Error('Oops!');
});

emitter.emit('eventName', 'Test', 'Error'); // Outputs: Error in callback for event 'eventName'
```

### Examples

## Simple Notification System

Imagine a system where various components need to be notified when a user logs in or logs out.

First, define the events:

```typescript
type UserEvents = {
  userLoggedIn: (username: string, time: Date) => void;
  userLoggedOut: (username: string) => void;
};
```

Then, create an instance of the <code>Emitter</code>:

```typescript
const userEmitter = new Emitter<UserEvents>();
```

Components can now subscribe to these events:

```typescript
// Notify components about user's login
userEmitter.subscribe('userLoggedIn', (username: string, time: Date) => {
    console.log(`${username} logged in at ${time.toLocaleTimeString()}`);
});

// Notify components about user's logout
userEmitter.subscribe('userLoggedOut', (username: string) => {
    console.log(`${username} has logged out.`);
});
```

Emitting the events when a user logs in or out:

```typescript
userEmitter.emit('userLoggedIn', 'Alice', new Date());
userEmitter.emit('userLoggedOut', 'Alice');
```

## E-Commerce Cart System

Consider an e-commerce application where you might want to listen for events related to items being added or removed from a cart.

Define your events:

```typescript
type CartEvents = {
  itemAdded: (itemName: string, quantity: number) => void;
  itemRemoved: (itemName: string) => void;
};
```

Create an instance and subscribe to the events:

```typescript
const cartEmitter = new Emitter<CartEvents>();

cartEmitter.subscribe('itemAdded', (itemName: string, quantity: number) => {
    console.log(`Added ${quantity} of ${itemName} to the cart.`);
});

cartEmitter.subscribe('itemRemoved', (itemName: string) => {
    console.log(`${itemName} has been removed from the cart.`);
});
```

When items are added or removed from the cart:

```typescript
cartEmitter.emit('itemAdded', 'Laptop', 1);
cartEmitter.emit('itemRemoved', 'Laptop');
```

## Emitter with Priority

The Emitter now supports priority-based event handling. You can specify priorities when subscribing to events, ensuring that listeners with higher priorities are called before those with lower ones. For example, in a logging system, critical error handlers might have a higher priority than general logging handlers.

Here's how to use priority handling:

```typescript
type TestEvents = {
  testEvent: (val: string) => string;
};

const emitter = new Emitter<TestEvents>();

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
```

These are just simple examples to illustrate the type of scenarios where the <code>Emitter</code> can be used. Depending on your application, you can define more complex events and handlers to fit your needs...