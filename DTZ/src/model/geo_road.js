/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('geo_road', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		StrName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		StrID: {
			type: DataTypes.CHAR(18),
			allowNull: true
		},
		Alias: {
			type: DataTypes.CHAR(100),
			allowNull: true
		},
		OldName: {
			type: DataTypes.CHAR(100),
			allowNull: true
		},
		SubDisName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		SubDisCode: {
			type: DataTypes.CHAR(12),
			allowNull: true
		},
		SHousenum: {
			type: DataTypes.CHAR(16),
			allowNull: true
		},
		LHousenum: {
			type: DataTypes.CHAR(16),
			allowNull: true
		},
		Beginning: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		Ending: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		Direction: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		RouteName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		DataSource: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		ORDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		CHDate: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		Note: {
			type: DataTypes.CHAR(100),
			allowNull: true
		},
		Baidu_lng: {
			type: "DOUBLE",
			allowNull: true
		},
		Baidu_lat: {
			type: "DOUBLE",
			allowNull: true
		}
	}, {
		tableName: 'geo_road',
		timestamps: false,
		freezeTableName: true
	});
};
