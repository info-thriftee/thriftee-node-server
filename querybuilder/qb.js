/**
 * @author: Marc Riegel <mail@marclab.de>
 * @update_by: Emerson Dalwampo <dalwampoemersons@gmail.com>
 * Date: 02.03.13
 * Time: 18:32
 *
 */

 const db = require("../db/connection");

const QueryBuilder = function (methodName) {

  this._raw = '';
  this._queryType = 'select';
  this._fields = '*';
  this._table = null;
  this._where = {};
  this._order = {};
  this._group = [];
  this._limit = 50;
  this._offset = 0;
  this._handler = null;
  this._set = {};
  this._join = [];
  this._rightJoin = [];
  this._leftJoin = [];

  this.processor = null;

  this._loadMethod(methodName);
};

QueryBuilder.prototype.raw = async function (query) {
  var result = await db(query);
  return result;
};

QueryBuilder.prototype.select = function (clause) {

  if (undefined !== clause) {
    this.where(clause);
  }

  this._queryType = 'select';

  return this;
};

QueryBuilder.prototype.count = function (clause) {

  if (undefined !== clause) {
    this.where(clause);
  }

  this._queryType = 'count';

  return this;
};

QueryBuilder.prototype.update = function (clause) {

  if (undefined !== clause) {
    this.set(clause);
  }

  this._queryType = 'update';

  return this;
};

QueryBuilder.prototype.delete = function (clause) {

  if (undefined !== clause) {
    this.where(clause);
  }

  this._queryType = 'delete';

  return this;
};

QueryBuilder.prototype.insert = function (clause) {

  if (undefined !== clause) {
    this.set(clause);
  }

  this._queryType = 'insert';

  return this;
};

QueryBuilder.prototype.call = async function () {

  var query = this.processor.query(this);
  var result = await db(query);
  return result;
};

QueryBuilder.prototype.first = async function () {

  var query = this.processor.query(this);
  var result = await db(query);

  if(result && result.length > 0) {
    return result[0];
  }
  else {
    return null;
  }
};

QueryBuilder.prototype.set = function (object) {

  this._set = object || {};

  return this;
};

QueryBuilder.prototype.fields = function (columns) {

  this._fields = columns;

  return this;
};

QueryBuilder.prototype.table = function (table) {

  this._table = table;

  return this;
};

QueryBuilder.prototype.where = function (clause) {

  this._where = clause;

  return this;
};

QueryBuilder.prototype.or = function (clause) {

  return this;
};

QueryBuilder.prototype.order = function (order) {

  this._order = order;

  return this;
};

QueryBuilder.prototype.join = function (join) {

  this._join = join;

  return this;
};

QueryBuilder.prototype.rightJoin = function (rightJoin) {

  this._rightJoin = rightJoin;

  return this;
};


QueryBuilder.prototype.leftJoin = function (leftJoin) {

  this._leftJoin = leftJoin;

  return this;
};

QueryBuilder.prototype.group = function (group) {

  this._group = group;

  return this;
};

QueryBuilder.prototype.limit = function (limit) {

  this._limit = limit;

  return this;
};

QueryBuilder.prototype.offset = function (offset) {

  this._offset = offset;

  return this;
};

QueryBuilder.prototype.handler = function (fnc) {

  this._handler = fnc;

  return this;
};

QueryBuilder.prototype.and = QueryBuilder.prototype.where;

QueryBuilder.prototype._loadMethod = function(methodName) {
    try {
        this.processor = require('./mysql');
    } catch(e) {
        throw "Method " + methodName + " corrupt: " + e;
    }
};


module.exports = QueryBuilder;