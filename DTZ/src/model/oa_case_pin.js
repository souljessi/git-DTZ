/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_case_pin', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		}
	}, {
		tableName: 'oa_case_pin',
		timestamps: false,
		freezeTableName: true
	});
};
