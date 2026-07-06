module.exports = (sequelize, DataTypes) => {
  const OrbytEvent = sequelize.define('OrbytEvent', {
    orbytId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'issue',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'orbyt_events',
    freezeTableName: true,
  });

  OrbytEvent.associate = function (models) {
    OrbytEvent.belongsTo(models.Orbyt, {
      foreignKey: 'orbytId',
      as: 'orbyt',
    });
  };

  return OrbytEvent;
};
