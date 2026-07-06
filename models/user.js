module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    clerkUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    freezeTableName: true,
  });

  User.associate = function (models) {
    User.hasMany(models.WebhookSubscription, {
      foreignKey: 'userId',
      as: 'subscriptions',
    });
  };

  return User;
};
