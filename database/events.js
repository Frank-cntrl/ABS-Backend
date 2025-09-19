const { DataTypes } = require("sequelize");
const db = require("./db");

const Event = db.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event title cannot be empty'
      },
      len: {
        args: [3, 255],
        msg: 'Event title must be between 3 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event description cannot be empty'
      }
    }
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event location cannot be empty'
      }
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Image must be a valid URL'
      }
    }
  },
  rsvpLink: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'RSVP link must be a valid URL'
      }
    }
  }
});

module.exports = Event;