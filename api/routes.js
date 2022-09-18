const initStore = require('./store');
const initBid = require('./bid');

module.exports = initRoutes = (router) => {
  initStore(router);
  initBid(router);
}