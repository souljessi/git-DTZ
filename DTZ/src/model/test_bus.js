/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('test_bus', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: true,
			references: {
				model: 'sys_user',
				key: 'id'
			}
		}
	}, {
		tableName: 'test_bus',
		timestamps: false,
		freezeTableName: true
	});
};
