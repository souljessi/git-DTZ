/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_hi_taskinst', {
		id: {
			type: DataTypes.INTEGER(64),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		proc_def_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		task_def_key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		proc_element_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		act_type: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		proc_inst_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		execution_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		group: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		parent_task_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		description: {
			type: DataTypes.STRING(4000),
			allowNull: true
		},
		owner: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		assignee: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		start_time: {
			type: DataTypes.DATE,
			allowNull: false
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		duration: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		task_status: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		},
		result: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		uploadImgs: {
			type: DataTypes.STRING(500),
			allowNull: true
		}
	}, {
		tableName: 'bpmn_hi_taskinst',
		timestamps: false,
		freezeTableName: true
	});
};
