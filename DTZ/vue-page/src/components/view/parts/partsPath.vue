<template>
  <div class="cell">
      <div class="cell-cascader">
      <el-cascader  @change="selectChange" v-model="selectArea" placeholder="试试搜索：东门" :props="cascaderProps" :options="options" clearable filterable ></el-cascader>
      <el-button  @click="addCell" type="success" icon="el-icon-plus">添加单元网格</el-button>
      </div>
  <base-map :center="center" :height="660" @ready="ready" :zoom="19"></base-map>
  </div>
</template>

<script>
import { transData } from "assets/js/commonManage.js";
import BaseMap from "common/BaseMap";
export default {
  data() {
    return {
      areaData: [],
      options: [],
      selectArea: [],
      cascaderProps: {
        value: "value",
        label: "area_name",
        children: "children"
      },
      center: {
        lng: 103.671826,
        lat: 25.037481
      },
      map: "",
      styleOptions: {
        strokeColor: "red", //边线颜色。
        fillColor: "#00a0e9", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.2, //填充的透明度，取值范围0 - 1。
        strokeStyle: "dashed" //边线的样式，solid或dashed。
      },
       cellOptions: {
        strokeColor: "rgb(255, 80, 53)", //边线颜色。
        fillColor: "rgb(255, 80, 53)", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.8, //填充的透明度，取值范围0 - 1。
        strokeStyle: "solid" //边线的样式，solid或dashed。
      },
      mapCellDInfo: {
        BGSQua: 0,
        scope_path: 0
      },
      drawingManager: ""
    };
  },
  components: {
    BaseMap
  },
  mounted() {
    this.getAreaData();
  },
  methods: {
    /**
       * 新增单元网格
       */
    addCell() {
              this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
      this.drawingManager.open();
    },
    ready({ BMap, map }) {
      // map.setMapStyle({
      //   style: "grayscale"
      // });
      this.map = map;
      this.setMapTool();
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
          scale:0.8,
          offset: new BMap.Size(5, 5), //偏离值
          drawingModes: [BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE]
        },
        enableCalculate: true, //开启面积计算
        polygonOptions: this.cellOptions, //多边形的样式
        rectangleOptions: this.cellOptions //矩形的样式
      });
      // 绘制工具完成后时间监听
      this.drawingManager = drawingManager;
      drawingManager.addEventListener("overlaycomplete", function(e) {
        _self.addMenu(e.overlay);
        _self.mapCellDInfo.BGSQua = BMapLib.GeoUtils
          .getPolygonArea(e.overlay)
          .toFixed(2);
        _self.mapCellDInfo.scope_path = e.overlay.getPath();
      });
    },
    // 添加图层右键菜单
    addMenu(layer) {
      const _self = this;
      var markerMenu = new BMap.ContextMenu();
      markerMenu.addItem(
        new BMap.MenuItem(
          "开启编辑",
          function() {
            console.log(BMapLib);
            layer.enableEditing();
          },
          {
            // iconUrl: require('../../../icons/svg/基础图标/area.svg')
          }
        )
      );
      markerMenu.addItem(
        new BMap.MenuItem("关闭编辑", function() {
          layer.disableEditing();

          _self.mapCellDInfo.BGSQua = BMapLib.GeoUtils
            .getPolygonArea(layer)
            .toFixed(2);
          _self.mapCellDInfo.scope_path = layer.getPath();
        })
      );
      markerMenu.addItem(
        new BMap.MenuItem("删除", _self.removeMarker.bind(layer))
      );
      layer.addContextMenu(markerMenu);
    },
    // 清除地图图层
    removeMarker(e, ee, marker) {
      this.map.removeOverlay(marker);
    },
    selectChange(data) {
      let info = data[data.length - 1];
      console.log(info);

      this.Geocoder(info);

    },
    /**
     * 百度地图逆地址查询
     */
    Geocoder(data) {
      console.log(data);
      let myGeo = new BMap.Geocoder();
      const _self = this;
      myGeo.getPoint(
        data.area_name,
        function(point) {
          _self.map.clearOverlays();
          _self.addPolygon(data);
          if (point) {
            _self.map.panTo(point, {
              noAnimation: false
            });

            _self.map.addOverlay(new BMap.Marker(point));
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
    /**
     * 添加地图图层
     */
    addPolygon(data) {
      const arr = JSON.parse(data.scope_path);
      if (arr != null) {
        let point = arr.map(item => {
          return new BMap.Point(item.lng, item.lat);
        });
        console.log(point);
        var label = new BMap.Label(data.area_name, {
          // offset: new BMap.Size(20, -10)
        });

        let polygonLayer = new BMap.Polygon(point, this.styleOptions); //建立多边形覆盖物
        label.setPosition(polygonLayer.getBounds().getCenter());
        this.map.addOverlay(label);
        polygonLayer.label = label;
        // this.addMenu(polygonLayer);
        this.mapCellDInfo.BGSQua = BMapLib.GeoUtils
          .getPolygonArea(polygonLayer)
          .toFixed(2);

        this.map.addOverlay(polygonLayer);
      }
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
          let data = this.areaData.map(item => {
            item.value = {
              id: item.id,
              area_name: item.area_name,
              scope_path: item.scope_path
            };
            return item;
          });
          this.options = transData(data, "id", "parent_id", "children");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>



<style lang="scss" scoped>
.cell {
  position: relative;
  .cell-cascader {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
}
</style>


