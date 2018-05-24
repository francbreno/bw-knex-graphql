const gql = require('graphql-tag');
const humps = require('humps');

exports.type = gql`
  extend type Query {
    account(id: Int!): Account
    accounts: [Account]
  }

  extend type Mutation {
    createAccount(data: NewAccount!): Account
  }

  input NewAccount {
    name: String
    userId: Int
  }

  """ An accounting account where to put / take money """
  type Account {
    """ Account identifier """
    id: Int!
    """ Account name """
    name: String!
    """ The owner of the account """
    user: User
    """ All account entries """
    entries: [Entry]

    """ Date account was created """
    createdAt: Date
    """ Date account was last updated """
    updatedAt: Date
  }
`;

exports.resolvers = {
  Account: {
    user: (account, _, { services: { usersService } }) =>
      usersService.getById(account.userId)
        .then(result => humps.camelizeKeys(result[0])),
    entries: (account, _, { services: { entriesService }, loaders: { entriesByAccountIds } }) =>
      // entriesService.getAccountEntries(account).then(result => humps.camelizeKeys(result))
      entriesByAccountIds.load(account.id)
  },
  Query: {
    account: (_, { id }, { services: { accountsService } }) => 
      accountsService.getById(id).then(result => humps.camelizeKeys(result[0])),

    accounts: (_, __, { services: { accountsService } }) =>
      accountsService.getAll().then(result => humps.camelizeKeys(result))
  }
}