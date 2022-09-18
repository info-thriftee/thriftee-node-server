const Querybuilder = require('../querybuilder/qb');
const uuid = require('uuid');

class Controller {

  constructor (tableName) {
    this.tableName = tableName;
    this.qb = new Querybuilder('mysql').table(this.tableName);
    this.uuidV4 = uuid.v4;
  }

  getCollection = async () => {
    let res = await this.qb.select().call();
    return res ? res : null;
  }
  
  getItem = async (req) => {
    let res = await qb.select().where({uuid: req.uuid}).call();
    return res ? res[0] : null;
  }
  
  deleteItem = async (req) => {
    let res = await qb.delete().where({uuid: req.uuid}).call();
    return res;
  }

  checkItem = async (req) => {
    // let res = await qb.select().where(condition).call();
    // return res ? true : false;
  }
  
  saveItem = async (req) => {
    // let res = await qb.insert().set(req).call();
    // return res;
  }
  
  updateItem = async (req) => {
    // let res = await qb.update().where({uuid: uuid}).set(changes).call();
    // return res;
  }
}

module.exports = Controller;