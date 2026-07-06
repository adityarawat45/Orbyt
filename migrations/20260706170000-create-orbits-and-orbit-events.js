module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orbits', {
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
      },
      sourceProvider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'github',
      },
      sourceWebhookSecret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destinationProvider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'discord',
      },
      destinationWebhookUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destinationUsername: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Orbyt',
      },
      destinationAvatarUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      eventTypes: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: ['issues'],
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.createTable('orbit_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orbitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orbits',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'issue',
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

    const [existingRows] = await queryInterface.sequelize.query('SELECT id, name, repository, githubWebhookSecret, discordWebhookUrl, discordUsername, discordAvatarUrl, userId, active, createdAt, updatedAt FROM webhooksubscriptions');

    if (existingRows.length) {
      for (const row of existingRows) {
        await queryInterface.sequelize.query(
          `INSERT INTO orbits (id, name, repository, sourceProvider, sourceWebhookSecret, destinationProvider, destinationWebhookUrl, destinationUsername, destinationAvatarUrl, userId, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            replacements: [
              row.id,
              row.name,
              row.repository,
              'github',
              row.githubWebhookSecret,
              'discord',
              row.discordWebhookUrl,
              row.discordUsername,
              row.discordAvatarUrl,
              row.userId,
              row.active,
              row.createdAt,
              row.updatedAt,
            ],
          },
        );
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orbit_events');
    await queryInterface.dropTable('orbits');
  },
};
