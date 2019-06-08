// Initializes the `produtos` service on path `/produtos`
const createService = require('feathers-knex');
const createModel = require('../../models/produtos.model');
const hooks = require('./produtos.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'produtos',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/produtos', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('produtos');

  service.hooks(hooks);
};
  