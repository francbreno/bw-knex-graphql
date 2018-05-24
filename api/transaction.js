const gql = require('graphql-tag');
const humps = require('humps');

exports.type = gql`
  extend type Query {
    lastTransaction: Transaction
  }

  """ represents a transfer operation between 2 accounts """
  type Transaction {
    """ Transaction identifier """
    id: Int!
    """ Value of the operation """
    value: Float!
    """ Details of the transaction """
    description: String!
    """ Date where the transaction was execute (null if 'open') """
    executedAt: Date
    """ Account from where to take money from """
    originAccount: Account
    """ Account that will receive the originAccount taken money """
    destinyAccount: Account!

    """ Date transaction was created """
    createdAt: Date
    """ Date transaction was last updated """
    updatedAt: Date
  }
`;

exports.resolvers = {
  Transaction: {
    originAccount: (transaction, _, { services: { accountsService }, loaders: { accountsByIds } }) =>
      // transaction.originAccountId ? accountsService.getById(transaction.originAccountId)
      //   .then(result => humps.camelizeKeys(result[0])) : undefined,
      transaction.originAccountId ? 
        accountsByIds.load(transaction.originAccountId) : undefined,

    destinyAccount: (transaction, _, { services: { accountsService }, loaders: { accountsByIds } }) =>
      // accountsService.getById(transaction.destinyAccountId)
      //   .then(result => humps.camelizeKeys(result[0])),
      accountsByIds.load(transaction.destinyAccountId),
  },
  Query: {
    lastTransaction: (_, __, { services: { transactionsService } }) => 
      transactionsService.getLast()
        .then(result => humps.camelizeKeys(result[0]))
  }
}