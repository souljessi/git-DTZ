/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('test_tree', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		parent_ids: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		parent_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'test_tree',
		timestamps: false,
		freezeTableName: true
	});
};
