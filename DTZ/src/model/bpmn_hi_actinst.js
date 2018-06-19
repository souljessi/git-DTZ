/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_hi_actinst', {
		id: {
			type: DataTypes.INTEGER(64),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		proc_def_id: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		proc_inst_id: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		execution_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		act_name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		approve_type: {
			type: DataTypes.CHAR(2),
			allowNull: true
		},
		act_type: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		proc_element_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		group: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		assignee: {
			type: DataTypes.TEXT,
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
		act_status: {
			type: DataTypes.BIGINT,
			allowNull: true
		}
	}, {
		tableName: 'bpmn_hi_actinst',
		timestamps: false,
		freezeTableName: true
	});
};
