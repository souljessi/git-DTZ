/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('geo_house', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		AddName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		AddID: {
			type: DataTypes.CHAR(18),
			allowNull: true
		},
		RoadName: {
			type: DataTypes.CHAR(100),
			allowNull: true
		},
		ZoneName: {
			type: DataTypes.CHAR(100),
			allowNull: true
		},
		HouseNum: {
			type: DataTypes.CHAR(16),
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
		CommuName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		CommuCode: {
			type: DataTypes.CHAR(12),
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
		DataSource: {
			type: DataTypes.INTEGER(1),
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
		tableName: 'geo_house',
		timestamps: false,
		freezeTableName: true
	});
};
