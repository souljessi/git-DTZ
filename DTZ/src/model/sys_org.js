/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sys_org', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		parent_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		parent_ids: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		org_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		org_code: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		org_type: {
			type: DataTypes.STRING(10),
			allowNull: true
		},
		fax: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		primary_person: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		deputy_person: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		create_by: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		update_by: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		grade: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		area_id: {
			type: DataTypes.STRING(36),
			allowNull: true
		}
	}, {
		tableName: 'sys_org',
		timestamps: false,
		freezeTableName: true
	});
};
