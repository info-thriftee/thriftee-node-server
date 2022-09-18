const StoreController = require('../controller/store.controller');
const Router = require('../routes/Router');

/**
 * Controllers
 */
const store = new StoreController();

module.exports = initApi = (app) => {

  const router = new Router(app);

  router.get('/api/store/list', store.getCollection);
  router.post('/api/store/get', store.getItem);
}