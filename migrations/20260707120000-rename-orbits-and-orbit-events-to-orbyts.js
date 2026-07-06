module.exports = {
  async up(queryInterface) {
    await queryInterface.renameTable('orbits', 'orbyts');
    await queryInterface.renameTable('orbit_events', 'orbyt_events');
    await queryInterface.renameColumn('orbyt_events', 'orbitId', 'orbytId');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('orbyt_events', 'orbytId', 'orbitId');
    await queryInterface.renameTable('orbyt_events', 'orbit_events');
    await queryInterface.renameTable('orbyts', 'orbits');
  },
};
