module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('webhooksubscriptions');

    if (!tableExists) {
      await queryInterface.createTable('webhooksubscriptions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        repository: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        githubWebhookSecret: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        discordWebhookUrl: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        discordUsername: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Orbyt',
        },
        discordAvatarUrl: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('webhooksubscriptions');
  },
};
