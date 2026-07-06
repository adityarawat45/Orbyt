module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clerkUserId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.addColumn('webhooksubscriptions', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('webhooksubscriptions', 'eventTypes', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: ['issues'],
    });

    try {
      await queryInterface.removeIndex('webhooksubscriptions', ['repository']);
    } catch (error) {
      // Ignore if the index is not present.
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('webhooksubscriptions', 'eventTypes');
    await queryInterface.removeColumn('webhooksubscriptions', 'userId');
    await queryInterface.dropTable('users');
  },
};
