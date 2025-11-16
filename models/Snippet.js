const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Snippet = sequelize.define('Snippet', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  language: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.TEXT('long'), allowNull: false },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const raw = this.getDataValue('tags');
      return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
    },
    set(val) {
      if (Array.isArray(val)) this.setDataValue('tags', val.join(','));
      else this.setDataValue('tags', val);
    }
  },
  public: { type: DataTypes.BOOLEAN, defaultValue: true },
  forkedFromId: { type: DataTypes.INTEGER, allowNull: true }
}, {
  timestamps: true
});

module.exports = Snippet;
