/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('weixinapp', {
		WX_ID: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		WX_AppID: {
			type: DataTypes.CHAR(30),
			allowNull: true,
			unique: true
		},
		WX_AppName: {
			type: DataTypes.STRING(40),
			allowNull: true
		},
		WX_AppType: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			defaultValue: '0'
		},
		WX_AppSecret: {
			type: DataTypes.STRING(40),
			allowNull: true
		},
		WX_AppToken: {
			type: DataTypes.STRING(16),
			allowNull: true
		},
		WX_AccessToken: {
			type: DataTypes.STRING(512),
			allowNull: true
		},
		WX_JsApi_Ticket: {
			type: DataTypes.STRING(512),
			allowNull: true
		},
		WX_AccessToken_ExpiresTime: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		WX_JsApi_Ticket_ExpiresTime: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		WX_CreateTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		WX_UpdateTime: {
			type: DataTypes.DATE,
			allowNull: true
		},
		WX_EncodingAESKey: {
			type: DataTypes.STRING(43),
			allowNull: true
		},
		WX_Menu: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		WX_WXNum: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		WX_IsActive: {
			type: DataTypes.INTEGER(6),
			allowNull: true,
			defaultValue: '0'
		},
		WX_IsConcernAutoRequest: {
			type: DataTypes.INTEGER(6),
			allowNull: true,
			defaultValue: '0'
		},
		WX_IsMsgAutoRequest: {
			type: DataTypes.INTEGER(6),
			allowNull: true,
			defaultValue: '0'
		},
		WX_ConcernAutoRequstContent: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		WX_MsgAutoRequestContent: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		WX_PartnersID: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: '0'
		},
		WX_MchID: {
			type: DataTypes.STRING(32),
			allowNull: true
		},
		WX_CommercialName: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		WX_PayPwd: {
			type: DataTypes.STRING(32),
			allowNull: true
		}
	}, {
		tableName: 'weixinapp',
		timestamps: false,
		freezeTableName: true
	});
};
