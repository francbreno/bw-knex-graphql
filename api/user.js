const gql = require('graphql-tag');

exports.type = gql`
  type Query {
    user(id: Int!): User
    users: [User]
  }

  type Mutation {
    createUser(data: NewUser!): User
  }

  input NewUser {
    name: String
  }

  """ A system user """
  type User {
    """ User identifier """
    id: Int!
    """ User system name """
    name: String!
    """ All user accounts """
    accounts: [Account]

    """ Date user was created """
    createdAt: Date
    """ Date user was last updated """
    updatedAt: Date
  }
`;

exports.resolvers = {
  User: {
    accounts: (user, _, { services: { accountsService }, loaders: { accountsByUserIds } }) => 
      accountsByUserIds.load(user.id)
  },
  Query: {
    user: (_, { id }, { services: { usersService }, loaders: { usersByIds } }) =>
      usersByIds.load(id),

    users: (_, __, { services: { usersService } }) => 
      usersService.getAll(),
  }
};