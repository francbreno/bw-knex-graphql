// module.exports = crud => ({
//   create: data => crud.insert('accounts')(data),
//   get: id => crud.selectById('accounts')(id),
//   getAll: crud.selectAll('accounts'),
//   update: (id, data) => crud.update('accounts')(id, data),
//   remove: id => crud.delete('accounts')(id),
// });
const flow = require('lodash/fp').flow;

const fromTable = (tableName, alias) => query => query({[alias]: tableName});
const columns = columnsNames => query => query.select(columnsNames);
const withCondition = condition => query => query.where(condition);

const withTransactions = query => 
  query
    .leftJoin({'t': 'transactions'}, function() {
      this.on(function() {
        this.on('a.id', '=', 't.origin_account_id')
        this.orOn('a.id', '=', 't.destiny_account_id')
      })
    });

const belongigToUser = userId => query =>
  query
    .leftJoin({'u': 'users'}, { 'u.id': 'a.user_id' })
    .where('a.user_id', userId);

const withTransactionsCreatedBetween = (minDate, MaxDate) => query => {
  return query
    leftJoin({'t': 'transactions'}, {'a.id':'t.origin_account_id'})
    .where('t.created_at', '>=', minDate)
    .andWhere('t.created_at', '<=', maxDate);
}

const executedOnly = () => query => query.havingNotNull('origin_account_id');
const notExecutedOnly = () => query => query.havingNull('origin_account_id');

const withId = id => withCondition(function() {
  this.where('a.id', id);
});

const allAccounts = query =>
  flow(
    fromTable('accounts', 'a'),
    columns('a.*'),
  )(query);

const _allAccounts = query => () =>
  query({ a: 'accounts' })
  .columns('a.*');

const _account = query => id =>
  _allAccounts(query)
    .where('id', id);

const _allAccountTransactions = query => id =>
  _account()

const account = id => query =>
  flow(
    allAccounts,
    withId(id)
  )(query);

module.exports = query => ({
  allAccountTransactions: id =>
    flow(
      account(id),
      columns('t.*'),
      withTransactions
    )(query),

  allUserAccounts: userId =>
    flow(
      allAccounts,
      belongigToUser(userId),
    )(query),
});

// TODO - Group of Accounts
// ex.: Expenses 
// (
//    Car(
//      Gas, maintenance, leasing
//    ), 
//    House(
//      Rent, Taxes, Maintenance
//    ), 
//    Health(
//      Health Security Plan, Pharmacy, Exams
//    ), 
//    Education(
//      Books, College, Courses
//    )
//)
