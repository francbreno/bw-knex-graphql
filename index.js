const express = require('express');
const bodyParser = require('body-parser');
const knexLogger = require('knex-logger');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const Dataloader = require('dataloader');

const db = require('./db/connect')();
const crudServices = require('./db/knexDB')(db);
const serviceFactory = require('./serviceFactory')(crudServices);

const usersService = require('./services/usersService')(crudServices);
const accountsService = require('./services/accountsService')(crudServices);
const transactionsService = require('./services/transactionsService')(crudServices);
const entriesService = require('./services/entriesService')(crudServices);

const schema = require('./api/schema');

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const app = express();

function startGraphqlServer(server) {
  server.use(
    '/graphql',
    bodyParser.json(),
    knexLogger(db),
    (req, res) => {
      const services = {
        usersService,
        accountsService,
        entriesService,
        transactionsService,
      };
      const loaders = {
        usersByIds: new Dataloader(usersService.getUsersByIdList),
        accountsByUserIds: new Dataloader(accountsService.getAccountsByUserIdList),
        accountsByIds: new Dataloader(accountsService.getAccountsByIdList),
        entriesByAccountIds: new Dataloader(entriesService.getEntriesByAccountIdList),
        transactionsByIds: new Dataloader(transactionsService.getTransactionByOriginAccountIdList),
        transactionByEntryIds: new Dataloader(transactionsService.getTransactionByEntryIdList),
      };
      graphqlExpress({
        schema,
        context: {services, loaders},
        debug: true
      }
    )(req, res)}
  );

  server.use(
    '/graphiql',
    graphiqlExpress({ endpointURL: '/graphql' })
  );

  server.listen(SERVER_PORT, () => {
    console.log(`Server is up on port ${SERVER_PORT}`);
  });
}

startGraphqlServer(app);