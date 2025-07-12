const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 1000]
    }
  },
  category: {
    type: DataTypes.ENUM('tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other'),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  size: {
    type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '6', '7', '8', '9', '10', '11', '12', 'One Size'),
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArrayOfUrls(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Images must be a non-empty array of URLs');
        }
        value.forEach(url => {
          if (typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error('Each image must be a valid URL');
          }
        });
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'swapped'),
    defaultValue: 'pending'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'items',
  timestamps: true
});

module.exports = Item;