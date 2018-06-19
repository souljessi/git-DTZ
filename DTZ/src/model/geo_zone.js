/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('geo_zone', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ZoneName: {
			type: DataTypes.CHAR(50),
			allowNull: true,
			defaultValue: ''
		},
		ZoneID: {
			type: DataTypes.CHAR(18),
			allowNull: true,
			defaultValue: ''
		},
		Alias: {
			type: DataTypes.CHAR(100),
			allowNull: true,
			defaultValue: ''
		},
		OldName: {
			type: DataTypes.CHAR(100),
			allowNull: true,
			defaultValue: ''
		},
		Boundary: {
			type: DataTypes.CHAR(255),
			allowNull: true,
			defaultValue: ''
		},
		SubDisName: {
			type: DataTypes.CHAR(50),
			allowNull: true,
			defaultValue: ''
		},
		SubDisCode: {
			type: DataTypes.CHAR(12),
			allowNull: true,
			defaultValue: ''
		},
		CommuName: {
			type: DataTypes.CHAR(50),
			allowNull: true,
			defaultValue: ''
		},
		CommuCode: {
			type: DataTypes.CHAR(12),
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
		tableName: 'geo_zone',
		timestamps: false,
		freezeTableName: true
	});
};
