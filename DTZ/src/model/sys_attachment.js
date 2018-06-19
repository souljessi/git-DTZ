/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_attachment', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		businesskey: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		file_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		file_size: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		extend: {
			type: DataTypes.STRING(32),
			allowNull: true
		},
		realpath: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		swfpath: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		user_id: {
			type: DataTypes.STRING(36),
			allowNull: true
		}
	}, {
		tableName: 'sys_attachment',
		timestamps: false,
		freezeTableName: true
	});
};
