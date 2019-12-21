module.exports = (sequelize, DataTypes) => {
  const itemsEvents = sequelize.define('itemsEvents', {
    itemId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    childId: {
      type: DataTypes.INTEGER,
    },
    event: {
      allowNull: false,
      type: DataTypes.ENUM('CREATED', 'REMOVED', 'RESTORED'),
    },
  });

  itemsEvents.associate = ({ items }) => {
    itemsEvents.belongsTo(items, { foreignKey: 'itemId' });
  };
  return itemsEvents;
};
