// Initializes the `campanhas` service on path `/campanhas`
const createService = require('feathers-knex');
const createModel = require('../../models/campanhas.model');
const hooks = require('./campanhas.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'campanhas',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/campanhas', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('campanhas');

  service.hooks(hooks);
};
  