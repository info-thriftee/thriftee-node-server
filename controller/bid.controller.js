const Querybuilder = require('../querybuilder/qb');
const tableName = "bids";
const qb = new Querybuilder('mysql').table(tableName);
const BaseController = require('./base.controller');


/**
 * Functions
*/

export const getBid = async (uuid) => {
  let res = await qb.select().where({uuid: uuid}).call();
  return res ? res[0] : null;
}
export const save = async (bid) => {
  let res = await qb.insert().set(bid).call();
  return res;
}

export const update = async () => {
  let res = await qb.update().set(bid).call();
  return res;
}

export const remove = async (uuid) => {
  let res = await qb.delete().where({uuid: uuid}).call();
  return res;
}

export const getHighestBid = async (bidding) => {
  let res = await qb.select()
    .where({bidding: bidding})
    .order({amount: "DESC"})
    .call();
  
  return res ? res[0] : null;
}

export const getTotalBids = async (bidding) => {
  let res = await qb.count()
    .where({bidding: bidding})
    .call();

  return res ? res[0].count : null;
}

export const getAllBidsOfCustomer = async (customer) => {
  let res = await qb.select()
    .fields(['bids.*'])
    .leftJoin(['biddings', 'bids.bidding', 'biddings.uuid'])
    .where({customer: customer})
    .order({date: "DESC"})
    .group(["bidding"])
    .call();

  let bids = [];
  
  for(let item of res) {

    let bidding = await BaseController.getItem('biddings', {uuid: item.bidding});
    let product = await BaseController.getItem('products', {uuid: bidding.product});

    let image = await BaseController.getItem('productimages', {product: product.uuid});
    product.image = image.path;
    
    let store = await BaseController.getItem('stores', {uuid: product.store});

    let highestBid = await getHighestBid();

    let arr_item = {
      bidding: bidding,
      product: product,
      store: store,
      bids: item,
      highest: highestBid
    }

    bids = [...bids, arr_item];
    
  }

  return bids;
}

export const getBidsOfProduct = async (product) => {
  let res = await qb.select()
    .join(['biddings', 'bids.bidding', 'biddings.uuid'])
    .where({product: product})
    .call();

  return res;
}

export const getHighestBidOfProduct = async (product) => {
  let res = await qb.select()
    .join(['biddings', 'bids.bidding', 'biddings.uuid'])
    .where({product: product})
    .order({amount: "DESC"})
    .call();

  return res ? res[0] : null;
}