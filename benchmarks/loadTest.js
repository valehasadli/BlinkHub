const Emitter = require('../dist/core/Emitter').default;

const userEmitter = new Emitter();

userEmitter.subscribe('userLoggedIn', (username) => {
    console.log(`${username} logged in`);
});

console.time('emitLoop');

for (let i= 0; i < 1000000; i++) {
    userEmitter.emit('userLoggedIn', `User${i}`);
}

console.timeEnd('emitLoop');

module.exports = Emitter; // Or the appropriate export statement