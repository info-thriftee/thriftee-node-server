const db = require("../db/connection");
const baseUri = "/api/bidding";
const moment = require('moment');

const Querybuilder = require('../querybuilder/qb');
const tableName = "biddings";
const qb = new Querybuilder('mysql').table(tableName);

export const update = async (bidding, changes) => {
  let result = await qb.update().set(changes).call();
  return result;
}

export const getBidding = async (uuid) => {
  let bidding = await qb.select().where({uuid: uuid}).call();
  return bidding ? bidding[0] : null;
}

export const checkStatus = (uuid) => {

  let result = qb.select().where({
    uuid: uuid
  }).call();

  let bidding = result[0];

  let current_time = new Date();
  let start_time = moment(bidding.start_time).toDate();
  let end_time = moment(bidding.end_time).toDate();

  if(bidding.status === "waiting") {
    if(current_time >= end_time) {
      qb.update().set({status: 'ended'}).call()
    }
    else if(current_time >= start_time) {
      qb.update().set({status: 'on_going'}).call()
    }
  }
  else if(bidding.status === "on_going") {
    if(current_time >= end_time) {
      qb.update().set({status: 'ended'}).call()
    }
  }

}