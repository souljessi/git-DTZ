/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_cust_form', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		template_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		template_code: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		form_items: {
			type: DataTypes.TEXT,
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
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		form_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		icon_path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		template_group: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		}
	}, {
		tableName: 'oa_cust_form',
		timestamps: false,
		freezeTableName: true
	});
};
