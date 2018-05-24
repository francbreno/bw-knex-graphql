const { makeExecutableSchema } = require('graphql-tools');
const gql = require('graphql-tag');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const merge = require('lodash').merge;

const { type: User, resolvers: usersResolvers } = require('./user');
const { type: Account, resolvers: accountsResolvers } = require('./account');
const { type: Entry, resolvers: entriesResolvers } = require('./entry');
const { type: Transaction, resolvers: transactionsResolvers } = require('./transaction');

// const Query = gql`
//   type Query {
//     _fake: String
//   }

//   scalar Date
// `;

const baseSchema = gql`
  schema {
    query: Query
    mutation: Mutation
  }
  scalar Date
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return new String(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

const schema = makeExecutableSchema({
  typeDefs: [baseSchema, User, Account, Entry, Transaction],
  resolvers: merge( resolvers, usersResolvers, accountsResolvers, entriesResolvers, transactionsResolvers)
});

module.exports = schema;