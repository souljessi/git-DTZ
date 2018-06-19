/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_re_procdef', {
		id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		rev: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		deployment_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		bytes: {
			type: "LONGBLOB",
			allowNull: true
		},
		overtime: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		},
		icon_path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		form_items: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		is_custom_tem: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: '0'
		},
		template_group: {
			type: DataTypes.STRING(30),
			allowNull: true
		},
		form_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_by: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		update_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		remarks: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'bpmn_re_procdef',
		timestamps: false,
		freezeTableName: true
	});
};
