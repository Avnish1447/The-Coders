const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');
const Swap = require('./Swap');

// Define associations
User.hasMany(Item, { foreignKey: 'userId', as: 'items' , onDelete: 'CASCADE', hooks: true });
Item.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

User.hasMany(Swap, { foreignKey: 'requesterId', as: 'requestedSwaps' });
User.hasMany(Swap, { foreignKey: 'ownerId', as: 'receivedSwaps' });



Item.hasMany(Swap, { foreignKey: 'itemId', as: 'swaps' });

Swap.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Swap.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Swap.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });


module.exports = {
  sequelize,
  User,
  Item,
  Swap
};