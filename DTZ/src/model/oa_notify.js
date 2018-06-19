/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_notify', {
		id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			primaryKey: true
		},
		type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		content: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		files: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		status: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			defaultValue: '0'
		},
		create_by: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		update_by: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		remarks: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.CHAR(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'oa_notify',
		timestamps: false,
		freezeTableName: true
	});
};
