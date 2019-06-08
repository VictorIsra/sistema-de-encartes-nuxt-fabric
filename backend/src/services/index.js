const campanhas = require('./campanhas/campanhas.service.js');
const users = require('./users/users.service.js');
const produtos = require('./produtos/produtos.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(campanhas);
  app.configure(users);
  app.configure(produtos);
};
