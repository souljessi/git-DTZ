/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_re_procmodel', {
		id: {
			type: DataTypes.INTEGER(255),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		act_type: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		act_name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		proc_element_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		condition: {
			type: DataTypes.STRING(11),
			allowNull: true
		},
		assignee: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		candidate_users: {
			type: DataTypes.STRING(1000),
			allowNull: true
		},
		candidate_group: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		depart: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		approve_type: {
			type: DataTypes.CHAR(2),
			allowNull: true
		},
		proc_def_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		source_ref: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		target_ref: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		form: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'bpmn_re_procmodel',
		timestamps: false,
		freezeTableName: true
	});
};
