const User = require('./User');
const Snippet = require('./Snippet');

// relations
User.hasMany(Snippet, { foreignKey: 'userId' });
Snippet.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = { User, Snippet };
