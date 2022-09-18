const Querybuilder = require('../querybuilder/qb');
const tableName = "biddings";
const qb = new Querybuilder('mysql').table(tableName);


/**
 * Functions
*/

export const getProduct = (uuid) => {
  let res = qb.select().where({uuid: uuid}).call();
  return res ? res[0] : null;
}