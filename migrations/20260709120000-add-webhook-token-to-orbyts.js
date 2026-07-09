'use strict';

const { randomUUID } = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orbyts', 'webhookToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    const [rows] = await queryInterface.sequelize.query('SELECT id FROM orbyts');

    for (const row of rows) {
      await queryInterface.sequelize.query(
        'UPDATE orbyts SET webhookToken = :token WHERE id = :id',
        { replacements: { token: randomUUID(), id: row.id } },
      );
    }

    await queryInterface.changeColumn('orbyts', 'webhookToken', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addIndex('orbyts', ['webhookToken'], {
      unique: true,
      name: 'orbyts_webhook_token_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('orbyts', 'orbyts_webhook_token_unique');
    await queryInterface.removeColumn('orbyts', 'webhookToken');
  },
};
