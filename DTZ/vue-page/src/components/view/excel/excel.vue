<template>
  <div v-loading.body="loading" class="excel-body">
    <div class="excel-warn">
      <p>填写须知：</p>
      <p>1. 不能在该Excel表中对员工信息类别进行增加、删除或修改,若员工信息类别不足，请进入“通讯录-通讯录配置”进行添加，完成后重新下载新模板。</p>
      <p>2. Excel中红色字段为必填字段,黑色字段为选填字段。</p>
      <p>3. 员工ID：员工在企业的唯一标识，该字段可初始设定或自动生成，且不可修改。</p>
      <p>4. 部门 : 上下级部门间用‘-'隔开，且从最上级部门开始，例如"市场部-杭州分部"。</p>
      <p>5. 手机号 : 如果是国内手机号，直接填写手机号即可，如果是国外手机号，需要添加国家码，例如+xx-xxxxxx</p>
      <p>6. 第一次新增员工需下载新的模板来填写以后上传，员工ID一般无需填写，系统自动生成。 </p>
      <p>7. 后续如果需要添加员工数据，直接导出现有的数据然后添加记录，对于已有记录的员工ID不能随意修改，否则将可能会生成重复数据</p>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree v-loading="loading" class="excel-tree" :data="dataTree" :props="defaultProps" :render-content="renderContent">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-radio-group v-model="excelType">
          <el-radio-button label="1">新建通讯录</el-radio-button>
          <el-radio-button label="2">导出/修改通讯录</el-radio-button>
        </el-radio-group>
        <div class="excel-new">
          <transition name="fade-in" mode="out-in">
            <div v-if="excelType=='1'" key="new">
              <div style="  overflow:hidden; ">
                <span class="excel-span">1</span>
                <div style="margin:5px;">
                  <span>下载员工通讯录模板，批量填写员工信息</span>
                  <el-button size="small" type="primary" v-on:click="downloadModelExcel">下载模板</el-button>
                </div>
              </div>
              <div v-show="set2">
                <div style="overflow:hidden;">
                  <span class="excel-ver">1</span>
                </div>
                <div style="overflow:hidden;">
                  <span class="excel-span">2</span>
                  <div style="margin:5px;">
                    <span>选择填写好的员工信息表</span>
                    <input ref="newUpLoad" type="file" id="upload">
                  </div>
                </div>
              </div>
              <div v-show="set3">
                <div style="  overflow:hidden;">
                  <span class="excel-ver">1</span>
                </div>
                <div style="  overflow:hidden; ">
                  <span class="excel-span">3</span>
                  <div style="margin:5px;">
                    <span>上传填写好的员工信息表</span>
                  </div>
                </div>
              </div>

              <div v-show="set3">
                <el-button class="excel-button" type="info" @click="clickUploadData('newUpLoad')">上传</el-button>
              </div>
            </div>
            <div v-else key="old">
              <div style="  overflow:hidden; ">
                <span class="excel-span">1</span>
                <div style="margin:5px;">
                  <span>导出所有员工信息，批量修改员工信息</span>
                  <el-button size="small" type="primary" v-on:click="downloadExcel">导出数据</el-button>
                </div>
              </div>
              <div style="  overflow:hidden;">
                <span class="excel-ver">1</span>
              </div>
              <div style="  overflow:hidden;">
                <span class="excel-span">2</span>
                <div style="margin:5px;">
                  <span>选择修改好的员工信息表</span>
                  <input ref='changeUpLoad' type="file" id="upload">
                </div>

              </div>
              <div style="  overflow:hidden;">
                <span class="excel-ver">1</span>
              </div>
              <div style="  overflow:hidden; ">
                <span class="excel-span">3</span>
                <div style="margin:5px;">
                  <span>上传填写好的员工信息表</span>
                </div>
              </div>

              <div>
                <el-button class="excel-button" type="info" @click="clickUploadData('changeUpLoad')">上传</el-button>
              </div>
            </div>
          </transition>

        </div>

      </el-col>
    </el-row>
    <!--错误信息dialog-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">

      <el-table
        :data="tableData"
        border
        style="width: 100%;height:500px;overflow-y: scroll">
        <el-table-column
          width="140"
          :label="proc.field_name"
          type="index"
          v-for="(proc,index)  in tableHead" :key="proc">
          <template slot-scope="scope">
            <div style="color: #ff0000" v-if="tableErr[scope.$index][proc.field]">
              {{ scope.row[proc.field] }}
            </div>
            <div v-else>
              {{ scope.row[proc.field] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="错误信息">
          <template slot-scope="scope">
            <div style="color: #ff0000">
              {{ tableErr[scope.$index].msg }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

  import {formatData, resolveData} from 'assets/js/excel.js';
export default {
  components: {
  },
  data() {
    return {
      set2: true,
      set3: true,
      loading: false,
      dialogVisible: false,
      excelType: 1,
      defaultProps: {
        children: 'children',
        label: 'tree_name'
      },
      title: '',
      uploadFile: '',
      tableData: [],
      tableHead: [],
      tableErr: [],
      loading: false,
      show: true,
      dataTree: []
    };
  },
  mounted: function () {
    this.getTreeList();
  },
  props: ['propdataTree', 'defaultKey', 'roleid', 'btnShow'],
  methods: {
    /**
     * 渲染Tree自定义样式
     * @param h  createlement()
     * @param node 当前节点
     * @param data 所有数据
     * @param store
     * @returns
     */
    renderContent(h, { node, data, store }) {
      if (data.parentid) {
        return (
          <span>
          <base-icon icon="bumen" style='color:rgba(32, 160, 255, 0.52)'/>
            <span class="el-tree-node__label" style='margin-left:5px;'>{data.tree_name}</span>
          </span>
        )
      } else {
        return (<span>
          <span style={{
            fontSize: '12px',
              width: '24px',
          height: '24px',
          'line-height': '24px',
          'text-align': 'center',
            display: 'inline-block',
            background: '#20a0ff',
            borderRadius: '15px',
            color: 'rgb(255, 255, 255)',
            margin: ' 0px 5px 0px 0px'
          }} >{data.tree_name.substring(0, 1)}</span>
          <span class="el-tree-node__label">{data.tree_name}</span>
        </span>)

      }
    },
    /**
     * 随机颜色
     * @returns {string} 颜色值
     */
    getRandomColor() {
      return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
    },
   async downloadModelExcel() {
      var _this = this;
      var url = '/excel/excelController/downloadModel';
      var style = {
        color: '000000', fillColor: 'ffffff', border: { style: 'thin', color: '000000' }
      };
      const _self = this;
      var params = { table_name: 'sys_user' };
      try{
        const res = await this.$http.post(url, params);
        if (res.data && res.data.success) {
          formatData(res.data.result, '模板表.xlsx', style);
        }else{
          this.$message.error(res.data.msg);
        }
      }catch(err){
        this.$message.error({ message: '下载失败' + err,
          type: 'warning'});
      }
    },
    downloadExcel() {
      var _this = this;
      var url = '/excel/excelController/downloadExcel';
      var style = {
        color: '000000', fillColor: 'ffffff', border: { style: 'thin', color: '000000' }
      };
      var _self = this;
      var params = { table_name: 'sys_user' };
      this.$http.post(url, params).then(function (data) {
        formatData(data.data.result, '通讯录.xlsx', style);
      }).catch(function (err) {
        _self.$message({
          message: '下载失败' + err,
          type: 'warning'
        })
      })

    },
   async getExcelData(url, cb) {
      var _self = this;
     var params = { table_name: 'sys_user' };
      this.$http.post(url, params).then(function (data) {
        cb(data)
      }).catch(function (err) {
        _self.$message({
          message: '下载失败' + err,
          type: 'warning'
        })
      })
    },
    clickUploadData(type) {
      switch (type) {
        case 'newUpLoad':
          if (this.$refs.newUpLoad.files.length > 0) {
            this.set3 = true;
            this.uploadData(this.$refs.newUpLoad);
          } else {
            this.$message({
              message: '请先选择文件在进行上传',
              type: 'warning'
            })
          }
          break;
        case 'changeUpLoad':
          if (this.$refs.changeUpLoad.files.length > 0) {
            this.uploadData(this.$refs.changeUpLoad)
          } else {
            this.$message({
              message: '请先选择文件在进行上传',
              type: 'warning'
            })
          }
          break;
      }
    },
    uploadData(e) {
      var url = '/excel/excelController/downloadModel';
      var _this = this;
      _this.loading = true;
      _this.getExcelData(url, function (ret) {
      let uploadUrl='/excel/excelController/uploadExcel'
        if (!ret.data.err) {
          resolveData(e, 'sys_user', ret.data.result, _this.$http, uploadUrl, function (err, ret1, header, data) {
            _this.loading = false;
            _this.dialogVisible = true;
            let result = ret1.data.result;
            if (err) {
              _this.$message({
                message: '上传失败' + err,
                type: 'warning'
              })
            } else {
              _this.title = '上传成功' + result.successCount + '条,上传失败' + result.failureCount + '条';
              _this.tableData = data;
              _this.tableErr = result.data;

              _this.tableHead = header;
            }

              _this.getTreeList();

          })
        } else {
          _this.$message({
            message: '上传失败' + ret.data.err,
            type: 'warning'
          })
        }
      })


    },
   async getTreeList() {
      var _self = this;
      this.loading = true;
      try{
        const res = await this.$http.post('/excel/excelController/excelTreeList', {table_name:'sys_user'});
        if (res.data && res.data.success) {
            _self.dataTree = res.data.result;
            _self.loading = false;
        }else{
          this.$message.error(res.data.msg);
        }
      }catch(err){
        _self.loading = false;
        _self.$message({
          message: '连接错误',
          type: 'error'
        })
      }
    }
  }

}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  >
.el-upload--text {
  background-color: #fff;
  border: 0;
  width: auto;
  height: auto;
  overflow: inherit;
  ;
}

.upload-demo {
  margin: 20px 10px;
}

.excel-tree {
  height: 400px;
  overflow: auto;
  border: 1px;
  background: rgba(224, 224, 224, 0.42)
}

.excel-tree .fa-icon {
  width: auto;
  height: 14px;
}

.excel-warn {
  padding: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.67);
  background: rgba(236, 210, 147, 0.52);
  border: 1px solid rgba(171, 158, 158, 0.27);
  border-radius: 3px;
  margin-bottom: 15px;
}

.excel-new {
  margin-top: 15px;
  border-radius: 3px;
  padding: 25px;
  border: 1px solid rgba(31, 45, 61, 0.22);
}

.excel-span {
  float: left;
  text-align: center;
  vertical-align: middle;
  line-height: 35px;
  font-weight: bold;
  width: 35px;
  height: 35px;
  border-radius: 19px;
  color: rgba(72, 87, 106, 0.69);
  margin-right: 5px;
  border: 2px solid rgba(72, 87, 106, 0.69);
}

.excel-ver {
  float: left;
  margin: 5px;
  border-right: 3px dashed rgba(72, 87, 106, 0.39);
  color: #fff;
  width: 12px;
  padding: 5px 0;
  height: 30px;
}

.fade-in-enter-active {

  animation: fadeInRight 0.5s 0s 1 both
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}






/* .fade-in-leave-active {
  animation: fadeOutLeft 0.5s 0s 1 both
} */

@keyframes fadeOutLeft {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

.excel-button {
  margin: 50px 0 0 200px;
}
.excel-body .el-tree-node__content {
  line-height: 36px;
  height: 36px;
  cursor: pointer;
}
</style>
