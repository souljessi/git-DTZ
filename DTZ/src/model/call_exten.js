/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('call_exten', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		exten: {
			type: DataTypes.STRING(10),
			allowNull: true
		},
		commissioner: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		note: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		sort: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'call_exten',
		timestamps: false,
		freezeTableName: true
	});
};
