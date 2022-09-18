const moment = require("moment");
const Controller = require("./Controller");

module.exports = class BiddingController extends Controller {

  constructor() {
    super('biddings');
  }

  getSpecificBiddingData = async () => {
    let res = await this.qb.raw(`
      SELECT
        products.product_id,
        products.name,
        stores.store_name,
        products.store,
        stores.uuid as store_uuid,
        productimages.path as image_path,

        biddings.uuid as bidding_uuid,
        biddings.minimum,
        biddings.increment,
        biddings.claim,
        biddings.start_time,
        biddings.end_time,
        biddings.status 

      FROM biddings

      INNER JOIN products
        ON biddings.product = products.uuid

      INNER JOIN stores
        ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
        ON productimages.product = products.uuid

      WHERE (biddings.status = 'on_going' OR biddings.status = 'waiting')
    `);

    return res;
  }

  getUpcomingBiddings = async () => {
    let res = await this.qb.raw(`
      SELECT
        biddings.*,
        products.product_id,
        products.name,
        products.description,
        products.store,
        stores.uuid as store_uuid,
        stores.store_name,
        productimages.path as image_path
      FROM biddings

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      WHERE biddings.status = 'waiting'

      GROUP BY biddings.uuid
      ORDER BY biddings.start_time ASC
    `)
  }

  getOnGoingBiddings = async () => {
    let res = await this.qb.raw(`
      SELECT
        biddings.*,
        products.product_id,
        products.name,
        products.description,
        products.store,
        stores.uuid as store_uuid,
        stores.store_name,
        productimages.path as image_path,
        mBids.highest as highest_bid,
        Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      LEFT OUTER JOIN (
          SELECT bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE biddings.status = 'on_going'

      GROUP BY biddings.uuid
      ORDER BY bid_count DESC
    `)

    return res;
  }

  getEndingBiddings = async () => {

    let current_time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let res = await this.qb.raw(`
      SELECT
        biddings.*,
        products.product_id,
        products.name,
        products.description,
        products.store,
        stores.uuid as store_uuid,
        stores.store_name,
        productimages.path as image_path,
        mBids.highest as highest_bid,
        Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      LEFT OUTER JOIN (
          SELECT bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE
          TIMESTAMPDIFF(minute, '${current_time}', biddings.end_time) >= 0 AND
          TIMESTAMPDIFF(minute, '${current_time}', biddings.end_time) < 1440 AND
          biddings.status = 'on_going'

      GROUP BY biddings.uuid
      ORDER BY biddings.start_time ASC
    `)

    return res;
  }

  getUpcomingBiddingsByStore = async (req) => {

    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          products.product_id,
          products.name,
          products.description,
          products.store,
          stores.uuid as store_uuid,
          stores.store_name,
          productimages.path as image_path
      FROM biddings

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      WHERE biddings.status = 'waiting' AND products.store='${req.store}'

      GROUP BY biddings.uuid
      ORDER BY biddings.start_time ASC
    `)
  }

  getStoreSoldProducts = async (req) => {
    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          products.product_id,
          products.name,
          products.description,
          products.store,
          stores.uuid as store_uuid,
          stores.store_name,
          productimages.path as image_path,
          mBids.highest as highest_bid,
          Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      LEFT OUTER JOIN (
          SELECT bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE biddings.status = 'success' AND products.store='${req.store}'

      GROUP BY biddings.uuid
      ORDER BY bid_count DESC
    `)
  }


  getOnGoingBiddingsByStore = async (req) => {
    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          products.product_id,
          products.name,
          products.description,
          products.store,
          stores.uuid as store_uuid,
          stores.store_name,
          productimages.path as image_path,
          mBids.highest as highest_bid,
          Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      LEFT OUTER JOIN (
          SELECT bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE biddings.status = 'on_going' AND products.store='${req.store}'

      GROUP BY biddings.uuid
      ORDER BY bid_count DESC
    `)

    return res;
  }

  getPopularBidding = async () => {
    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          products.product_id,
          products.name,
          products.description,
          products.store,
          stores.uuid as store_uuid,
          stores.store_name,
          productimages.path as image_path,
          mBids.highest as highest_bid,
          Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      LEFT OUTER JOIN (
          SELECT bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE biddings.status = 'on_going'

      GROUP BY biddings.uuid
      ORDER BY bid_count DESC
    `)
    return res;
  }

  getBiddingByProduct = async (req) => {
    let biddings = await this.qb.select().where({product: req.product}).first();
    
    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          mBids.uuid as highest_bid,
          Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      LEFT OUTER JOIN (
          SELECT uuid, bidding, MAX(amount) AS highest
          FROM bids
          GROUP BY bidding
      ) mBids
      ON mBids.bidding = biddings.uuid

      WHERE biddings.product = '${req.product}'

      GROUP BY biddings.uuid
      ORDER BY biddings.end_time DESC
    `);

    if(res.length > 0) {
      res = res[0];
      if(res.highest_bid) {
        highest = await this.qb.table('bids').where({uuid: res.highest_bid}).first();
        res.highest_bid = highest;
      }
      else {
        res.highest_bid = null;
      }
    }
    else {
      res = null;
    }

    return res;
  }

  getLatestBiddingByProduct = async (req) => {

    let bidding = this.qb.select().where({product: req.product})
      .order({created_at: 'DESC'}).first();

    let res = await this.qb.raw(`
      SELECT
          biddings.*,
          Count(bids.uuid) as bid_count
      FROM biddings

      LEFT JOIN bids
      ON biddings.uuid = bids.bidding

      WHERE biddings.product = '${req.product}'

      GROUP BY biddings.uuid
      ORDER BY biddings.end_time DESC
    `)

    if(res.length > 0) {
      res = res[0];
      highest = await this.qb.table('bids').where({uuid: res.highest_bid}).first();
      res.highest_bid = highest;
    }
    else {
      res = null;
    }
    return res;
  }

  getActiveBiddingByStore = async (req) => {
    let res = await this.qb.raw(`
      SELECT
        biddings.*,
        products.product_id,
        products.name,
        products.description,
        products.store,
        stores.uuid as store_uuid,
        stores.store_name,
        productimages.path as image_path
      FROM biddings

      INNER JOIN products
      ON biddings.product = products.uuid

      INNER JOIN stores
      ON products.store = stores.uuid

      LEFT JOIN (
          SELECT path, product, MIN(name) AS name FROM productimages GROUP BY product
      ) productimages
      ON productimages.product = products.uuid

      WHERE stores.uuid = '${req.store}' AND (biddings.status = 'waiting' OR biddings.status = 'on_going')

      GROUP BY biddings.uuid
      ORDER BY biddings.start_time ASC
    `)
    return res;
  }

  getBiddingsByStore = async (req) => {
    let res = await this.qb.select()
      .join(["products", "biddings.product", "products.uuid"])
      .where({store: req.uuid}).call();
    
    return res;
  }

  addBidding = async (req) => {
    let res = await this.qb.insert().set({
      uuid: this.uuidV4(),
      product: req.product,
      minimum: req.minimum,
      increment: req.increment,
      claim: req.claim,
      created_at: req.created_at,
      start_time: req.start_time,
      end_time: req.end_time,
      statusL: "waiting"
    }).call();

    return res;
  }

  updateBidding = async (req) => {
    let res = await this.qb.update().set({
      minimum: req.minimum,
      increment: req.increment,
      claim: req.claim,
      start_time: req.start_time,
      end_time: req.end_time,
      statusL: req.status
    }).where({uuid: req.uuid}).call();

    return res;
  }

  getBiddingWinner = async (req) => {
    let res = await this.qb.select().where([
      ['uuid', $req.bidding],
      ['status', '<>', 'no_bid'],
      ['status', '<>', 'claim_failed']
    ])
  }

} 