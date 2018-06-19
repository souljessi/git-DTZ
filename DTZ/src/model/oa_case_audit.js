/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('oa_case_audit', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		audit_by: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		case_id: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		audit_flag: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		audit_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		audit_content: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		audit_start_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		audit_end_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'oa_case_audit',
		timestamps: false,
		freezeTableName: true
	});
};
