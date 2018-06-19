<template>
  <div>
    <el-row :gutter="20" class="selectDepart">
      <el-col :span="24">
        <p class="departTitle">选择接收部门与人员</p>
        <div class="surround" v-loading="loading">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree ref="treeChoose" :default-expand-all="expand" style="height: 300px;overflow: auto;" show-checkbox class="filter-tree" :data="TreeData" node-key="id" :render-content="renderContent" :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
          </el-tree>
        </div>
      </el-col>

    </el-row>

    <div style="text-align: right;margin-top: 10px;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(0)">取 消</el-button>
        <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
      </span>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        newdata: [],
        loading: false,
        rightCheckList: [],
        filterText: '',
        TreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        parmentList: [],
        policeList: [],
        rightTree: [],
        param: {}
      }
    },
    methods: {
      /**
       * 渲染右侧树结构
       * @param h
       * @param node
       * @param data
       * @param store
       */
      rightRenderContent(h, { node, data, store }) {
        console.log(node.data.type)
        if (node.data.type == 'depart') {

          return h(
            'span', {}, [
              h('span', {}, node.data.name),

            ]
          )
        } else {
          return h(
            'span', {}, [h('span', {
              style: {
                'margin-left': '15px'
              },
            }, ),
              h('span', {}, node.data.name),

            ]
          )
        }

      },
      /**
       * Tree树节点显示区分（组织机构、警员）
       *@param h createlement 方法
       *@param node   节点
       */
      renderContent(h, node) {
        if (node.data.type == 'depart') {
          return h(
            'span',
            {
              class: {
                foo: true
              },
              style: {
                fontSize: '14px'
              },
            },
            [
              h('i', {
                attrs:{
                  'class':  'fa fa-home'
                },
                style: {
                  color: '#deda23',
                  margin: '0 5px 0 0',
                }
              }),
              h('span', node.data.name)
            ]
          )
        } else {
          if (node.data.disabled) {
            return h(
              'span',
              {
                class: {
                  foo: true
                },
                style: {
                  fontSize: '14px'
                },
              },
              [
                h('i', {
                  attrs:{
                    'class':  'fa fa-home'
                  },
                  style: {
                    color: '#deda23',
                    margin: '0 5px 0 0',
                  }
                }),
                h('span', node.data.name)
              ]
            )
          } else {

            if (node.data.remark) {
              return h(
                'span',
                {
                  class: {
                    foo: true
                  },
                  style: {
                    fontSize: '14px'
                  },
                },
                [
                  h('i', {
                    attrs:{
                      'class':  'fa fa-home'
                    },
                    style: {
                      color: '#deda23',
                      margin: '0 5px 0 0',
                    }
                  }),
                  h('span', node.data.name)
                ]
              )
            } else {
              return h(
                'span',
                {
                  class: {
                    foo: true
                  },
                  style: {
                    fontSize: '14px'
                  },
                },
                [
                  h('i', {
                    attrs:{
                      'class':  'fa fa-home'
                    },
                    style: {
                      color: '#deda23',
                      margin: '0 5px 0 0',
                    }
                  }),
                  h('span', node.data.name)
                ]
              )
            }

          }

        }

      },
      /**
       * 关闭dialog
       * @value 关闭状态 0 取消 1 确定
       */
      closeDialog(value) {
        this.rightCheckList = [];
        if (value === 0) {
         this.policeList = []

        }else if(value === 1) {


        }

      },

      /**
       *查询组织结构信息(树)
       */
      async getPlOrgListToTree(parms) {
        try {
          const _self = this;
          let parm = {};
          if (parms) {
            parm = parms
          }
          _self.loading = true;
          const callBackData = await _self.$http.get('/oa/OaNotifyController/orgAndUser', { params: parm });

          if (callBackData.data.success) {   //查询成功
            const result = callBackData.data.result;

            _self.TreeData = _self.toTreeData(result);
            // _self.$nextTick(function() {
            //   _self.$refs.treeChoose.setCheckedNodes(_self.data.policeList);
            // });

            _self.loading = false;
          } else {
            _self.loading = false;
            _self.$message({
              message: callBackData.data.msg,
              type: 'warning'
            });
          }
        } catch (err) {
        }


      },

      /**
       * 格式转树状结构
       * @param   {Array}      原数据
       * @param   {String}    id的字符串
       * @param   {String}    父id的字符串
       * @param   {String}    children的字符串
       * @return  {Array}     数组
       */
      transData(a, idStr, pidStr, chindrenStr) {
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
          hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
          var aVal = a[j], hashVP = hash[aVal[pid]];
          if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
          } else {
            r.push(aVal);
          }
        }
        return r;
      },
      /**
       * 组合组织机构信息构建树结构信息
       *@param {Object} data 组织机构信息
       */
      toTreeData(data) {
        var pos = {};
        var tree = [];
        var i = 0;
        var PARENTID = '0';
        console.log('365',this.$getUserData('type'))
        if (this.$getUserData('type') == 1) {
          console.log('366')
          for (let item of data) {
            if (item.id == this.$getUserData('departid')) {
              PARENTID = item.parentid
            }
          }

        }

        while (data.length != 0) {

          if (data[i].parent_id == PARENTID) {

            var children = [];
            if (data[i].sys_users.length > 0) {
              for (var item of data[i].sys_users) {

                children.push({
                  id: item.id,
                  name: item.realname,
                  phone: item.phone,
                  type: 'user',
                  //                  parentname: data[i].org_name,
                  parent_id: data[i].org_id,
                  disabled: this.contains(this.disabledOptions, item.id),
                  disableType: this.containsType(this.disabledOptions, item.id),
                  remark: this.contains(this.remarkOptions, item.id),
                  remarkType: this.remarkType(this.remarkOptions, item.id)

                })
              }
            }
            tree.push({
              id: data[i].id,
              org_code: data[i].org_code,
              name: data[i].org_name,
              org_type: data[i].org_type,
              parent_id: data[i].parent_id,
              description: data[i].description,
              children: children,
              type: 'depart',
              disabled: this.contains(this.disabledOptions, data[i].id),
              disableType: this.containsType(this.disabledOptions, item.id),
              remark: this.contains(this.remarkOptions, item.id),
              remarkType: this.remarkType(this.remarkOptions, item.id)

              // disabled: true,
            });
            pos[data[i].id] = [tree.length - 1];
            data.splice(i, 1);
            i--;
          } else {
            var posArr = pos[data[i].parent_id];
            if (posArr != undefined) {
              var obj = tree[posArr[0]];
              for (var j = 1; j < posArr.length; j++) {
                obj = obj.children[posArr[j]];
              }
              var children = [];
              if (data[i].sys_users.length > 0) {
                for (var item of data[i].sys_users) {
                  children.push({
                    id: item.id,
                    name: item.realname,
                    phone: item.phone,
                    parent_id: data[i].parent_id,
                    //                    parentname: data[i].org_name,
                    disabled: this.contains(this.disabledOptions, item.id),
                    disableType: this.containsType(this.disabledOptions, item.id),
                    remark: this.contains(this.remarkOptions, item.id),
                    remarkType: this.remarkType(this.remarkOptions, item.id),
                    type: 'police'
                  })
                }
              }

              obj.children.push({
                id: data[i].id,
                org_code: data[i].org_code,
                name: data[i].org_name,
                org_type: data[i].org_type,
                parent_id: data[i].parent_id,
                type: 'user',
                description: data[i].description,
                children: children,
                disabled: this.contains(this.disabledOptions, data[i].id),
                disableType: this.containsType(this.disabledOptions, item.id),
                remark: this.contains(this.remarkOptions, item.id),
                remarkType: this.remarkType(this.remarkOptions, item.id)
              });
              pos[data[i].id] = posArr.concat([obj.children.length - 1]);
              data.splice(i, 1);
              i--;
            }
          }
          i++;
          if (i > data.length - 1) {
            i = 0;
          }
        }
        return tree;
      },
      /**
       * 判断数组是否存在某个元素
       * @param {Array} arr 数组集合
       * @param {Number,String} obj 查询元素
       */
      contains(arr, obj) {

        var i = arr.length;

        // if (i != 0) {
        while (i--) {
          if (arr[i].id === obj) {
            return true;
          }
        }
        // }
        return false;
      },
      containsType(arr, obj) {
        var i = arr.length;
        if (i != 0) {
          while (i--) {
            if (arr[i].id === obj) {
              return arr[i].disabledType;
            }
          }
        }

        return '禁用'
      },
      remarkType(arr, obj) {
        // console.warn(arr)
        var i = arr.length;
        if (i != 0) {
          while (i--) {
            if (arr[i].id === obj) {
              return arr[i].remarkType;
            }
          }
        }
        return '警告'
      },

      /**
       * 过滤tree数据
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      /**
       *tree点击事件
       * @param data
       * @param isCheck
       * @param childerCheck
       */
      treeChange(data, isCheck, childerCheck) {
        this.policeList = [];
        let nodeData = this.$refs.treeChoose.getCheckedNodes();
        let newdata = JSON.parse(JSON.stringify(nodeData));
        for (let item of newdata) {
          item.children = [];
        }
        for (let item of nodeData) {
          if (item.type == 'police') {
            this.policeList.push(item)
          }
        }
        console.log('466',this.policeList)
        this.rightTree = this.transData(newdata, 'id', 'parentid', 'children')
      },

      /**
       * 移除节点
       * @param data
       */
      removeNode(data) {
        this.$refs.treeChoose.setChecked(data, false, true)
      },
    },
    components: {},
    created() {
    },
    mounted() {
      // console.warn(this.contains(this.disabledOptions, '1'))
      if (this.$getUserData('type') == 1) {
        this.param.id = JSON.parse(this.$getStore("userData")).departid
        // this.param.id = '36af3dc0-6cee-11e7-abaa-e984774ce994'
      }
      this.getPlOrgListToTree(this.param);

    },
    updated() {

    },
    watch: {
      filterText(val) {
        this.$refs.treeChoose.filter(val);
      },
      data() {
        // console.log(11)
        this.getPlOrgListToTree(this.param);
      }

    },
    // props: ['dialogVisible', 'title', 'data', 'type']expand
    props: {
      dialogVisible: {},
      title: {},
      data: {},
      type: {},
      expand: {
        type: Boolean,
        default: false
      },
      nodeKey: {
        type: Boolean,
        defalut: false
      },
      disabledOptions: {      //禁用选型
        type: Array,
        default: () => []         //初始化选中值 默认为id集合
      },
      remarkOptions: {       //标注选型
        type: Array,
        default: () => []         //初始化选中值 默认为id集合
      }
    }
  }
</script>

<!-- 添加 "scoped " css作用域只作用于本文件，不作用全局-->
<style>
  .departTitle {
    padding: 10px;
  }

  .surround {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
  }

  .filter-tree {
    margin-top: 10px;
  }

  .rightUl {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    height: 350px;
    overflow: auto;
  }

  .surround>ul>li {
    list-style: none;
    margin: 10px;
  }

  .selectDepart .el-tree {
    border: 1px solid #fff !important
  }

  .checklist {
    padding: 5px;
    list-style: none;
  }
</style>
