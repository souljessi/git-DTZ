/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('geo_poi', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		POIName: {
			type: DataTypes.CHAR(50),
			allowNull: true
		},
		POIID: {
			type: DataTypes.CHAR(18),
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
		Floor: {
			type: DataTypes.CHAR(6),
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
		tableName: 'geo_poi',
		timestamps: false,
		freezeTableName: true
	});
};
