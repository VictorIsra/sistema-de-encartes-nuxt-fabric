const assert = require('assert');
const app = require('../../src/app');

describe('\'campanhas\' service', () => {
  it('registered the service', () => {
    const service = app.service('campanhas');

    assert.ok(service, 'Registered the service');
  });
});
