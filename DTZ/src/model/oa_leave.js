/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_leave', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		process_instance_id: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		start_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		leave_type: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		reason: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		apply_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		reality_start_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		reality_end_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		update_by: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		remarks: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		del_flag: {
			type: DataTypes.CHAR(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'oa_leave',
		timestamps: false,
		freezeTableName: true
	});
};
