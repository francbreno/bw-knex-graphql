// exports.insert = connection => tableName => data => connection(tableName).insert(data);
// exports.selectById = connection => tableName => id => connection(tableName).where('id', id);
// exports.selectAll = connection => tableName => () => connection(tableName)
// exports.update = connection => tableName => (id, data) => connection(tableName).where('id', '=', id).update(data);
// exports.delete = connection => tableName => id => connection(tableName).where('id', '=', id).delete();
// module.exports = knex => tableName => {
//   const table = knex(tableName);

//   return {
//     byId: id => table.where('id', id),
//     all: () => table,
//     create: account => table.insert(account),
//     update: (id, data) => table.where('id', id).update(data),
//     delete: id => table.where('id', id).delete,
//   }
// };

module.exports = knex => tableName => ({
  create(data) {
    return knex(tableName).insert(data);
  },
  getById(id) {
    return knex(tableName).where({id});
  },
  getAll() {
    return knex(tableName);
  },
  update(id, data) {
    return knex(tableName).where({id}).update(data);
  },
  delete(id) {
    return knex(tableName).where({id}).delete();
  },
  fromjoin(joinTableName, joinClause) {
    return knex(tableName).leftJoin(joinTableName, {[`${tableName.id}`]: `${joinTableName.id}`}).select(`${joinTableName}.*`)
  },
  query() {
    return knex(tableName);
  },
  executeQuery(sql) {
    return null;
  },
});