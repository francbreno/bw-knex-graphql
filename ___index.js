const db = require('./db/connect')();
const accountsService = require('./services/accountsService')(db);

async function app(service) {
  const results = await service.allUserAccounts(3); // all accounts from user 3
  results.map(row => console.log(row));

  console.log('--------------------------------------------');

  const account = await service.allAccountTransactions(28);
  console.log(account);
}

app(accountsService);