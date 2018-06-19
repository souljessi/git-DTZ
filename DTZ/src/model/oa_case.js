/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_case', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		DeptCode1: {
			type: DataTypes.CHAR(10),
			allowNull: true,
			defaultValue: ''
		},
		DeptName1: {
			type: DataTypes.CHAR(60),
			allowNull: true,
			defaultValue: ''
		},
		ObjPosition: {
			type: DataTypes.CHAR(100),
			allowNull: true,
			defaultValue: ''
		},
		BGID: {
			type: DataTypes.CHAR(20),
			allowNull: true,
			defaultValue: ''
		},
		case_code: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		case_type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		parent_name: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		sub_name: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		group_code: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		update_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		create_date: {
			type: DataTypes.DATE,
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
		businesskey: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		baidu_x: {
			type: "DOUBLE",
			allowNull: true
		},
		baidu_y: {
			type: "DOUBLE",
			allowNull: true
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		area_code: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		approve_status: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		proc_inst_id: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		}
	}, {
		tableName: 'oa_case',
		timestamps: false,
		freezeTableName: true
	});
};
