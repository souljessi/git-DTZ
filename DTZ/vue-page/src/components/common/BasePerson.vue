<template>
  <div class="personDialog">
    <el-row :gutter="20" class="selectDepart">
      <el-col :span="12">
        <p class="departTitle">选择部门与人员</p>
        <div class="surround" v-loading="loading">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree ref="treeChoose" :default-expand-all="expand" style="height: 300px;overflow: auto;" show-checkbox class="filter-tree" :data="TreeData" node-key="id" :render-content="renderContent" :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="12">
        <p class="departTitle">已选部门与人员
          <span style="color:rgb(32, 160, 255)" v-show="max!=null">{{`（${personList.length} / ${max}）`}}</span>
        </p>
        <div class="surround">
          <el-tree ref="rightTreeChoose" style="height: 335px;overflow: auto;" class="filter-tree" :expand-on-click-node="false" :default-expand-all="true" :data="rightTree" node-key="id" :render-content="rightRenderContent" :props="defaultProps">
          </el-tree>
          <!--<ul v-if="rightCheckList.length" class="checklist">-->
          <!--<li v-for="(item,index) in rightCheckList" v-show="item.show">-->
          <!--&lt;!&ndash;<el-tag :close-transition="true" type="primary" style="margin-right: 5px;">{{item.parentname}}</el-tag>&ndash;&gt;-->
          <!--&lt;!&ndash;<span :style="styleObject"&ndash;&gt;-->
          <!--&lt;!&ndash;v-show="item.show">{{item.name.substring(0, 1)}}</span>&ndash;&gt;-->
          <!--<span> {{ item.name }}</span>-->
          <!--<span style="float: right;">-->
          <!--<el-button size="mini" @click="removeNode(item)" type="danger">删除</el-button>-->
          <!--</span>-->

          <!--</li>-->
          <!--</ul>-->

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
      filterText: "",
      TreeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        disabled: "disabled"
      },
      parmentList: [],
      personList: [],
      rightTree: [],
      param: {}
    };
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
      if (node.data.type == "depart") {
        return h(
          "span",
          {
            style: {
              flex: "1 1 0%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14px",
              paddingRight: "8px"
            }
          },
          [
            h("span", {}, node.data.name),
            h(
              "span",
              {
                style: {
                  float: "right"
                }
              },
              [
                h(
                  "el-button",
                  {
                    attrs: {
                      size: "mini",
                      type: "danger"
                    },
                    on: {
                      click: () => {
                        this.$refs.treeChoose.setChecked(data, false, true);
                      }
                    }
                  },
                  "删除"
                )
              ]
            )
          ]
        );
      } else {
        return h(
          "span",
          {
            style: {
              flex: "1 1 0%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14px",
              paddingRight: "8px"
            }
          },
          [
            h("span", {}, [
              h(
                "span",
                {
                  style: {
                    width: "24px",
                    height: "24px",
                    lineHeight: "24px",
                    textAlign: "center",
                    display: "inline-block",
                    background: "rgb(32, 160, 255)",
                    borderRadius: "15px",
                    color: "rgb(255, 255, 255)",
                    margin: "0px 5px 0px 0px"
                  }
                },
                node.data.name.substring(0, 1)
              ),
              h("span", {}, node.data.name)
            ]),

            h(
              "span",
              {
                style: {
                  float: "right"
                }
              },
              [
                h(
                  "el-button",
                  {
                    attrs: {
                      size: "mini",
                      type: "danger"
                    },
                    on: {
                      click: () => {
                        this.$refs.treeChoose.setChecked(data, false, true);
                      }
                    }
                  },
                  "删除"
                )
              ]
            )
          ]
        );
      }
    },
    /**
     * Tree树节点显示区分（组织机构、警员）
     *@param h createlement 方法
     *@param node   节点
     */
    renderContent(h, node) {
      if (node.data.type == "depart") {
        return h(
          "span",
          {
            class: {
              foo: true
            },
            style: {
              //              color: 'red',
              fontSize: "14px"
            }
          },
          [
            h("i", {
              class: {
                "el-icon-message": true
              },
              style: {
                color: "#20a0ff",
                margin: "0 5px 0 0"
              }
            }),
            h("span", node.data.name)
          ]
        );
      } else {
        if (node.data.disabled) {
          return h(
            "span",
            {
              class: {
                foo: true
              },
              style: {
                //              color: 'red',
                fontSize: "14px"
              }
            },
            [
              h(
                "span",
                {
                  style: {
                    width: "24px",
                    height: "24px",
                    lineHeight: "24px",
                    textAlign: "center",
                    display: "inline-block",
                    background: "#c0c4cc",
                    borderRadius: "15px",
                    color: "rgb(255, 255, 255)",
                    margin: "0px 5px 0px 0px"
                    // width: "20px",
                    // // background: '#' + Math.random().toString(16).substring(2).substr(0, 6),
                    // background: node.data.disabled
                    //   ? "rgb(151, 168, 190)"
                    //   : "rgba(21, 144, 234, 0.73)", //生成随机颜色
                    // padding: "5px",
                    // "border-radius": "15px",
                    // color: "#fff",
                    // margin: "0 5px 0 0"
                  }
                },
                node.data.name.substring(0, 1)
              ),
              h("span", node.data.name),
              h(
                "span",
                {
                  style: {
                    "margin-left": "10px",
                    color: "red"
                  }
                },
                `[${node.data.disableType}]`
              )
            ]
          );
        } else {
          if (node.data.remark) {
            return h(
              "span",
              {
                class: {
                  foo: true
                },
                style: {
                  //              color: 'red',
                  fontSize: "14px"
                }
              },
              [
                h(
                  "span",
                  {
                    style: {
                      width: "24px",
                      height: "24px",
                      lineHeight: "24px",
                      textAlign: "center",
                      display: "inline-block",
                      background: "rgb(32, 160, 255)",
                      borderRadius: "15px",
                      color: "rgb(255, 255, 255)",
                      margin: "0px 5px 0px 0px"
                    }
                  },
                  node.data.name.substring(0, 1)
                ),
                h("span", node.data.name),
                h(
                  "span",
                  {
                    style: {
                      "margin-left": "10px",
                      color: "rgba(21, 144, 234, 0.73)"
                    }
                  },
                  `[${node.data.remarkType}]`
                )
              ]
            );
          } else {
            return h(
              "span",
              {
                class: {
                  foo: true
                },
                style: {
                  //              color: 'red',
                  fontSize: "14px"
                }
              },
              [
                h(
                  "span",
                  {
                    style: {
                      width: "24px",
                      height: "24px",
                      lineHeight: "24px",
                      textAlign: "center",
                      display: "inline-block",
                      background: "rgb(32, 160, 255)",
                      borderRadius: "15px",
                      color: "rgb(255, 255, 255)",
                      margin: "0px 5px 0px 0px"
                    }
                  },
                  node.data.name.substring(0, 1)
                ),
                h("span", node.data.name)
              ]
            );
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
      if (value == 0) {
        if (this.data.personList.length == 0) {
          this.personList = [];
          this.rightTree = [];
        } else {
          this.personList = this.data.personList;
          this.rightTree = this.data.defalut;
        }
      }
      var obj = {};
      obj.personList = Object.assign([], this.personList);
      obj.defalut = Object.assign([], this.rightTree);

      this.$emit("close", {
        dialog: value,
        dialogVisible: false,
        CheckedLists: obj,
        type: this.type
      });

      this.getPlOrgListToTree(this.param);
    },

    /**
     *查询组织结构信息(树)
     */
    async getPlOrgListToTree(parms) {
      try {
        const _self = this;
        let parm = {};
        if (parms) {
          parm = parms;
        }
        _self.loading = true;
        this.rightTree = [];
        const callBackData = await _self.$http.get(
          "/sys/DepartController/orgAndUser",
          { params: parm }
        );
        if (callBackData.data.success) {
          //查询成功
          const result = callBackData.data.result;
          console.log("result", result);
          // _self.TreeData = _self.toTreeData(result);
          // const Data=_self.toTree(result);
          _self.TreeData = _self.toTree(result);
          console.log("--------------------------------------");
          console.log(_self.TreeData);
          // console.log(_self.toTree(result));

          console.log("--------------------------------------");

          _self.$nextTick(function() {
            _self.$refs.treeChoose.setCheckedNodes(_self.data.personList);
          });

          _self.loading = false;
        } else {
          _self.loading = false;
          _self.$message({
            message: callBackData.data.msg,
            type: "warning"
          });
        }
      } catch (err) {}
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
      var r = [],
        hash = {},
        id = idStr,
        pid = pidStr,
        children = chindrenStr,
        i = 0,
        j = 0,
        len = a.length;
      for (; i < len; i++) {
        hash[a[i][id]] = a[i];
      }
      for (; j < len; j++) {
        var aVal = a[j],
          hashVP = hash[aVal[pid]];
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = []);
          hashVP[children].push(aVal);
        } else {
          r.push(aVal);
        }
      }
      return r;
    },

    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function(item) {
        delete item.children;
      });

      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function(item) {
        map[item.id] = item;
      });
      //        console.log(map);

      var val = [];
      for (const item of data) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parent_id];

        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        console.log("parent:", parent);
        if (parent) {
          console.log("节点");
          var children = [];
          // ——————————————————————————————————————处理用户数据
          if (item.sys_users.length > 0) {
            for (var item2 of item.sys_users) {
              // console.warn(this.contains(this.disabledOptions.list, item.id));
              children.push({
                id: item2.id,
                name: item2.realname,
                phone: item2.phone,
                type: "person",
                parent_id: item.id,
                disabled: this.contains(this.disabledOptions.list, item2.id),
                disableType: this.containsType(
                  this.disabledOptions.list,
                  item2.id
                ),
                remark: this.contains(this.remarkOptions, item2.id),
                remarkType: this.remarkType(this.remarkOptions, item2.id)
              });
            }
          }
          // ——————————————————————————————————————统一不们数据结构
          item.type = "depart";
          item.org_code = item.org_code;
          item.name = item.org_name;
          item.org_type = item.org_type;
          item.parent_id = item.parent_id;
          item.description = item.description;
          item.disabled = this.contains(this.disabledOptions.list, item.id);
          (item.disableType = this.containsType(
            this.disabledOptions.list,
            item.id
          )),
            (item.remark = this.contains(this.remarkOptions, item.id));
          item.remarkType = this.remarkType(this.remarkOptions, item.id);
          // console.log(item.children,children);
          item.children = children;
          (parent.children || (parent.children = [])).push(item);
        } else {
          console.log("顶级", item);
          // //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          var children = [];
          // // ——————————————————————————————————————处理用户数据
          if (item.sys_users.length > 0) {
            for (var item2 of item.sys_users) {
              // console.warn(this.contains(this.disabledOptions.list, item.id));
              children.push({
                id: item2.id,
                name: item2.realname,
                phone: item2.phone,
                type: "person",
                parent_id: item.id,
                disabled: this.contains(this.disabledOptions.list, item2.id),
                disableType: this.containsType(
                  this.disabledOptions.list,
                  item2.id
                ),
                remark: this.contains(this.remarkOptions, item2.id),
                remarkType: this.remarkType(this.remarkOptions, item2.id)
              });
            }
          }
          // ——————————————————————————————————————统一数据结构
          item.org_code = item.org_code;
          item.name = item.org_name;
          item.org_type = item.org_type;
          item.parent_id = item.parent_id;
          item.description = item.description;
          item.disabled = this.contains(this.disabledOptions.list, item.id);
          (item.disableType = this.containsType(
            this.disabledOptions.list,
            item.id
          )),
            (item.remark = this.contains(this.remarkOptions, item.id));
          item.remarkType = this.remarkType(this.remarkOptions, item.id);
          console.log("children:", children);
          if (children.length > 0) {

            //判断节点数据，如果存在children节点，则进行相关操作
            if (item.children && item.children.length > 0) {
              let arr = [...item.children, ...children];
              let depart = [];
              let person = [];
              for (const iterator of arr) {
                if (iterator.type == "depart") {
                  depart.push(iterator);
                } else {
                  person.push(iterator);
                }
              }
              item.children = [...person, ...depart];
            } else {
              item.children = children;
            }
          }
          // item.children =  [...item.children,...children];
          console.log(111111111111111, children);
          item.type = "depart";
          val.push(item);
        }
      }
      // data.forEach(()=> {

      // });

      return val;
    },
    /**
     * 组合组织机构信息构建树结构信息
     *@param {Object} data 组织机构信息
     */
    toTreeData(data) {
      console.log(data);
      var pos = {};
      var tree = [];
      var i = 0;
      var PARENTID = "1";
      if (this.$getUserData("user_type") == 1) {
        for (let item of data) {
          if (item.id == this.$getUserData("org_id")) {
            console.log("tssasd:", item.parent_id);
            PARENTID = item.parent_id;
          }
        }

        // parent_id = this.$getUserData('departid');
      }
      console.log("parent_id:", PARENTID);
      // console.log(data.length != 0)
      // for (var i = 0; i < data.length; i++) {
      while (data.length != 0) {
        console.log(1, data[i].parent_id, i);
        if (data[i].parent_id == PARENTID) {
          // console.log(22)
          var children = [];
          if (data[i].sys_users.length > 0) {
            for (var item of data[i].sys_users) {
              // console.warn(this.contains(this.disabledOptions.list, item.id));
              children.push({
                id: item.id,
                name: item.realname,
                phone: item.phone,
                type: "person",
                //                  parentname: data[i].org_name,
                parent_id: data[i].id,
                disabled: this.contains(this.disabledOptions.list, item.id),
                disableType: this.containsType(
                  this.disabledOptions.list,
                  item.id
                ),
                remark: this.contains(this.remarkOptions, item.id),
                remarkType: this.remarkType(this.remarkOptions, item.id)
              });
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
            type: "depart",
            disabled: this.contains(this.disabledOptions.list, data[i].id),
            disableType: this.containsType(this.disabledOptions.list, item.id),
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
                  parent_id: data[i].id,
                  //                    parentname: data[i].org_name,
                  disabled: this.contains(this.disabledOptions.list, item.id),
                  disableType: this.containsType(
                    this.disabledOptions.list,
                    item.id
                  ),
                  remark: this.contains(this.remarkOptions, item.id),
                  remarkType: this.remarkType(this.remarkOptions, item.id),
                  type: "person"
                });
              }
            }

            obj.children.push({
              id: data[i].id,
              org_code: data[i].org_code,
              name: data[i].org_name,
              org_type: data[i].org_type,
              parent_id: data[i].parent_id,
              type: "depart",
              description: data[i].description,
              children: children,
              disabled: this.contains(this.disabledOptions.list, data[i].id),
              disableType: this.containsType(
                this.disabledOptions.list,
                item.id
              ),
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
      console.log("--------------------------------");
      console.log(tree);
      console.log("--------------------------------");

      return tree;
    },
    /**
     * 判断数组是否存在某个元素
     * @param {Array} arr 数组集合
     * @param {Number,String} obj 查询元素
     */
    contains(arr, obj) {
      // console.warn(arr);
      var i = arr.length;
      // console.log(i, 22222);
      if (i != 0) {
        while (i--) {
          if (arr[i] == obj) {
            return true;
          }
        }
      }
      return false;
    },
    containsType(arr, obj) {
      var i = arr.length;
      if (i != 0) {
        while (i--) {
          if (arr[i] == obj) {
            return this.disabledOptions.name;
          }
        }
      }

      return "禁用";
    },
    remarkType(arr, obj) {
      // console.warn(arr)
      var i = arr.length;
      if (i != 0) {
        while (i--) {
          if (arr[i] === obj) {
            return arr[i].remarkType;
          }
        }
      }
      return "警告";
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
      this.personList = [];
      console.log(data);
      let nodeData = this.$refs.treeChoose.getCheckedNodes();
      console.log(nodeData);
      let num = this.max || 999;
      if (nodeData.length > num) {
        this.$refs.treeChoose.setChecked(data, false, true);
        this.$message({
          message: `最多可选择${num}个用户`,
          type: "warning"
        });
      } else {
        let newdata = JSON.parse(JSON.stringify(nodeData));
        for (let item of newdata) {
          item.children = [];
        }
        for (let item of nodeData) {
          if (item.type == "person") {
            this.personList.push(item);
          }
        }
        // this.$store.dispatch("setApprove", this.personList);
        this.rightTree = this.transData(newdata, "id", "parent_id", "children");
      }
    },

    /**
     * 移除节点
     * @param data
     */
    removeNode(data) {
      this.$refs.treeChoose.setChecked(data, false, true);
    }
  },
  components: {},
  created() {},
  mounted() {
    // console.warn(this.contains(this.disabledOptions.list, '1'))
    if (this.$getUserData("user_type") == 1) {
      this.param.id = JSON.parse(this.$getStore("userData")).org_id;
      // this.param.id = '36af3dc0-6cee-11e7-abaa-e984774ce994'
    }
    // this.getPlOrgListToTree(this.param);
  },
  updated() {},
  watch: {
    filterText(val) {
      this.$refs.treeChoose.filter(val);
    },
    data: {
      handler: function(val, oldval) {
        console.log("测试");
        if (this.orgId != null) {
          const param = {
            id: this.orgId
          };
          this.getPlOrgListToTree(param);
        } else {
          this.getPlOrgListToTree(this.param);
        }
      },
      immediate: true
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
    disabledOptions: {
      //禁用选型
      type: Object,
      default: () => {
        return {
          name: "禁用",
          list: () => []
        };
      }
    },
    remarkOptions: {
      //标注选型
      type: Array,
      default: () => [] //初始化选中值 默认为id集合
    },
    max: {
      //限制数量
      default: null
    },
    orgId: {
      default: null
    }
  }
};
</script>
 <style lang="scss">
.personDialog {
  .departTitle {
    padding: 10px;
  }

  .el-tree-node__content {
    line-height: 36px;
    height: 36px;
    cursor: pointer;
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

  .surround > ul > li {
    list-style: none;
    margin: 10px;
  }

  .selectDepart .el-tree {
    border: 1px solid #fff;
  }

  .checklist {
    padding: 5px;
    list-style: none;
  }
}
</style>
