<template>
    <div class="video-event">
        <el-tabs v-model="activeName" type="card" class="tab-pane-unlaw">
            <el-tab-pane label="违法抓拍事件上报" name="first">
            <el-form :model="videoData"  ref="ruleForm" :rules="rules" label-width="80px" class="video-form">
                <el-form-item label="设备">
                    <el-input size="small" v-model="videoData.ObjPosition" disabled></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input size="small" v-model="videoData.baidu_x" disabled></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input size="small" v-model="videoData.baidu_y" disabled></el-input>
                </el-form-item>
                <el-form-item label="问题描述" prop="remarks">
                    <el-input size="small" v-model="videoData.remarks"></el-input>
                </el-form-item>
                <el-form-item label="抓拍照片" prop="pic_path">
                    <div @click='chooseImg' title="点击选择图片" class="img-div">
                        <img v-if="image.src" :src="image.src" class="img-avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <input id="upload_img" type="file" name="file" @change="onFileChange" class="input_file"
                            accept="image/gif,image/jpeg,image/jpg,image/png"/>
                    </div>
                </el-form-item>
                <div class="remind-msg">
                    <p>*抓拍照片：{{eventData.picPath}}</p>
                    <p v-show="videoData.baidu_x==0||videoData.baidu_x==0">*此设备经或纬度不存在</p>
                </div>
            </el-form>
            <div class="footer-btn">
                <el-button @click="cancelUnlawReport()">取 消</el-button>
                <el-button  type="primary" @click="reportUnlawful('ruleForm')">确 定</el-button>
            </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    export default {
        data(){
            
            return {
                activeName:'first',
                videoData:{
                    ObjPosition:'',
                    baidu_x:0,
                    baidu_y:0,
                    source:4,
                    remarks:''
                },
                image:{},
                rules: {
                 
                    remarks: [
                        {required: true, message: '请输入问题描述', trigger: 'blur'}
                    ],
                    pic_path: [
                        {required: true, message: '请选择违法抓拍图片', trigger: 'blur'}
                    ]
                },

            }
        },
        created: function () {},
        mounted: function () {},
        props: ['eventData'],
        components: {},
        computed: {
           
        },
        watch: {
            eventData:{
                handler:function(val,oldVal){
                    this.videoData = Object.assign({},val);
                },
                immediate:true,
                deep:true
            }
        },
        methods: { 
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * q取消违法抓拍事件上报
             */
            cancelUnlawReport(){
                this.$emit('closeUnlawReport',{showMsgCheckBox:false});
                this.image = {};
                this.resetForm('ruleForm');
            },      
            /**
             * 违法抓拍事件上报
             */
            reportUnlawful(formName){
                const VM = this;
                let formData = new FormData();
                let file = document.getElementById("upload_img").files[0];
                formData.append('image', file); //file就是图片或者文件
                formData.append('baidu_x', this.videoData.baidu_x);
                formData.append('baidu_y', this.videoData.baidu_y);
                formData.append('ObjPosition', this.videoData.ObjPosition);
                formData.append('source', this.videoData.source);
                formData.append('remarks', this.videoData.remarks);

                VM.$refs[formName].validate(async function (valid) {
                    if (valid) {
                        const res = await VM.$http.post("/video/index/save",formData);
                        if (res.data && res.data.success) {
                            VM.$emit('closeUnlawReport',{showMsgCheckBox:false});
                            VM.$emit('showMessage',{msg:'违法抓拍事件上报成功',msgFlag:true});
                            VM.image = {};
                        } else {
                            VM.$emit('showMessage',{msg:res.data.msg,msgFlag:false});
                        }
                    }
                });
            },
            chooseImg(){
                $('input[type=file]').trigger('click');
                return false
            },
            /**
             * 图片选择change事件
             *
             */
            onFileChange(e){
                let files = e.target.files || e.dataTransfer.files;
                if(files[0]){
                    const isImg = files[0].type.substr(0, 5);
                    const isLt2M = files[0].size / 1024 / 1024 < 2;
                    if (isImg !== 'image') {
                        this.$message.error('只能上传图片！')
                    }
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过2M！')
                    }
                    if (isImg === 'image' && isLt2M) {
                        if (!files.length) return;
                        this.createImage(files)
                    }
                    return isImg === 'image' && isLt2M
                }

            },
            //读取图片操作
            createImage(files){
                let VM = this;
                this.videoData.pic_path = 'img';
                for (let file of files) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        VM.image = {src: e.target.result}
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }
</script>

<style lang="scss">


.video-event {
    height:100%;
    .tab-pane-unlaw{
        height: 100%;
        .el-tabs__header{
          .el-tabs__nav{
            width:100%!important;
            box-sizing:border-box!important;
            .el-tabs__item{
              width:100%!important;
              text-align:center!important;
            }
            .el-tabs__item:hover {
                color: #00a0e9!important;
            }
            .el-tabs__item.is-active {
                color: #fff!important;
                background:#17335d!important;
            }
          }
        }
        .el-tabs__content{
          height:calc(100% - 55px)!important; 
          .el-tab-pane{
            height:100%;
                .video-form{
                    height:calc(100% - 40px);
                    .remind-msg{
                        font-size:12px;
                        line-height: 20px;
                        color:red;
                        margin-top:40px;
                    }
                    .el-input{
                        width:200px!important;
                    }
                    .el-textarea{
                        width:200px!important;
                    }
                    .input_file {
                        display: none;
                    }
                    .img-div{
                        width:200px;
                        height: 200px;
                        cursor: pointer;
                        border: 1px dashed #d9d9d9;
                        border-radius: 6px;
                        position: relative;
                        overflow: hidden;
                        box-sizing: border-box;
                        .img-avatar {
                            width:200px;
                            height: 200px;
                            display: block;
                        }
                        .avatar-uploader-icon {
                            font-size: 30px;
                            color: #8c939d;
                            width: 200px;
                            height: 200px;
                            line-height: 200px;
                            text-align: center;
                        }
                    }

                }
                .footer-btn{
                    text-align: right;
                    margin-right:10px;
                }
          }        
        }
      }

}

</style>
