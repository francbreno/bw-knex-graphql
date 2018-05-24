const orderedByKey = require('../utils/orderedByKey');

module.exports = crudBuilder => {
  const crudServices = crudBuilder('entries');

  const getAccountEntries = (account) =>
    crudServices.query()
      .where('account_id', account.id);

  const getEntriesBytransactionId = (id) =>
    crudServices.getAll().where('transaction_id', id);
  
  const getEntriesBytransactionIdList = (ids) =>
    crudServices.getAll().whereIn('transaction_id', ids).then(rows =>
      orderedByKey(rows, ids, 'transactionId', false)
    );

  const getEntriesByAccountIdList = (ids) =>
    crudServices.getAll().whereIn('account_id', ids).then(rows =>
      orderedByKey(rows, ids, 'accountId', false)
    );

  return {
    ...crudServices,
    getAccountEntries,
    getEntriesBytransactionId,
    getEntriesBytransactionIdList,
    getEntriesByAccountIdList
  };
};