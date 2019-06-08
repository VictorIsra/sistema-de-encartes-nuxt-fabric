const assert = require('assert');
const app = require('../../src/app');

describe('\'produtos\' service', () => {
  it('registered the service', () => {
    const service = app.service('produtos');

    assert.ok(service, 'Registered the service');
  });
});
