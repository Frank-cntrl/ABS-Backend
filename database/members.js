const { DataTypes } = require("sequelize");
const db = require("./db");

const Member = db.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Member name cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Member name must be between 1 and 255 characters'
      }
    }
  },
  age: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Age cannot be empty'
      },
      len: {
        args: [1, 50],
        msg: 'Age must be between 1 and 50 characters'
      }
    }
  },
  major: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Major cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Major must be between 1 and 255 characters'
      }
    }
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Role cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Role must be between 1 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description cannot be empty'
      },
      len: {
        args: [1, 2000],
        msg: 'Description must be between 1 and 2000 characters'
      }
    }
  },
  picture: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Picture must be a valid URL'
      }
    }
  }
}, {
  tableName: 'members',
  timestamps: true,
});

module.exports = Member;