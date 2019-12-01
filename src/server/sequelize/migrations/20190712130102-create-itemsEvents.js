module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('itemsEvents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    itemId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    childId: {
      type: Sequelize.INTEGER,
    },
    event: {
      allowNull: false,
      type: Sequelize.ENUM('CREATED', 'REMOVED', 'RESTORED'),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('itemsEvents'),
};
