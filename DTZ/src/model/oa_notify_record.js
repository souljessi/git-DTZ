/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_notify_record', {
		id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			primaryKey: true
		},
		oa_notify_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		user_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		read_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		read_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'oa_notify_record',
		timestamps: false,
		freezeTableName: true
	});
};
