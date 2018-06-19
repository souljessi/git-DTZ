/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_type', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		typeid: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		typecode: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		typename: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		typegroupid: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		other_attr: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'sys_type',
		timestamps: false,
		freezeTableName: true
	});
};
