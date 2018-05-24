INSERT INTO users(name, password_hash) VALUES ('Breno', 'asdjkasd01231480qwdjkasd0923iras')

INSERT INTO accounts(name, user_id, parent_account_id) VALUES ('Assets', 1, null);
INSERT INTO accounts(name, user_id, parent_account_id) VALUES ('Liabilities', 1, null);
INSERT INTO accounts(name, user_id, parent_account_id) VALUES ('Expenses', 1, null);
INSERT INTO accounts(name, user_id, parent_account_id) VALUES ('Incomes', 1, null);
INSERT INTO accounts(name, user_id, parent_account_id) VALUES ('Equity', 1, null);

INSERT INTO transactions(description, value) values ('05/2018 Rent')

-- up to level 3 accounts balance (not cummulative :-()
select balance1, t1Id, t1Name, lvl1, balance2, t2Id, t2Name, lvl2, t3.id, sum(e3.value) balance3 , t3.name, '3' lvl3
from (select balance1, t1.id t1Id, t1.name t1Name, lvl1, sum(e2.value) balance2, t2.id t2Id, t2.name t2Name, '2' lvl2
	  from (select sum(entries.value) balance1, accounts.id, accounts.name, 'root' lvl1
			from accounts
			left join entries on entries.account_id = accounts.id
			where parent_account_id is null
		   	group by accounts.id, accounts.name, lvl1) t1
	  left outer join accounts t2 on t2.parent_account_id = t1.id
	  left join entries e2 on e2.account_id = t2.id
	  group by balance1, t1Id, t1Name, lvl1, t2Id, t2Name, lvl2) t2
left outer join accounts t3 on t3.parent_account_id = t2Id
left join entries e3 on e3.account_id = t3.id
group by balance1, t1Id, t1Name, lvl1, balance2, t2Id, t2Name, lvl2, t3.id, t3.name, lvl3
order by t1Name;

-- up to level 3 accounts
select t1Id, t1Name, lvl1, t2Id, t2Name, lvl2, t3.id, t3.name, '3' lvl3 
from (select t1.id t1Id, t1.name t1Name, lvl1, t2.id t2Id, t2.name t2Name, '2' lvl2
	  from (select id, name, 'root' lvl1
			from accounts
			where parent_account_id is null) t1
	  left outer join accounts t2 on t2.parent_account_id = t1.id) t2
left outer join accounts t3 on t3.parent_account_id = t2Id;