const Querybuilder = require('../querybuilder/qb');
const tableName = "bids";
const qb = new Querybuilder('mysql').table(tableName);


/**
 * Functions
*/

export const getBid = async (uuid) => {
  let res = qb.select().where({uuid: uuid}).call();
  return res ? res[0] : null;
}
export const save = async (bid) => {
  let res = qb.insert().set(bid).call();
  return res;
}

export const update = async () => {
  let res = qb.update().set(bid).call();
  return res;
}

export const remove = async (uuid) => {
  let res = qb.delete().where({uuid: uuid}).call();
  return res;
}

export const getHighestBid = async (bidding) => {
  let res = qb.select()
    .where({bidding: bidding})
    .order({amount: "DESC"})
    .call();
  
  return res ? res[0] : null;
}

export const getTotalBids = async (bidding) => {
  let res = qb.count()
    .where({bidding: bidding})
    .call();
    return res ? res[0].count : null;
}

export const getAllBidsOfCustomer = async (customer) => {
  let res = qb.select()
    .fields(['bids.*'])
    .leftJoin(['biddings', 'bids.bidding', 'biddings.uuid'])
    .where({customer: customer})
    .order({date: "DESC"})
    .group(["bidding"])
    .call();

    let bids = [];
    
    for(bid of res) {
      let bidding = Bidd
    }
}