/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_hi_procinst', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		review_name: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		proc_def_id: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		start_time: {
			type: DataTypes.DATE,
			allowNull: false
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		overtime: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		},
		duration: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		form_json: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		start_user_name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		start_task_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		end_task_id: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(20),
			allowNull: true,
			defaultValue: '2'
		}
	}, {
		tableName: 'bpmn_hi_procinst',
		timestamps: false,
		freezeTableName: true
	});
};
