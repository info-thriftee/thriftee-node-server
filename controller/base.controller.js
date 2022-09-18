const Querybuilder = require('../querybuilder/qb');
const tableName = "bids";
const qb = new Querybuilder('mysql');


/**
 * Functions
*/

export const getCollection = async (tableName, condition) => {
  let res = await qb.select().table(tableName).where(condition).call();
  return res ? res[0] : null;
}

export const getItem = async (tableName, condition) => {
  let res = await qb.select().table(tableName).where(condition).call();
  return res ? res[0] : null;
}

export const checkItem = async (tableName, condition) => {
  let res = await qb.select().table(tableName).where(condition).call();
  return res ? true : false;
}

export const saveItem = async (tableName, data) => {
  let res = await qb.insert().table(tableName).set(data).call();
  return res;
}

export const updateItem = async (tableName, changes) => {
  let res = await qb.update().table(tableName).where({uuid: uuid}).set(changes).call();
  return res;
}

export const deleteItem = async (tableName, condition) => {
  let res = await qb.delete().table(tableName).where(condition).call();
  return res;
}