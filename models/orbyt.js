module.exports = (sequelize, DataTypes) => {
  const Orbyt = sequelize.define('Orbyt', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repository: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sourceProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'github',
    },
    sourceWebhookSecret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'discord',
    },
    destinationWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Orbyt',
    },
    destinationAvatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eventTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['issues'],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'orbyts',
    freezeTableName: true,
  });

  Orbyt.associate = function (models) {
    Orbyt.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Orbyt.hasMany(models.OrbytEvent, {
      foreignKey: 'orbytId',
      as: 'events',
    });
  };

  return Orbyt;
};
