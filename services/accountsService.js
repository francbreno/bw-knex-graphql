const orderedByKey = require('../utils/orderedByKey');

module.exports = crudBuilder => {
  const crudServices = crudBuilder('accounts');

  const getAccountsByIdList = (ids) =>
    crudServices.getAll().whereIn('id', ids).then(rows =>
      orderedByKey(rows, ids, 'id', true)
    );

  const getAccountsByUserId = (id) =>
    crudServices.getAll().where('user_id', id);

  const getAccountsByUserIdList = (ids) =>
    crudServices.getAll().whereIn('user_id', ids).then(rows =>
      orderedByKey(rows, ids, 'userId', false)
    );

  return {
    ...crudServices,
    getAccountsByIdList,
    getAccountsByUserId,
    getAccountsByUserIdList
  };
};