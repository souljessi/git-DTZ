<template>
  <div class="cellTable">

    <div class="cellFrom">
      <el-button type="text" @click="backClick">
        <base-icon icon="back" />返回</el-button>
      <el-form :model="cellForm" :rules="this.$validateRule" ref="cellForm" label-width="100px">
        <el-form-item label="所属区域" prop="area_id">
          <el-cascader v-if="!isEdit" @change="selectChange" placeholder="试试搜索：东门" :props="cascaderProps" :options="options" clearable filterable></el-cascader>
          <el-input v-else disabled style="width:193px;" v-model="editCellName" />
          <span>
            <el-tooltip class="item" effect="dark" content="未绘制的区域无法添加单元格" placement="right-start">
              <base-icon icon='warn' />
            </el-tooltip>
          </span>
        </el-form-item>

        <el-form-item label="范围坐标" prop="scope_path">
          <el-input disabled placeholder="请通过地图选择" style="width:193px;" v-model="cellForm.scope_path"></el-input>
        </el-form-item>
        <el-form-item label="范围面积" prop="BGSQua">
          <el-input disabled placeholder="通过地图绘制会自动计算" style="width:193px;" v-model="cellForm.BGSQua">
            <template slot="append">平米</template>
          </el-input>

        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input style="width:193px;" type="textarea" :rows="2" placeholder="请输入内容" v-model="cellForm.Note"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="addCell" style="margin-left:130px;" type="success">保存</el-button>
    </div>
    <div class="cellMap">
      <div class="cellMap-content">
        <div class="cellMap-content-tip">
          <base-icon style="color:#00a0e9;font-size:18px;" icon="tip" /> 通过使用地图上的绘制工具绘制单元格范围，绘制完成后数据同步于左侧表单中,右键可开启编辑图层
        </div>
        <base-map :center="center" :height="screenHeight" @ready="ready"></base-map>
      </div>
    </div>

  </div>
</template>

<script>
import { transData } from "assets/js/commonManage.js";
import BaseMap from "common/BaseMap";
export default {
  data() {
    return {
      screenHeight: document.body.clientHeight - 100,
      cellForm: {
        area_id: "",
        scope_path: "",
        BGSQua: 0,
        area_code: "",
        Note: ""
      },
      map: "",
      center: {
        lng: 103.671826,
        lat: 25.037481
      },
      areaData: [],
      cascaderProps: {
        value: "value",
        label: "area_name",
        children: "children",
        disabled: "disabled"
      },
      options: [],
      styleOptions: {
        strokeColor: "red", //边线颜色。
        fillColor: "#00a0e9", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
        strokeStyle: "dashed" //边线的样式，solid或dashed。
      },
      cellOptions: {
        strokeColor: "rgb(255, 208, 75)", //边线颜色。
        fillColor: "rgba(255, 80, 53, 0.8)", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.8, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      },
      mapCellDInfo: {
        BGSQua: 0,
        scope_path: 0
      },
      cellData: [],
      isEdit: false,
      editCellName: "",
      selectArea: {}
    };
  },
  components: {
    BaseMap
  },
  created() {
    if (this.$route.query.areaId) {
      this.isEdit = true;
    }
  },
  mounted() {
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 50;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 50;
    });
    console.log("mount");
    this.getAreaData();
    // console.log(this.$route);
  },
  methods: {
    backClick() {
      this.$router.push("/cellTable");
    },
    /**
     * 通过区域id查询单元格信息
     * @param {String} id  区域id
     */
    async getCellData(data) {
      try {
        const Res = await this.$http.get(
          "/cms/CellController/queryCellListByAreaId",
          {
            params: {
              area_id: data.id
            }
          }
        );
        if (Res) {
          console.log(111, Res);
          if (Res.data.success) {
            this.cellData = Res.data.result;

            this.Geocoder(data);
            console.log("celldata", this.cellData);
            if (this.isEdit) {
              console.log(this.BGID);
              this.cellData.map(item => {
                if (item.BGID == this.$route.query.BGID) {
                  let _self = this;
                  _self.cellForm.id = item.id;
                  _self.cellForm.area_id = item.area_id;
                  _self.cellForm.scope_path = item.scope_path;
                  _self.cellForm.BGSQua = item.BGSQua;
                  _self.cellForm.area_code = item.area_code;
                  _self.cellForm.BGID = item.BGID;
                  // this.cellForm.area_code = layer.data.area_code;
                  _self.cellForm.Note = item.Note;
                }
              });
            }
          } else {
            this.$message.error(Res.data.msg);
          }
        }
      } catch (error) {
        this.$message.error(error);
        console.log(error);
      }
    },
    /**
     * 添加单元格
     */
    async addCell() {
      let data = Object.assign({}, this.cellForm);
      data.scope_path = JSON.parse(data.scope_path);
      console.log("提交：", data);
      try {
        const Res = await this.$http.post(
          "/cms/CellController/doAddOrUpdateCell",
          data
        );
        if (Res) {
          if (Res.data.success) {
            if (Res.data.result) {
              this.cellForm.id = Res.data.result.id;
              this.cellForm.BGID = Res.data.result.BGID;
            }
            this.$message.success("保存成功");
            this.map.clearOverlays();
            this.startData(this.selectArea);
          } else {
            this.$message.error("保存失败，请从新绘制或刷新");
          }
        }
      } catch (error) {
        this.$message.error(error);
        console.log(error);
      }
    },
    /**
     * 添加地图图层
     */
    addCellPolygon(data) {
      const arr = JSON.parse(data.scope_path);
      console.log("arr:", data);
      if (arr != null) {
        let point = arr.map(item => {
          return new BMap.Point(item.lng, item.lat);
        });
        console.log(point);
        var label = new BMap.Label(data.BGID, {
          offset: new BMap.Size(-20, -10)
        });

        let polygonLayer = new BMap.Polygon(point, this.cellOptions); //建立多边形覆盖物
        label.setPosition(polygonLayer.getBounds().getCenter());
        this.map.addOverlay(label);
        polygonLayer.label = label;
        polygonLayer.data = data;
        this.addMenu(polygonLayer, label);
        // this.mapCellDInfo.BGSQua = BMapLib.GeoUtils
        //   .getPolygonArea(polygonLayer)
        //   .toFixed(2);

        this.map.addOverlay(polygonLayer);
      }
    },
    /**
     * 地图初始化
     */
    ready({ BMap, map }) {
      console.log("ready");
      // map.setMapStyle({
      //   style: "grayscale"
      // });
      this.map = map;
      if (!this.isEdit) {
        this.setMapTool();
      }
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
          scale: 0.8,
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [BMAP_DRAWING_POLYGON]
        },
        enableCalculate: false, //开启面积计算
        polygonOptions: this.cellOptions, //多边形的样式
        rectangleOptions: this.cellOptions //矩形的样式
      });
      // 绘制工具完成后时间监听
      this.drawingManager = drawingManager;
      drawingManager.addEventListener("overlaycomplete", function(e) {
        var label = new BMap.Label("新增单元格", {
          offset: new BMap.Size(-20, 0)
        });
        e.overlay.label = label;
        _self.addMenu(e.overlay);

        label.setPosition(e.overlay.getBounds().getCenter());
        _self.map.addOverlay(label);

        _self.cellForm.BGSQua = BMapLib.GeoUtils.getPolygonArea(
          e.overlay
        ).toFixed(0);
        _self.cellForm.BGID = undefined;
        _self.cellForm.Note = "";
        _self.cellForm.id = undefined;
        _self.cellForm.scope_path = JSON.stringify(e.overlay.getPath());
      });
    },
    /**
     * 添加地图图层
     */
    addPolygon(data) {
      console.log(444, data);
      const arr = JSON.parse(data.scope_path);
      if (arr != null) {
        let point = arr.map(item => {
          return new BMap.Point(item.lng, item.lat);
        });
        console.log(point);
        var label = new BMap.Label(data.area_name, {
          offset: new BMap.Size(-20, 0)
        });

        let polygonLayer = new BMap.Polygon(point, this.styleOptions); //建立多边形覆盖物
        label.setPosition(polygonLayer.getBounds().getCenter());
        this.map.addOverlay(label);
        polygonLayer.label = label;
        // this.addMenu(polygonLayer);
        // this.mapCellDInfo.BGSQua = BMapLib.GeoUtils
        //   .getPolygonArea(polygonLayer)
        //   .toFixed(2);
        this.map.setViewport(polygonLayer.getPath()); //调整视野
        this.map.addOverlay(polygonLayer);
      }
    },
    // 添加图层右键菜单
    addMenu(layer, label) {
      console.log("添加右键工具");
      const _self = this;
      var markerMenu = new BMap.ContextMenu();
      markerMenu.addItem(
        new BMap.MenuItem(
          "编辑",
          function() {
            console.log(layer.data);
            if (layer.data) {
              _self.cellForm.id = layer.data.id;
              _self.cellForm.area_id = layer.data.area_id;
              _self.cellForm.scope_path = layer.data.scope_path;
              _self.cellForm.BGSQua = layer.data.BGSQua;
              _self.cellForm.BGID = layer.data.BGID;
              _self.cellForm.area_code = layer.data.area_code;
              _self.cellForm.Note = layer.data.Note;
            } else {
              _self.cellForm.id = undefined;
            }

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
          if (label) {
            label.setPosition(layer.getBounds().getCenter());
          }
          _self.cellForm.BGSQua = BMapLib.GeoUtils.getPolygonArea(
            layer
          ).toFixed(0);
          _self.cellForm.scope_path = JSON.stringify(layer.getPath());
          _self.addCell();
        })
      );
      markerMenu.addItem(
        new BMap.MenuItem("删除", _self.removeMarker.bind(layer))
      );
      layer.addContextMenu(markerMenu);
    },
    // 清除地图图层
    removeMarker(e, ee, marker) {
      console.log("删除", marker);
      if (marker.data) {
        this.$confirm("此操作将永久删除该单元格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delCell(marker);
          })
          .catch(() => {});
      } else {
        this.map.removeOverlay(marker.label);
        this.map.removeOverlay(marker);
      }
    },

    async delCell(marker) {
      let id = marker.data.id;
      let Res = await this.$http.post("/cms/CellController/deltCell", {
        id: id
      });
      if (Res.data.success) {
        this.$message.success("删除成功");
        // this.map.removeOverlay(marker.label);
        // this.map.removeOverlay(marker);
        this.map.clearOverlays();
        this.startData(this.selectArea);
      } else {
        this.$message.waring("删除失败,请重试");
      }
    },

    isEditType() {
      if (this.isEdit) {
        // this.isEdit = true;
        console.log(2123);
        console.log(this.areaData);
        this.areaData.map(item => {
          console.log(this.$route.query.areaId);
          if (item.id == this.$route.query.areaId) {
            this.editCellName = item.area_name;
            this.selectArea = item;
            // this.cellForm.area_id = item.id;
            // this.cellForm.area_code = item.area_code;
          }
        });
        console.log(222, this.selectArea);
        this.startData(this.selectArea);
      }
    },

    startData(data) {
      this.getCellData(data);
      // this.Geocoder(data);
    },
    /**
     * 获取区域信息
     */
    async getAreaData() {
      try {
        const res = await this.$http.get(
          "/cms/AreaController/queryAllAreaData"
        );
        console.log("333", res);
        if (res.data.success) {
          this.areaData = res.data.result;
          this.isEditType();
          let data = this.areaData.map(item => {
            item.value = {
              id: item.id,
              area_code: item.area_code,
              area_name: item.area_name,
              scope_path: item.scope_path
            };
            // let parentIds = item.parent_ids.split(",");
            // let path = JSON.parse(item.scope_path);
            // if (parentIds.length > 3 && path == null) {
            //   item.disabled = true;
            // } else {
            //   item.disabled = false;
            // }
            return item;
          });
          this.options = transData(data, "id", "parent_id", "children");
          this.options = this.orgOtions(this.options);
        }
      } catch (error) {
        console.log(error);
      }
    },
    orgOtions(data) {
      data.forEach(item => {
        if (!item.children) {
          let path = JSON.parse(item.scope_path);
          if (path == null) {
            item.disabled = true;
          }
        } else {
          item.children = this.orgOtions(item.children);
        }
      });
      console.warn(data);

      return data;
    },
    selectChange(data) {
      console.log(33333, data);
      let info = data[data.length - 1];
      this.cellForm.area_id = info.id;
      this.cellForm.area_code = info.area_code;
      this.selectArea = info;
      this.map.clearOverlays();
      this.getCellData(info);
    },
    /**
     * 百度地图逆地址查询
     */
    Geocoder(data) {
      console.log(3333, data);
      let myGeo = new BMap.Geocoder();
      const _self = this;
      myGeo.getPoint(
        data.area_name,
        function(point) {
          // _self.map.clearOverlays();
          _self.addPolygon(data);
          _self.cellData.map(item => {
            _self.addCellPolygon(item);
          });
          if (point) {
            // _self.map.panTo(point, {
            //   noAnimation: false
            // });
            // _self.map.addOverlay(new BMap.Marker(point));
          } else {
            _self.$message({
              message: "当前地址搜索无定位信息，请手动拖动地图查找",
              type: "warning"
            });
          }
        },
        "陆良县"
      );
    }
  }
};
</script>


<style lang="scss" scoped>
.cellTable {
  display: flex;
  .cellFrom {
    flex: 0.35;
    padding: 20px 0;
    width: 320px;
  }

  .cellMap {
    flex: 1;
    .cellMap-content {
      position: relative;
      .cellMap-content-tip {
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
