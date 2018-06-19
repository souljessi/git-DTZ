/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('wechat_user', {
		UserId: {
			type: DataTypes.STRING(37),
			allowNull: false,
			primaryKey: true
		},
		PhoneNo: {
			type: DataTypes.STRING(12),
			allowNull: true
		},
		PassWd: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		NickName: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		RealName: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		Sex: {
			type: DataTypes.CHAR(1),
			allowNull: true
		},
		OpenID: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		Email: {
			type: DataTypes.STRING(60),
			allowNull: true
		},
		HeadPic: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		UserIsDel: {
			type: DataTypes.CHAR(1),
			allowNull: true,
			defaultValue: '0'
		},
		CreateTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		UpdateTime: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'wechat_user',
		timestamps: false,
		freezeTableName: true
	});
};
