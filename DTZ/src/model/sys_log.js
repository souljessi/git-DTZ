/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_log', {
		id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			primaryKey: true
		},
		type: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			defaultValue: '1'
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: ''
		},
		create_by: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		remote_addr: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		user_agent: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		request_uri: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		method: {
			type: DataTypes.STRING(5),
			allowNull: true
		},
		params: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		exception: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'sys_log',
		timestamps: false,
		freezeTableName: true
	});
};
