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

const services = {
  usersService,
  accountsService,
  entriesService,
  transactionsService,
};

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const mode = process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';

const app = express();

const setGraphqlDataloaders = (req, res, next) => {
  req.dataloaders = {
    usersByIds: new Dataloader(usersService.getUsersByIdList),
    accountsByUserIds: new Dataloader(accountsService.getAccountsByUserIdList),
    accountsByIds: new Dataloader(accountsService.getAccountsByIdList),
    entriesByAccountIds: new Dataloader(entriesService.getEntriesByAccountIdList),
    transactionsByIds: new Dataloader(transactionsService.getTransactionByOriginAccountIdList),
    transactionByEntryIds: new Dataloader(transactionsService.getTransactionByEntryIdList),
  };

  next();
};

const graphqlMiddleware = graphqlExpress((req, res) => ({
    schema,
    context: {services, loaders: req.dataloaders},
    debug: isDev
  }));

function startGraphqlServer(server) {
  const middlewares = [bodyParser.json()]
  isDev && middlewares.push(knexLogger(db))
  middlewares.push(setGraphqlDataloaders);
  middlewares.push(graphqlMiddleware);

  server.use(
    '/graphql',
    middlewares
  );

  server.use(
    '/graphiql',
    graphiqlExpress({endpointURL: '/graphql'})
  );

  server.listen(SERVER_PORT, () => {
    console.log(`Server is up and running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`);
  });
}

startGraphqlServer(app);