/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_re_deployment', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		deploy_time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		overtime: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		},
		is_hang: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'bpmn_re_deployment',
		timestamps: false,
		freezeTableName: true
	});
};
