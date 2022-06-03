const initStore = require('./store');

module.exports = initRoutes = (router) => {
  initStore(router);
}