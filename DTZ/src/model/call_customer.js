/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('call_customer', {
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true
		},
		real_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		source: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		age: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(500),
			allowNull: true
		},
		gender: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		remark: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		customer_type: {
			type: DataTypes.INTEGER(4),
			allowNull: true
		},
		operator_id: {
			type: DataTypes.STRING(36),
			allowNull: true
		},
		last_call_date: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'call_customer',
		timestamps: false,
		freezeTableName: true
	});
};
