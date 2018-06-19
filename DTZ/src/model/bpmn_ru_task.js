/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_ru_task', {
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
		execution_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		proc_inst_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		proc_def_id: {
			type: DataTypes.STRING(64),
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
		task_def_key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		owener: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		assiginee: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		delegateion: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		creeate_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		due_time: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'bpmn_ru_task',
		timestamps: false,
		freezeTableName: true
	});
};
