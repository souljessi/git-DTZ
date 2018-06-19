/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_role', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		rolename: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		enname: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		rolecode: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		useable: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		is_sys: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		data_scope: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		update_by: {
			type: DataTypes.STRING(36),
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
		auth_org_ids: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'sys_role',
		timestamps: false,
		freezeTableName: true
	});
};
