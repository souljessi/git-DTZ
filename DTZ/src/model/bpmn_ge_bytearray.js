/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_ge_bytearray', {
		id: {
			type: DataTypes.INTEGER(64),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		rev: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		bytes: {
			type: "LONGBLOB",
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		path: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		overtime: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'bpmn_ge_bytearray',
		timestamps: false,
		freezeTableName: true
	});
};
