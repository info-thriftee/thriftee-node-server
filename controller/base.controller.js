const Querybuilder = require('../querybuilder/qb');
const tableName = "bids";
const qb = new Querybuilder('mysql');


/**
 * Functions
*/

export const getItem = (tableName, uuid) => {
  let res = qb.select().table(tableName).where({uuid: uuid}).call();
  return res ? res[0] : null;
}

export const checkItem = (tableName, condition) => {
  let res = qb.select().table(tableName).where(condition).call();
  return res ? true : false;
}

export const saveItem = (tableName, data) => {
  let res = qb.insert().table(tableName).set(data).call();
  return res;
}

export const updateItem = (tableName, changes) => {
  let res = qb.update().table(tableName).where({uuid: uuid}).set(changes).call();
  return res;
}

export const deleteItem = (tableName, uuid) => {
  let res = qb.delete().table(tableName).where({uuid: uuid}).call();
  return res;
}