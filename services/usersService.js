const orderedByKey = require('../utils/orderedByKey');

module.exports = crudBuilder => {
  const crudServices = crudBuilder('users');

  const getUsersByIdList = (ids) =>
  crudServices.getAll().whereIn('id', ids).then(rows =>
    orderedByKey(rows, ids, 'id')
  );

  return {
    ...crudServices,
    getUsersByIdList
  };
};