/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_parts_copy', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ObjID: {
			type: DataTypes.CHAR(30),
			allowNull: false,
			defaultValue: '',
			primaryKey: true
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
		DeptCode2: {
			type: DataTypes.CHAR(10),
			allowNull: true,
			defaultValue: ''
		},
		DeptName2: {
			type: DataTypes.CHAR(60),
			allowNull: true,
			defaultValue: ''
		},
		DeptCode3: {
			type: DataTypes.CHAR(10),
			allowNull: true,
			defaultValue: ''
		},
		DeptName3: {
			type: DataTypes.CHAR(60),
			allowNull: true,
			defaultValue: ''
		},
		BGID: {
			type: DataTypes.CHAR(15),
			allowNull: true,
			defaultValue: ''
		},
		ObjState: {
			type: DataTypes.CHAR(10),
			allowNull: true,
			defaultValue: ''
		},
		ORDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		CHDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		DataSource: {
			type: DataTypes.CHAR(30),
			allowNull: true,
			defaultValue: ''
		},
		Note: {
			type: DataTypes.CHAR(100),
			allowNull: true,
			defaultValue: ''
		},
		group_code: {
			type: DataTypes.STRING(10),
			allowNull: true
		},
		original_x: {
			type: "DOUBLE",
			allowNull: true
		},
		original_y: {
			type: "DOUBLE",
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
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		update_by: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		pic_path: {
			type: DataTypes.STRING(500),
			allowNull: true,
			defaultValue: ''
		},
		area_code: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		address_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		}
	}, {
		tableName: 'cms_parts_copy',
		timestamps: false,
		freezeTableName: true
	});
};
