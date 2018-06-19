/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_test_org', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		parent_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		parent_ids: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(20),
			allowNull: true
		}
	}, {
		tableName: 'sys_test_org',
		timestamps: false,
		freezeTableName: true
	});
};
