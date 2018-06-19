/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_ru_execution', {
		id: {
			type: DataTypes.STRING(64),
			allowNull: false,
			defaultValue: '',
			primaryKey: true
		},
		rev: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		proc_inst_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		business_key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		parent_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		pro_def_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		super_exec: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		act_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'bpmn_ru_execution',
		timestamps: false,
		freezeTableName: true
	});
};
