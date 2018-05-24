const db = require('./db/connect')();
const crudServices = require('./db/knexDB')(db);
const serviceFactory = require('./serviceFactory')(crudServices);

const App = function(serviceFactory) {
  const accountsService = serviceFactory('accounts');
  const usersService = serviceFactory('users');
  
  return {
    getAllAccounts: () => accountsService.getAll(),
    getAllUsers: () => usersService.getAll(),
    getUser: (id) => usersService.getById(id),
  }
}

const myApp = new App(serviceFactory);
myApp.getAllAccounts().then(console.log);
myApp.getAllUsers().then(console.log);
myApp.getUser(1).then(console.log);
