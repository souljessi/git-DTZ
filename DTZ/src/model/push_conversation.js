/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('push_conversation', {
		targetId: {
			type: DataTypes.CHAR(50),
			allowNull: false,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		icon: {
			type: DataTypes.STRING(100),
			allowNull: true
		}
	}, {
		tableName: 'push_conversation',
		timestamps: false,
		freezeTableName: true
	});
};
