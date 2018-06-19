/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_user', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		realname: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		job_no: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		org_id: {
			type: DataTypes.INTEGER(36),
			allowNull: true
		},
		birth: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		duties: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		pic_path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING(4),
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING(32),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		user_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		last_login_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		login_ip: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		login_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		is_login: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		update_by: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		remarks: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'sys_user',
		timestamps: false,
		freezeTableName: true
	});
};
