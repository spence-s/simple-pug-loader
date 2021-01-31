const test = require('ava');

const simplePugLoader = require('..');

test('exports a function', (t) => {
  t.is(typeof simplePugLoader, 'function');
});
