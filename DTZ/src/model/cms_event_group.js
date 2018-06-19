/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_event_group', {
		id: {
			type: DataTypes.INTEGER(36),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		group_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		group_pic_path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		group_level: {
			type: DataTypes.INTEGER(6),
			allowNull: true
		},
		parent_id: {
			type: DataTypes.INTEGER(36),
			allowNull: true
		},
		remark: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		group_code: {
			type: DataTypes.STRING(10),
			allowNull: true
		}
	}, {
		tableName: 'cms_event_group',
		timestamps: false,
		freezeTableName: true
	});
};
