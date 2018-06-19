export default {
  callServer: process.env.NODE_ENV === 'production' ? 'http://172.16.11.23:8088' : 'http://39.129.35.72:4015',
  // callServer: "http://39.129.35.72:4015",
  callCenterPath: process.env.NODE_ENV === 'production'?'http://172.16.11.23:8088/home/':'http://39.129.35.72:4015/smartcrm_2018/App/recording.php?str=http://localhost:8088/home/',
  
  queuePauseDo: "/smartcrm_2018/index.php?m=api&a=queuePauseDo", //设置分机状态
  clickCall: "/smartcrm_2018/index.php?m=api&a=clickCall", //点击拨号，呼出电话
  pbxAMIFeedBackJson: "/smartcrm_2018/index.php?m=api&a=pbxAMIFeedBackJson",
  setHuzhuanInfo: "/smartcrm_2018/index.php?m=api&a=setHuzhuanInfo",
  callTransfer: "/smartcrm_2018/index.php?m=api&a=callTransfer",
  cdrData: "/smartcrm_2018/index.php?m=api&a=cdrData",
  loginName: "ny",
  password: "ny2018",
  callStatus: [
    { label: "队列放弃", value: 343 },
    { label: "IVR放弃", value: 342 },
    { label: "忙线", value: 341 },
    { label: "振铃未接", value: 334 },
    { label: "接通", value: 333 }
  ],
  callType: [{ label: "呼入", value: 331 }, { label: "呼出", value: 332 }]
};
