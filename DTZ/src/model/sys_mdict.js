/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_mdict', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		parent_id: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		parent_ids: {
			type: DataTypes.STRING(2000),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(100),
			allowNull: true
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
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'sys_mdict',
		timestamps: false,
		freezeTableName: true
	});
};
