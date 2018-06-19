/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_role_menu', {
		roleid: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'sys_role',
				key: 'id'
			}
		},
		menuid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'sys_menu',
				key: 'id'
			}
		}
	}, {
		tableName: 'sys_role_menu',
		timestamps: false,
		freezeTableName: true
	});
};
