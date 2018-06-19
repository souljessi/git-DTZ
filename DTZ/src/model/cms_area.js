/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_area', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		area_code: {
			type: DataTypes.STRING(15),
			allowNull: true
		},
		area_name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		parent_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		parent_ids: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		scope_path: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		city_type: {
			type: DataTypes.STRING(4),
			allowNull: true
		}
	}, {
		tableName: 'cms_area',
		timestamps: false,
		freezeTableName: true
	});
};
