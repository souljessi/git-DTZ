<template>
  <div class="area">
    <div class="area-table">
      <el-form :inline="true" size="mini" label-width="80px" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="区域名称">
          <el-input size="mini" v-model="formInline.area_name" placeholder="区域名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <!-- <el-button  size="mini" type="info" icon="el-icon-refresh"  @click="resetForm('formInline')">
                    重置</el-button> -->
          <!-- <el-button  type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button> -->
        </el-form-item>
      </el-form>
      <el-table :data="areData" :height="screenHeight-110" v-loading="loading">
        <el-table-column prop="area_code" label="区域编码"></el-table-column>
        <el-table-column prop="area_name" label="区域名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="setEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes"
        :pageSize="tabPage.pageSize" :total="tabPage.totalNum">

      </paging>
    </div>
    <div class="area-map">
      <div class="area-map-tool">
        <div class="area-map-title">
          <div>
            <span class="area-map-title-span"> 区域名称：</span>
            <span> {{mapAreaInfo.area_name}}</span>
          </div>
          <div>
            <span class="area-map-title-span"> 区域面积：</span>
            <span>{{`${mapAreaInfo.calculate}平米`}}</span>


          </div>
          <div>
            <!-- <span class="area-map-title-span">坐标位置：</span>
                    <span> {{mapAreaInfo.scope_path}}</span> -->
          </div>
          <div style="margin-left: 60px;">
            <el-button :disabled="isDis" @click="saveAreaScope" type="success">更改</el-button>
          </div>
        </div>
        <base-map :center="center" :height="660" @ready="ready" :zoom="14"></base-map>

      </div>
    </div>
  </div>
</template>


<script>
  import paging from "common/BasePaging.vue";
  import BaseMap from "common/BaseMap";
  export default {
    data() {
      return {
        formInline: {
          area_name: ""
        },
        areData: [],
        loading: false,
        tabPage: {
          currentPage: 1,
          pageSize: 15,
          pageSizes: [15, 30, 50]
        }, //分页信息
        screenHeight: document.body.clientHeight - 100,
        map: "",
        center: {
          lng: 103.671826,
          lat: 25.037481
        },
        mapAreaInfo: {
          area_code: "",
          area_name: "",
          city_type: "",
          id: "",
          parent_id: "",
          scope_path: null,
          calculate: 0 //区域面积
        },
        map: "",
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
      paging,
      BaseMap
    },
    computed: {
      isDis() {
        let dis = true;
        if (this.mapAreaInfo.scope_path) {
          if (this.mapAreaInfo.scope_path.length > 0) {
            dis = false;
          }
        }
        return dis;
      }
    },
    mounted() {
      const VM = this;
      VM.screenHeight = document.body.clientHeight - 100;
      window.addEventListener("resize", function () {
        VM.screenHeight = document.body.clientHeight - 100;
      });
      this.getAreaData();
      console.log("cook", document.cookie);
    },
    methods: {
      //保存区域范围
      async saveAreaScope() {
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
              } else {
                this.$message.error(Res.data.msg);
              }
            }
          } catch (error) {
            this.$message.error("网络不稳的，请重试");
          }
        }
      },
      //   地图初始化
      ready({
        BMap,
        map
      }) {
        map.setMapStyle({
          style: "grayscale"
        });
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
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE]
          },
          enableCalculate: false, //开启面积计算
          polygonOptions: this.styleOptions, //多边形的样式
          rectangleOptions: this.styleOptions //矩形的样式
        });
        // 绘制工具完成后时间监听
        drawingManager.addEventListener("overlaycomplete", function (e) {
          _self.addMenu(e.overlay);
          _self.mapAreaInfo.calculate = BMapLib.GeoUtils
            .getPolygonArea(e.overlay)
            .toFixed(2);
          _self.mapAreaInfo.scope_path = e.overlay.getPath();
        });
      },

      // 添加图层右键菜单
      addMenu(layer) {
        const _self = this;
        var markerMenu = new BMap.ContextMenu();
        markerMenu.addItem(
          new BMap.MenuItem(
            "开启编辑",
            function () {
              console.log(BMapLib);
              layer.enableEditing();
            }, {
              // iconUrl: require('../../../icons/svg/基础图标/area.svg')
            }
          )
        );
        markerMenu.addItem(
          new BMap.MenuItem("关闭编辑", function () {
            layer.disableEditing();

            _self.mapAreaInfo.calculate = BMapLib.GeoUtils
              .getPolygonArea(layer)
              .toFixed(2);
            _self.mapAreaInfo.scope_path = layer.getPath();
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
      setEdit(index, row) {
        // this.mapAreaInfo = Object.assign({}, row);
        this.mapAreaInfo.area_code = row.area_code;
        this.mapAreaInfo.area_name = row.area_name;
        this.mapAreaInfo.city_type = row.city_type;
        this.mapAreaInfo.id = row.id;
        this.mapAreaInfo.parent_id = row.parent_id;
        this.mapAreaInfo.scope_path = JSON.parse(row.scope_path);
        this.mapAreaInfo.calculate = 0;
        this.Geocoder(this.mapAreaInfo);
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
          var label = new BMap.Label(this.mapAreaInfo.area_name, {
            // offset: new BMap.Size(20, -10)
          });

          let polygonLayer = new BMap.Polygon(point, this.styleOptions); //建立多边形覆盖物
          label.setPosition(polygonLayer.getBounds().getCenter());
          this.map.addOverlay(label);
          polygonLayer.label = label;
          this.addMenu(polygonLayer);
          this.mapAreaInfo.calculate = BMapLib.GeoUtils
            .getPolygonArea(polygonLayer)
            .toFixed(2);

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
          function (point) {
            _self.map.clearOverlays();
            _self.addPolygon(data);
            if (point) {
              console.log(point);
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
      onSearch() {
        this.getAreaData(this.formInline);
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.getAreaData();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.getAreaData();
      },
      /**@augments
       * 获取区域信息
       */
      async getAreaData(params) {
        let data = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize
        };
        if (params) {
          data = Object.assign(data, params);
        }
        this.loading = true;
        try {
          const res = await this.$http.get(
            "/cms/AreaController/queryAllAreaList", {
              params: data
            }
          );
          if (res.data && res.data.success) {
            this.areData = res.data.result.rows;
            this.tabPage.totalNum = res.data.result.count;
          } else {
            this.$message.waring(res.data.msg);
          }
          this.loading = false;
        } catch (err) {
          this.$message.error("网络不稳的，请重试");
          this.loading = false;
        }
      }
    }
  };

</script>

<style lang="scss">
  .area {
    overflow: hidden;
    display: flex;
    .area-table {
      flex: 0.2;
      width: 400px;
    }
    .area-map {
      flex: 1;
      .area-map-tool {
        position: relative;
        .area-map-title {
          width: 210px;
          background: #fff;
          color: rgb(209, 47, 35);
          position: absolute; // font-size: 18px;
          // font-weight: 700;
          padding: 5px;
          top: 10px;
          left: 10px;
          z-index: 1;

          .area-map-title-span {
            color: rgb(2, 1, 1);
          }
        }
      }
    }
  }

</style>
