const baseUri = "/api/store";
const Router = require('../routes/Router');
const StoreController = require('../controller/store.controller');

module.exports = initStore = (app) => {

  const router = new Router(app);

  router.get(baseUri + '/list', StoreController.getCollection);
  //router.post(baseUri + '/get', StoreController.getItem);

  // router.get(baseUri + '/list', async (req, res) => {
  //   try {

  //     let result = await qb.select()
  //       .fields("store_name as name")
  //       .table("stores")
  //       .limit(0)
  //       .order({
  //         store_name: 1
  //       })
  //       .call()

  //     res.json(result);

  //   } catch (error) {
  //     console.error(error);
  //     res.sendStatus(500);
  //   }
  // });

  // router.get(baseUri + '/all', async (req, res) => {

  //   let sql = "SELECT stores.store_name, stores.uuid, stores.store_id, Count(DISTINCT ratings.uuid) as rating_count, Count(DISTINCT products.uuid) as count, AVG(ratings.rate) as rating FROM stores LEFT JOIN ratings ON stores.uuid = ratings.store LEFT JOIN products ON  products.store = stores.uuid WHERE stores.status = 1 GROUP BY stores.uuid ORDER BY stores.store_name"

  //   try {
  //     let result = await db(sql);
  //     res.json(result);
  //   } catch (error) {
  //     console.log(error);
  //     res.sendStatus(500);
  //   }
  // });

  // /*
  // *POST
  // */

  // router.post(baseUri + '/get', async (req, res) => {
  //   let sql = "SELECT stores.*, Count(DISTINCT ratings.uuid) as rating_count, Count(DISTINCT products.uuid) as product_count, Count(DISTINCT products.status) as active_bidding_count, AVG(ratings.rate) as rating FROM stores LEFT JOIN ratings ON stores.uuid = ratings.store LEFT JOIN products ON  products.store = stores.uuid WHERE stores.store_id = '"+req.body.store_id+"' GROUP BY stores.uuid"

  //   db.query(sql, (err, result) => {
  //     if(err){
  //         console.log(err);
  //         res.sendStatus(500);
  //     }
  //     else{
  //       res.json(result);
  //     }
  //   });

  // });

  // router.post(baseUri + '/products', async (req, res) => {

  //   let sql = qb
  //     .table("products")
  //     .where({
  //       store: req.body.store
  //     })
  //     .order({
  //       name: 1
  //     })
  //     .limit(0)
  //     .call();

  //   res.json(sql);

  //   // db.query(sql, (err, result) => {
  //   //   if(err){
  //   //       console.log(err);
  //   //       res.sendStatus(500);
  //   //   }
  //   //   else{
  //   //     res.json(result);
  //   //   }
  //   // });

  // });

  // router.post(baseUri + '/update', async (req, res) => {
  //   let sql = qb
  //     .update({
  //       store_name: req.body.store_name
  //     })
  //     .table("stores")
  //     .where({
  //       uuid: req.body.uuid
  //     })
  //     .call()

  //   db.query(sql, (err, result) => {
  //     if(err){
  //         console.log(err);
  //         res.sendStatus(500);
  //     }
  //     else{
  //       res.json(result);
  //     }
  //   });
  // });


  /*
  *
  *END
  * 
  */
}