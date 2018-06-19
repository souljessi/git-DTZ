/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cms_problem_record', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		caller_num: {
			type: DataTypes.STRING(11),
			allowNull: true
		},
		data_source: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		remarks: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	}, {
		tableName: 'cms_problem_record',
		timestamps: false,
		freezeTableName: true
	});
};
