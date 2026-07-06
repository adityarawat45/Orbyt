module.exports = (sequelize, DataTypes) => {
  const WebhookSubscription = sequelize.define('WebhookSubscription', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repository: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['issues'],
    },
    githubWebhookSecret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Orbyt',
    },
    discordAvatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'webhooksubscriptions',
    freezeTableName: true,
  });

  WebhookSubscription.associate = function (models) {
    WebhookSubscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return WebhookSubscription;
};
