/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_msg_push', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		msg_type: {
			type: DataTypes.STRING(16),
			allowNull: false
		},
		msg_title: {
			type: DataTypes.STRING(200),
			allowNull: false
		},
		msg_content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		biz_key: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		biz_type: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		receive_code: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		receive_user_code: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		receive_user_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		send_user_code: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		send_user_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		send_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		is_merge_push: {
			type: DataTypes.CHAR(1),
			allowNull: true
		},
		plan_push_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		push_number: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		push_return_code: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		push_return_msg_id: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		push_return_content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		push_status: {
			type: DataTypes.CHAR(1),
			allowNull: true
		},
		push_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		read_status: {
			type: DataTypes.CHAR(1),
			allowNull: true
		},
		read_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'sys_msg_push',
		timestamps: false,
		freezeTableName: true
	});
};
