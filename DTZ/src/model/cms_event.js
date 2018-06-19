/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_event', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		ObjCode: {
			type: DataTypes.CHAR(19),
			allowNull: false,
			defaultValue: ''
		},
		ObjName: {
			type: DataTypes.CHAR(30),
			allowNull: true,
			defaultValue: ''
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
		area_code: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		source: {
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
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		update_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		verify_by: {
			type: DataTypes.STRING(36),
			allowNull: true
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
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '1'
		},
		is_check: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		del_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		baidu_x: {
			type: "DOUBLE",
			allowNull: true
		},
		baidu_y: {
			type: "DOUBLE",
			allowNull: true
		},
		businesskey: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		type: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		verify_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		verify_remark: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		process_person: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		read_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'cms_event',
		timestamps: false,
		freezeTableName: true
	});
};
