const orderedByKey = require('../utils/orderedByKey');

module.exports = crudBuilder => {
  const crudServices = crudBuilder('transactions');

  const getLast = () =>
    crudServices.query()
      .limit(1)
      .orderBy('executed_at', 'desc');

  const getTransactionsByOriginAccountId = (id) =>
    crudServices.getAll().where('origin_account_id', id);

  const getTransactionByOriginAccountIdList = (ids) =>
    crudServices.getAll().whereIn('origin_account_id', ids);

  const getTransactionByEntryIdList = (ids) =>
    crudServices.getAll().rightJoin('entries', {'transactions.id': 'entries.transaction_id'})
      .select(
        'transactions.id as id', 
        'transactions.value as value', 
        'transactions.description as description', 
        'transactions.created_at as created_at', 
        'transactions.updated_at as updated_at', 
        'transactions.executed_at as executed_at', 
        'transactions.origin_account_id as origin_account_id', 
        'transactions.destiny_account_id as destiny_account_id', 
        'entries.id as entry_id')
      .whereIn('entries.id', ids).then(rows =>
        orderedByKey(rows, ids, 'entryId', true)
      );

  return {
    ...crudServices,
    getLast,
    getTransactionsByOriginAccountId,
    getTransactionByOriginAccountIdList,
    getTransactionByEntryIdList
  };
};