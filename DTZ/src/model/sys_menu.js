/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_menu', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		parent_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		parent_ids: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		menu_level: {
			type: DataTypes.INTEGER(6),
			allowNull: true
		},
		menu_name: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		menu_order: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		menu_url: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		menu_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		menu_icon: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		menu_source: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		is_show: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		is_button: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		href: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		permission: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		comp_path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		is_crumb: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		}
	}, {
		tableName: 'sys_menu',
		timestamps: false,
		freezeTableName: true
	});
};
