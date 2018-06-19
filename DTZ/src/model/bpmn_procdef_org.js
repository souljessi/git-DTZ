/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_procdef_org', {
		proc_def_id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		org_id: {
			type: DataTypes.INTEGER(36),
			allowNull: false,
			primaryKey: true
		}
	}, {
		tableName: 'bpmn_procdef_org',
		timestamps: false,
		freezeTableName: true
	});
};
