/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bpmn_re_model', {
		id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			primaryKey: true
		},
		key: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		rev: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		deployment_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		bytes: {
			type: "LONGBLOB",
			allowNull: true
		}
	}, {
		tableName: 'bpmn_re_model',
		timestamps: false,
		freezeTableName: true
	});
};
