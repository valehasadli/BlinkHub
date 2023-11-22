const Emitter = require('../dist/core/Emitter').default;

const userEmitter = new Emitter();

// High-priority listener for userLoggedIn
userEmitter.subscribe('userLoggedIn', (username) => {
    console.log(`[High Priority] ${username} logged in`);
}, 100);

// Medium-priority listener for userLoggedIn
userEmitter.subscribe('userLoggedIn', (username) => {
    for (let i = 0; i < 1000; i++) {} // Simulate processing delay
    console.log(`[Medium Priority] Welcome message sent to ${username}`);
}, 50);

// Low-priority listener for userLoggedIn
userEmitter.subscribe('userLoggedIn', (username) => {
    for (let i = 0; i < 10000; i++) {} // Simulate heavier task
    console.log(`[Low Priority] Analytics updated for ${username}`);
}, 10);

// Additional listeners for systemCheck and dataUpdate
userEmitter.subscribe('systemCheck', (message) => {
    console.log(`[System Check] ${message}`);
});

userEmitter.subscribe('dataUpdate', (message) => {
    console.log(`[Data Update] ${message}`);
});

console.time('emitLoop');

// Emitting a mix of events
for (let i = 0; i < 1000000; i++) {
    userEmitter.emit('userLoggedIn', `User${i}`);
    if (i % 100 === 0) {
        userEmitter.emit('systemCheck', `System Check at ${i}`);
        userEmitter.emit('dataUpdate', `Data Update at ${i}`);
    }
}

console.timeEnd('emitLoop');

module.exports = Emitter;
