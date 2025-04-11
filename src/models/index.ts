// models/index.ts
import User from './User';
import BankStatement from './BankStatement';
import Transaction from './Transaction';

// A Transaction may be assigned to one User.
Transaction.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignee',
});
User.hasMany(Transaction, {
  foreignKey: 'assignedTo',
  as: 'assignedTransactions',
});

// A Transaction belongs to one BankStatement.
Transaction.belongsTo(BankStatement, {
  foreignKey: 'bankStatementId',
  as: 'bankStatement',
});
BankStatement.hasMany(Transaction, {
  foreignKey: 'bankStatementId',
  as: 'transactions',
});

export { User, BankStatement, Transaction };
