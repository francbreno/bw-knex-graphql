const gql = require('graphql-tag');
const humps = require('humps');

exports.type = gql`
  """ Represents an account money operation """
  type Entry {
    """ Entry identifier """
    id: Int!
    """ Entry value: In(+), Out(-) """
    value: Float!
    """ Account related """
    account: Account
    """ Transaction that entry participate """
    transaction: Transaction

    """ Date entry was created """
    createdAt: Date
    """ Date entry was last updated """
    updatedAt: Date
  }
`;

exports.resolvers = {
  Entry: {
    account: (entry, _, { services: { accountsService } }) =>
      accountsService.getById(entry.accountId)
        .then(result => humps.camelizeKeys(result[0])),

    transaction: (entry, _, { services: { transactionsService }, loaders: { transactionByEntryIds } }) =>
      // transactionsService.getById(entry.transactionId)
      //   .then(result => humps.camelizeKeys(result[0])),
      transactionByEntryIds.load(entry.id)
  },
}