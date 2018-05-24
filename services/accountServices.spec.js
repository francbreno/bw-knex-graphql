const db = require('./../db/connect')();
const accountsService = require('./accountsService')(db);

describe('accountsService', () => {
  const userId = 3;

  beforeEach(() => {

  });

  it('should return all user accounts', async () => {
    const expectedAccountsIds = [
      13, 14, 15, 16, 17, 19, 20, 
      21, 22, 23, 24, 26, 27, 28, 29
    ];
    const accounts = await accountsService.allUserAccounts(userId);
   
    expect(accounts.length).toBe(15);
    expect(accounts.map(account => account.id)).toEqual(
      expect.arrayContaining(expectedAccountsIds)
    );
  });
});