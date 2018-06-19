<template>
  <div class="area">
    <div class="area-table">
      <div style="padding-bottom:20px;">
        <el-button type="success" icon="el-icon-plus" :disabled="setAddDisabled" @click="handleAdd">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="!isEdit" @click="treeNodeDel()">删除</el-button>
      </div>
      <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree :render-content="renderContent" ref="areatree" :filter-node-method="filterNode" v-bind:style="{height:screenHeight-110+'px'}" class="area-tree" :highlight-current="highlightCurrent" @node-click="treeChoose" :data="areData" :props='areaProps'></el-tree>
    </div>
    <div class="area-map">
      <div class="area-map-tool">
        <div class="area-map-title">
          <div style="padding-bottom:10px;">
            <span class="area-map-title-span"> 编辑区域</span>
            <!-- <span> {{mapAreaInfo.area_name}}</span> -->
          </div>
          <!-- <div>
            <span class="area-map-title-span"> 区域面积：</span>
            <span>{{`${mapAreaInfo.calculate}平米`}}</span>


          </div> -->
          <div>
            <!-- <span class="area-map-title-span">坐标位置：</span>
                    <span> {{mapAreaInfo.scope_path}}</span> -->
          </div>
          <el-form :model="mapAreaInfo" style="padding-right:10px;" :rules="this.$validateRule" ref="mapAreaInfo" label-width="90px">
            <el-form-item label="区域名称" prop="area_name">
              <el-input v-model="mapAreaInfo.area_name"></el-input>
            </el-form-item>
            <el-form-item label="区域编号" prop="area_code">
              <el-input v-model="mapAreaInfo.area_code"></el-input>
            </el-form-item>
            <!-- <el-form-item v-if="isEdit" label="父区域">
                    <el-input disabled="" v-model="ruleForm.parent.area_name"></el-input>
                </el-form-item> -->
            <el-form-item label="城乡类别" prop="city_type">
              <el-input v-model="mapAreaInfo.city_type"></el-input>
            </el-form-item>

          </el-form>
          <div style="margin-left: 100px;">
            <el-button :disabled="isDis" @click="saveAreaScope('mapAreaInfo')" type="success">保存</el-button>
          </div>
        </div>
        <div class="area-map-tip">
          <base-icon style="color:#00a0e9;font-size:18px;" icon="tip" /> 通过选择左侧街道或者社区，相关信息同步于下面编辑表单中，也可通过选择地图中相关区域，右键菜单选择开启编辑更新区域
          <!-- 通过使用地图上的绘制工具绘制单元格范围，绘制完成后数据同步于左侧表单中,右键可开启编辑图层 -->
        </div>
        <base-map :center="center" :height="screenHeight" @ready="ready" :zoom="14"></base-map>

      </div>
    </div>
    <el-dialog title="区域新增" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" width="35%">
      <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="110px">
        <el-form-item label="区域名称" prop="area_name">
          <el-input v-model="ruleForm.area_name"></el-input>
        </el-form-item>
        <el-form-item label="区域编号" prop="area_code">
          <el-input v-model="ruleForm.area_code"></el-input>
        </el-form-item>
        <el-form-item v-if="isEdit" label="父区域">
          <el-input disabled="" v-model="ruleForm.parent.area_name"></el-input>
        </el-form-item>
        <el-form-item label="城乡类别" prop="city_type">
          <el-input v-model="ruleForm.city_type"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo=false">取 消</el-button>
        <el-button type="primary" @click="saveAreaInfo('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import BaseMap from "common/BaseMap";
import { transData, getCenterPoint } from "assets/js/commonManage.js";
export default {
  data() {
    return {
      dialogInfo: false,
      ruleForm: {
        area_code: "",
        area_name: "",
        city_type: "",
        scope_path: "",
        parent: {}
      },
      highlightCurrent: true, //高亮
      mark: "",
      areaProps: {
        children: "children",
        label: "area_name"
      },
      areData: [],
      loading: false,

      screenHeight: document.body.clientHeight - 100,
      map: "",
      center: {
        lng: 103.671826,
        lat: 25.037481
      },
      filterText: "",
      isEdit: false,
      mapAreaInfo: {
        area_code: "",
        area_name: "",
        city_type: "",
        id: "",
        parent_id: "",
        scope_path: undefined,
        calculate: 0 //区域面积
      },
      map: "",
      areaLayers: [],
      cache: "",
      editLayer: [],
      styleOptions: {
        strokeColor: "red", //边线颜色。
        fillColor: "#00a0e9", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
        strokeStyle: "dashed" //边线的样式，solid或dashed。
      }
    };
  },
  components: {
    BaseMap
  },
  computed: {
    isDis() {
      let dis = true;
      if (this.mapAreaInfo.id) {
        return false;
        // if (this.mapAreaInfo.scope_path.length > 0) {
        //   dis = false;
        // }
      }
      return dis;
    },
    setAddDisabled() {
      let dis = true;
      if (this.areData.length > 0) {
        //存在节点
        dis = false;
        if (this.isEdit) {
          //是否点击节点
          dis = false;
        } else {
          //未点击节点
          dis = true;
        }
      } else {
        //不存在节点
        dis = false; //新增初始节点
      }
      return dis;
    }
  },
  created() {},
  mounted() {
    console.log("cook", document.cookie);
  },
  methods: {
    /**
     * 删除区域
     * @param {Number} id 区域id
     */
    async treeNodeDel(id) {
      let value = id || this.ruleForm.parent.id;
      console.log("value", value);
      // AreaController
      this.$confirm("此操作将永久删除此区域, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(this.ruleForm.parent);
          const Res = await this.$http.post("/cms/AreaController/delArea", {
            id: value
          });
          if (Res.data.success) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.restMap();
            this.getAreaData();
          } else {
            this.$message.error("操作失败，请重试");
          }
        })
        .catch(() => {});
    },

    /**
     * 新增区域
     */
    handleAdd() {
      this.ruleForm.area_code = "";
      this.ruleForm.area_name = "";
      this.ruleForm.city_type = "";
      this.ruleForm.scope_path = undefined;
      this.dialogInfo = true;
    },
    /**
     * 新增区域接口
     * @param {String} formName 表单名称
     */
    async saveAreaInfo(formName) {
      console.log("-----------------------");
      console.log(this.ruleForm);
      console.log("-----------------------");
      
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.$http.post(
            "/cms/AreaController/saveNewArea",
            this.ruleForm
          );
          console.log(res);
          if (res.data.success) {
            console.log(res);
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.restMap();
            this.getAreaData();
            this.dialogInfo = false;
          } else {
            this.$message.error(res.data.msg);
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 过滤
     * @param {String}  value 输入的值
     * @param {Object} data  数据原形
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.area_name.indexOf(value) !== -1;
    },
    /**
     *树节点点击事件
     *@param {Object} element  传递给 data 属性的数组中该节点所对应的对象
     *@param {Objcet} node   节点对应的 Node
     *@param {Objcet} vm    节点组件本身
     */
    treeChoose(element, node, vm) {
      console.log(node);
      this.highlightCurrent = true;
      if (this.cache.id) {
        this.cache.show = false;
      }
      node.data.show = true;
      this.cache = node.data;
      this.isEdit = true;
      this.setEdit(node.data);
      // this.Geocoder(node.data)
    },
    /**
     * tree 渲染
     * @param  {Funciton} h  render函数简写
     * @param {Object} node 当前节点
     * @param {Object} data 数据原形
     * @returns {String}
     */
    renderContent(h, { node, data, store }) {
      console.log(data);
      return (
        <span style="flex: 1;  display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
            <span
              style="padding-left:10px;color:#409EFF"
              v-show={data.scope_path != null}
            >
              【已绘】
            </span>
          </span>
          <span>
            <el-button
              v-show={data.show}
              style="font-size: 12px;"
              type="text"
              on-click={() => this.cancleClick(node, data, store)}
            >
              取消选中
            </el-button>
          </span>
        </span>
      );
    },
    /**
     * @desc 取消选择
     * @param {Object} node node节点
     * @param {Object} data 节点数据
     * @param {Object} store  所有节点数据
     * @returns *
     */
    cancleClick(node, data, store) {
      console.log("冒泡");
      console.log(node, data, store);
      console.log(event);
      this.highlightCurrent = false;
      data.show = false;
      this.isEdit = false;
      event.cancelBubble = true; //阻止事件冒泡
      this.mapAreaInfo = {
        area_code: "",
        area_name: "",
        city_type: "",
        id: "",
        parent_id: "",
        scope_path: undefined,
        calculate: 0 //区域面积
      };
    },
    /**
     *@description 保存区域
     * @param {String } formName    表单名称
     */
    async saveAreaScope(formName) {
      console.log("-------------------------");
      console.log(this.ruleForm);
      console.log("-------------------------");
      
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(222);
          if (this.mapAreaInfo.id !== "") {
            try {
              const Res = await this.$http.post(
                "/cms/AreaController/saveAreaScope",
                this.mapAreaInfo
              );
              if (Res) {
                console.log(Res);
                if (Res.data.success) {
                  this.$message.success("更新成功");
                  this.restMap();
                  this.getAreaData();
                } else {
                  this.$message.error(Res.data.msg);
                }
              }
            } catch (error) {
              this.$message.error("网络不稳的，请重试");
            }
          }
        } else {
          return false;
        }
      });
    },

    /**
    @description 重置表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * @desc 重置地图选择，工具等
     */
    restMap() {
      this.mark = "";
      (this.mapAreaInfo = {
        area_code: "",
        area_name: "",
        city_type: "",
        id: "",
        parent_id: "",
        scope_path: undefined,
        calculate: 0 //区域面积
      }),
        (this.editLayer = []);
    },
    /**
     * @desc 地图初始化
     */
    ready({ BMap, map }) {
      // map.setMapStyle({
      //   style: "grayscale"
      // });
      const VM = this;
      VM.screenHeight = document.body.clientHeight - 100;
      window.addEventListener("resize", function() {
        VM.screenHeight = document.body.clientHeight - 100;
      });

      console.log(this.screenHeight);
      this.map = map;
      this.setMapTool();
      this.getAreaData();
    },
    // 添加地图绘制工具
    setMapTool() {
      //实例化鼠标绘制工具
      const _self = this;
      var drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [BMAP_DRAWING_POLYGON]
        },
        enableCalculate: false, //开启面积计算
        polygonOptions: this.styleOptions, //多边形的样式
        rectangleOptions: this.styleOptions //矩形的样式
      });
      // 绘制工具完成后时间监听
      drawingManager.addEventListener("overlaycomplete", function(e) {
        _self.addMenu(e.overlay);
        _self.mapAreaInfo.calculate = BMapLib.GeoUtils.getPolygonArea(
          e.overlay
        ).toFixed(2);
        _self.mapAreaInfo.scope_path = e.overlay.getPath();
      });
    },

    // 添加图层右键菜单
    addMenu(layer) {
      const _self = this;
      var markerMenu = new BMap.ContextMenu();
      if (layer.data) {
        markerMenu.addItem(
          new BMap.MenuItem(
            "编辑",
            function() {
              console.log(layer);
              _self.setmapAreaInfo(layer.data);
              layer.enableEditing();
            },
            {
              // iconUrl: require('../../../icons/svg/基础图标/area.svg')
            }
          )
        );
        markerMenu.addItem(
          new BMap.MenuItem("保存", function() {
            layer.disableEditing();
            _self.setmapAreaInfo(layer.data);
            _self.mapAreaInfo.calculate = BMapLib.GeoUtils.getPolygonArea(
              layer
            ).toFixed(2);
            _self.mapAreaInfo.scope_path = layer.getPath();
            _self.saveAreaScope("mapAreaInfo");
          })
        );
      }

      markerMenu.addItem(
        new BMap.MenuItem("删除", _self.removeMarker.bind(layer))
      );
      layer.addContextMenu(markerMenu);
    },
    // 清除地图图层
    removeMarker(e, ee, marker) {
      if (marker.data) {
        this.getCellInfo(marker.data.id);
      } else {
        this.map.removeOverlay(marker);
      }
    },

    /**
    @description 获取区域内单元格信息 
    @param {String} id  区域id
    */
    async getCellInfo(id) {
      let Res = await this.$http.get("/cms/AreaController/quearCellByAreaId", {
        params: {
          id: id
        }
      });
      console.log(Res);
      if (Res.data.success) {
        if (Res.data.result > 0) {
          this.$message({
            message: "当前区域存在相关单元格，请先删除单元格在进行区域删除操作",
            type: "warning"
          });
        } else {
          this.mapAreaDel(id);
          // this.treeNodeDel(id);
        }
      }
    },
    async mapAreaDel(id) {
      let param = {
        id: id,
        scope_path: undefined
      };
      const Res = await this.$http.post(
        "/cms/AreaController/saveAreaScope",
        param
      );
      if (Res) {
        console.log(Res);
        if (Res.data.success) {
          this.$message.success("删除成功");
          this.restMap();
          this.getAreaData();
        } else {
          this.$message.error(Res.data.msg);
        }
      }
    },
    setEdit(row) {
      // this.mapAreaInfo = Object.assign({}, row);
      this.resetForm("mapAreaInfo");
      this.setmapAreaInfo(row);

      this.setAddAreaInfo(row);

      //地图图层控制
      if (this.mapAreaInfo.scope_path != null) {
        if (this.mapAreaInfo.scope_path.length > 0) {
          this.map.panTo(getCenterPoint(this.mapAreaInfo.scope_path), {
            noAnimation: false
          });
          if (this.editLayer.length > 0) {
            console.log(222);
            this.editLayer[0].setStrokeStyle("dashed");
            this.editLayer[0].setStrokeColor("red");
          }
          this.areaLayers.forEach(item => {
            if (item.data.id == row.id) {
              console.log(this.editLayer);
              this.editLayer = [item];
              item.setStrokeColor("blue");
              item.setStrokeStyle("solid");
            }
          });
        }
      } else {
        console.log(22222);
        this.Geocoder(this.mapAreaInfo);
      }
    },
    //新增对象赋值操作
    setAddAreaInfo(row) {
      this.ruleForm.parent = row;
    },

    //地图对象赋值操作
    setmapAreaInfo(row) {
      this.mapAreaInfo.area_code = row.area_code;
      this.mapAreaInfo.area_name = row.area_name;
      this.mapAreaInfo.city_type = row.city_type;
      this.mapAreaInfo.id = row.id;
      this.mapAreaInfo.parent_id = row.parent_id;
      this.mapAreaInfo.scope_path = row.scope_path;
      this.mapAreaInfo.calculate = 0;
    },
    /**
     * 添加地图图层
     */
    addPolygon(data) {
      const arr = data.scope_path;
      console.log(11, arr);
      if (arr != null) {
        let point = arr.map(item => {
          return new BMap.Point(item.lng, item.lat);
        });
        console.log(point);
        // var label = new BMap.Label(this.mapAreaInfo.area_name, {
        //   // offset: new BMap.Size(20, -10)
        // });
        var label = new BMap.Label(data.area_name, {
          // offset: new BMap.Size(20, -10)
        });

        let polygonLayer = new BMap.Polygon(point, this.styleOptions); //建立多边形覆盖物
        polygonLayer.data = data;
        label.setPosition(getCenterPoint(polygonLayer.getPath()));
        this.map.addOverlay(label);
        polygonLayer.label = label;
        this.addMenu(polygonLayer);
        // this.mapAreaInfo.calculate = BMapLib.GeoUtils
        //   .getPolygonArea(polygonLayer)
        //   .toFixed(2);

        this.areaLayers.push(polygonLayer);
        this.map.setViewport(polygonLayer.getPath()); //调整视野
        this.map.addOverlay(polygonLayer);
      }
    },
    /**
     * 百度地图逆地址查询
     */
    Geocoder(data) {
      let myGeo = new BMap.Geocoder();
      console.log(myGeo);
      const _self = this;
      myGeo.getPoint(
        data.area_name,
        function(point) {
          _self.map.removeOverlay(_self.mark);
          // _self.addPolygon(data);
          if (point) {
            console.log(point);
            _self.map.panTo(point, {
              noAnimation: false
            });
            _self.mark = new BMap.Marker(point);
            _self.map.addOverlay(_self.mark);
          } else {
            _self.$message({
              message: "当前地址搜索无定位信息，请手动拖动地图查找",
              type: "warning"
            });
          }
        },
        "陆良县"
      );
    },

    /**@augments
     * 获取区域信息
     */
    async getAreaData() {
      this.loading = true;
      try {
        const res = await this.$http.get(
          "/cms/AreaController/queryAllAreaData"
        );
        if (res.data && res.data.success) {
          this.map.clearOverlays();
          this.areaLayers = [];
          let setData = res.data.result.map(item => {
            item.show = false;
            if (item.scope_path) {
              item.scope_path = JSON.parse(item.scope_path);
            } else {
              item.scope_path = undefined;
            }
            // this.addPolygon(item);
            return item;
          });
          console.warn(setData);
          this.setLayer(setData.length - 1, setData);
          this.areData = transData(setData, "id", "parent_id", "children");
          console.log(this.areData);
        } else {
          this.$message.waring(res.data.msg);
        }
        this.loading = false;
      } catch (err) {
        this.$message.error("网络不稳的，请重试");
        this.loading = false;
      }
    },

    /**
     @description 递归生成图层 */
    setLayer(n, data) {
      // console.log("递归:", data[n]);
      if (n < 0) return true;
      // setTimeout(() => {
      this.addPolygon(data[n]);
      return this.setLayer(n - 1, data);
      // }, 100);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.areatree.filter(val);
    }
  }
};
</script>

<style lang="scss">
.area {
  overflow: hidden;
  display: flex;
  .area-table {
    flex: 0.3;
    width: 400px;
    .area-tree {
      margin-top: 10px;
      /* height: 680px; */
      height: 100%;
      overflow: auto;
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: #e6a23c !important;
    }
  }
  .area-map {
    flex: 1;
    .area-map-tool {
      position: relative;
      .area-map-title {
        width: 250px;
        border-radius: 10px;
        border: 3px solid #ffc614;
        // border: 1px solid #ccc;
        background: #fff;
        color: rgb(209, 47, 35);
        position: absolute; // font-size: 18px;
        // font-weight: 700;
        padding: 5px;
        top: 45px;
        left: 10px;
        z-index: 1;
        -moz-box-shadow: 0px 0px 10px #333333;
        -webkit-box-shadow: 0px 0px 10px #333333;
        box-shadow: 0px 0px 10px #333333;

        .area-map-title-span {
          color: rgb(2, 1, 1);
        }
      }
      .area-map-tip {
        position: absolute;
        top: 0px;
        left: 5px;
        padding: 10px;
        font-size: 12px;
        background: rgba(201, 176, 35, 0.6);
        border: 1px solid rgba(255, 0, 0, 0.247);
        z-index: 1;
      }
    }
  }
}
</style>
