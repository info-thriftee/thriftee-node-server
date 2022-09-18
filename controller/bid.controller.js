const db = require("../db/connection");
const Querybuilder = require('../querybuilder/qb');
const qb = new Querybuilder('mysql');
const baseUri = "/api/bid";
const tableName = "bids";


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