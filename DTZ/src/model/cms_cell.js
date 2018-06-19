/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_cell', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		BGID: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		area_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		BGSQua: {
			type: DataTypes.INTEGER(8),
			allowNull: true
		},
		ORDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		CHDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		Note: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		scope_path: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		area_code: {
			type: DataTypes.BIGINT,
			allowNull: true
		}
	}, {
		tableName: 'cms_cell',
		timestamps: false,
		freezeTableName: true
	});
};
