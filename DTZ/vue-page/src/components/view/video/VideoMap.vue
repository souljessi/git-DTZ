<template>
  <div class="video-map">
    <base-map :height='vMapHeight' :zoom='16' @ready="mapReady"></base-map>
    <base-video :url='src' :title="title" :selectData='selectData' :visable='visable' @close="close"></base-video>
    <div class="video-tree">
      <div class="tree-button" @click="back">
        <span>
          <base-icon icon='back' />
        </span>
        <span>
          返回视频监控平台
        </span>
      </div>
      <div class="tree-main" v-loading="treeLoading">
        <el-input v-model="filterText" placeholder="请输入设备名称" clearable></el-input>
        <el-tree ref="videoTree" node-key="id" :data="videoData" :filter-node-method="filterNode" :default-expand-all='true' :props='treeProps' @node-click="videoNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-show="data.type==2">
              <base-icon icon='bumen' style="color:#00a0e9" />
              <span>{{node.label}}</span>
            </span>
            <span v-show="data.type!=2">
              <base-icon :class="[data.status==0?'video-out':'video-default']" :icon='data.type==0?"qiuji":data.type==1?"qiangji":"bumen"' />
              <span :class="[data.status==0?'video-out':'']">{{node.label}}{{data.status==0?' [离线]':''}}</span>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="control-map-tool">
      <div class="control-content-tool">
        <div title="区域选择" :class="['control-content-tool-item',toolMode==1?'contlor-content-tool-color':'']" @click="setTool(1)">
          <div>
            <base-icon class="control-icon" icon="quyu" />
          </div>
          <!-- <span>区域选择</span> -->
        </div>
        <div title="单元选择" :class="['control-content-tool-item',toolMode==2?'contlor-content-tool-color':'']" @click="setTool(2)">
          <div>
            <base-icon class="control-icon" icon="danyuange" />
          </div>
          <!-- <span>单元选择</span> -->
        </div>
        <div title="重置" :class="['control-content-tool-item',showall?'contlor-content-tool-color':'']" @click="showAllClick()">
          <div>
            <i class="el-icon-refresh" style="font-size:25px;margin-bottom:3px;" />
            <!-- <base-icon class="control-icon" :icon="showreli?'reli':'reliyincan'" /> -->
          </div>
          <!-- <span style="font-size:12px">重置</span> -->

        </div>
      </div>
    </div>
    <div class="video-search">
      <el-input v-model="videoSearch" size="medium" placeholder="尝试搜索街道或建筑物，如“ 中枢大厦 ”" id='suggestId'>
        <div slot="append">
          <div class="video-search-button">
            <div class="button-close" v-show="searchShow" @click="clearButton">
              <el-tooltip effect="dark" content="清空" placement="bottom">
                <base-icon icon='close' />
              </el-tooltip>
            </div>
            <div class="button-enter" @click="searchBaiDu">
              <el-tooltip effect="dark" content="搜索" placement="bottom">
                <base-icon style="font-size:20px;" icon='search' />
              </el-tooltip>
            </div>
          </div>
        </div>

      </el-input>

      <div :class="['video-search-content',isall?'animation':'flodAnimation']" @mouseover="overShow" v-show="searchShow">
        <div class="content-title">
          您好，当前位置500m范围内搜索到
          <b>{{searchList.length}}</b> 个设备
        </div>
        <div class="contetn-list">
          <div class="list" v-for="(item,index) in searchList" :key="index" @click="videoNodeClick(item)">
            <div class="item2">
              <base-icon class="icon" :icon='item.type==0?"qiuji":item.type==1?"qiangji":"bumen"' />
            </div>
            <div class="item1">
              <div class="title">
                {{item.name}}
              </div>
              <div>
                <span :class="[item.status==0?'video-out':'']">状态：
                  <b>{{item.status==0?' 离线':'正常'}}</b>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <base-video-list :videoData='searchVideoData' :visable='vidoeVisable' @close=viodeClose></base-video-list>
  </div>
</template>

<script>
import BaseMap from 'common/BaseMap';
import dataJson from './data.json';
import {
  transData,
  toTree,
  addMapLayer,
  getCenterPoint
} from 'assets/js/commonManage';
import BaiduCustomWinInfo from 'assets/js/baiduCustomWinInfo';
import BaseVideo from 'common/BaseVideo';
import BaseVideoList from 'common/BaseVideoList.vue';
export default {
  name: 'video-map',
  data() {
    return {
      isall: true,
      searchShow: false,
      searchList: [],
      searchMark: '',
      videoSearch: '',
      treeLoading: false,
      videoData: [],
      map: '',
      videoMarkerClusterer: '',
      videoMarks: '',
      windowInfo: '',
      src: '',
      title: '',
      selectData: {},
      visable: false,
      test: false,
      filterText: '',
      treeProps: {
        children: 'children',
        label: 'name'
      },
      icon: {
        qiuji: '../../../../static/images/videoqiuji.svg',
        qiangji: '../../../../static/images/videoqiangji.svg'
      },
      defaultStyle: {
        //多边形Stype默认样式
        strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
        fillColor: this.$webconfig.PolygonStyle.fillColor, //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, //边线的宽度，以像素为单位。
        strokeOpacity: 0.3, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      },
      selectMapLayer: '', //当前地图选中图层（区域或者单元格）
      cellData: [],
      areaData: [],
      toolMode: 2,
      showall: false,
      labelText: '',
      oldAllVideoData: [],
      searchCircle: '',
      searchVideoData: [],
      vidoeVisable: false,
      vMapHeight: document.body.clientHeight - 50
    };
  },
  components: {
    BaseMap,
    BaseVideo,
    BaseVideoList
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.vMapHeight = document.body.clientHeight - 50;
    });
  },
  methods: {
    viodeClose(value) {
      this.vidoeVisable = value;
    },
    htmLText(content) {
      return `<div class="baiduWinfo">${content}</div>`;
    },
    overShow() {
      this.isall = true;
    },
    clearButton() {
      this.videoSearch = '';
      this.map.removeOverlay(this.searchMark);
      this.map.removeOverlay(this.searchCircle);
      this.searchShow = false;
    },
    setAutoComplete() {
      const ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: 'suggestId',
        location: this.map
      });
      ac.addEventListener('onconfirm', e => {
        //鼠标放在下拉列表上的事件
        const _value = e.item.value;
        const myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        this.setPlace(myValue);
      });
    },
    searchBaiDu() {
      this.$log(this.videoSearch);

      this.setPlace(this.videoSearch);
    },
    setPlace(value) {
      if (value != '') {
        const vm = this;
        const myFun = () => {
          vm.$log(local.getResults().getPoi(0));
          vm.isall = true;
          if (local.getResults().getPoi(0)) {
            // vm.restMap();
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            vm.videoSearch = value;
            vm.map.centerAndZoom(pp, 18);
            vm.map.removeOverlay(vm.searchMark);
            const opts = {
              icon: new BMap.Icon(
                '../../../../static/images/marks.png',
                new BMap.Size(25, 40),
                {
                  // offset: new BMap.Size(400, 100), // 指定定位位置
                  imageOffset: new BMap.Size(0, -193)
                }
              )
              // icon: new BMap.Icon(
              //   'http://api.map.baidu.com/img/markers.png',
              //   new BMap.Size(23, 25),
              //   {
              //     offset: new BMap.Size(10, 25) // 指定定位位置
              //     // imageOffset: new BMap.Size(100, 0)
              //   }
              // )
            };
            vm.map.removeOverlay(vm.searchMark);
            vm.map.removeOverlay(vm.searchCircle);
            vm.searchMark = new BMap.Marker(pp, opts);

            var circle = (vm.searchCircle = new BMap.Circle(pp, 100, {
              fillColor: '#7eb2ff',
              strokeColor: '#3385ff',
              strokeWeight: 1,
              fillOpacity: 0.2,
              strokeOpacity: 0.5
            })); //创建圆

            vm.searchList = vm.oldAllVideoData.filter(item => {
              return BMapLib.GeoUtils.isPointInCircle(item.point, circle);
            });
            vm.map.addOverlay(circle);

            vm.map.addOverlay(vm.searchMark); //添加标注
            this.searchShow = true;
            circle.addEventListener(
              'click',
              ({ type, target, point, pixel }) => {
                this.$log('target', target);

                this.searchVideoData = Object.assign([], this.searchList);
                this.vidoeVisable = true;
              }
            );
          } else {
            vm.map.removeOverlay(vm.searchMark);
            vm.map.removeOverlay(vm.searchCircle);
            vm.searchShow = true;
            vm.$message({
              message: '未查找到位置信息，请从新输入',
              type: 'warning'
            });
          }
        };
        var local = new BMap.LocalSearch(this.map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(value);
      }
    },

    /********************* 地图图层事件 ****************************** */
    restMap() {
      // if (this.videoMarkerClusterer.clearMarkers)
      //   this.videoMarkerClusterer.clearMarkers();
      this.map.removeOverlay(this.searchMark);
      this.map.removeOverlay(this.searchCircle);
      this.pointClov(this.oldAllVideoData);
    },
    setTool(val) {
      this.$log(val, this.toolMode);
      if (this.toolMode != val) {
        this.toolMode = val;
        // this.map.clearOverlays();
        this.restMap();

        switch (val) {
          case 1:
            this.map.removeOverlay(this.labelText);

            let cellLayer = this.$store.getters.getMapLayers.cell || [];
            let areaLayer = this.$store.getters.getMapLayers.area || [];
            for (const item of cellLayer) {
              this.map.removeOverlay(item);
            }
            for (const item of areaLayer) {
              this.map.removeOverlay(item);
            }
            this.$store.dispatch('setMapLayers', {});
            // for (const item of this.areaData) {
            //   this.addPolygon(item, 0, true);
            // }
            this.setLayer(this.areaData.length - 1, this.areaData, 0, true);
            break;
          case 2:
            let cellLayer2 = this.$store.getters.getMapLayers.cell || [];
            let areaLayer2 = this.$store.getters.getMapLayers.area || [];
            for (const item of cellLayer2) {
              this.map.removeOverlay(item);
            }
            for (const item of areaLayer2) {
              this.map.removeOverlay(item);
            }
            this.$store.dispatch('setMapLayers', {});
            // for (const item of this.areaData) {
            //   this.addPolygon(item);
            // }
            this.setLayer(this.areaData.length - 1, this.areaData);
            // for (const item of this.cellData) {
            //   this.addPolygon(item, 1);
            // }
            this.setLayer(this.cellData.length - 1, this.cellData, 1);
            break;
          default:
            break;
        }
        this.pointClov(this.oldAllVideoData);
      }
    },
    showAllClick() {
      this.pointClov(this.oldAllVideoData);
    },
    /**@augments
     * 获取区域信息
     */
    async getAreaData() {
      const res = await this.$http.get('/cms/AreaController/queryAllAreaData');
      if (res.data && res.data.success) {
        // this.map.clearOverlays();
        // this.areaLayers = [];
        let setData = (this.areaData = res.data.result.map(item => {
          item.show = false;
          if (item.scope_path) {
            item.scope_path = JSON.parse(item.scope_path);
          } else {
            item.scope_path = undefined;
          }
          // this.addPolygon(item);
          return item;
        }));
        this.setLayer(this.areaData.length - 1, this.areaData, 0, false);
        this.getCellData();
      } else {
        this.$message.waring(res.data.msg);
      }
    },
    /**
     * 获取单元格信息
     */
    async getCellData() {
      try {
        const res = await this.$http.get('/cms/CellController/querCellAllList');
        if (res.data.success) {
          this.cellData = res.data.result.map(item => {
            item.scope_path = JSON.parse(item.scope_path);
            return item;
          });
          // for (const item of this.cellData) {
          //   this.addPolygon(item, 1);
          // }
          this.setLayer(this.cellData.length - 1, this.cellData, 1);
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * @description 递归生成地图图层
     * @param {Number} n 结束序号
     * @param {Object} data 数据原形
     * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
     * @param {Boolea}  show 点击事件是否注册
     */
    setLayer(n, data, type, show) {
      const Type = type || 0;
      const Show = show || false;
      if (n < 0) return true;
      // setTimeout(() => {
      this.addPolygon(data[n], type, show);
      return this.setLayer(n - 1, data, type, show);
      // }, 10);
    },
    /**
     * 添加地图图层
     * @param {Object} data 数据源
     * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
     * @param {Boolea}  show 点击事件是否注册
     */
    addPolygon(data, type, show) {
      // this.$log(data,type,show)
      const _self = this;
      const Type = type || 0;
      const Show = show || false;
      const arr = data.scope_path;
      if (arr != null) {
        let point = arr.map(item => {
          return new BMap.Point(item.lng, item.lat);
        });
        var label = new BMap.Label(data.area_name, {
          // offset: new BMap.Size(20, -10)
        });
        const style = Type == 0 ? this.defaultStyle : this.setStyleOptions();
        let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
        polygonLayer.data = data;
        // label.setPosition(polygonLayer.getBounds().getCenter());
        label.setPosition(getCenterPoint(polygonLayer.getPath()));
        polygonLayer.label = label;
        // this.addMenu(polygonLayer);
        // this.mapAreaInfo.calculate = BMapLib.GeoUtils
        //   .getPolygonArea(polygonLayer)
        //   .toFixed(2);

        this.map.addOverlay(polygonLayer);
        if (Type == 0) {
          this.map.addOverlay(label);
          addMapLayer(this, polygonLayer, 'area');

          if (Show) {
            polygonLayer.addEventListener('click', function(e) {
              // console.log(e);
              _self.layerClick(e.target, Type);
            });
            polygonLayer.addEventListener('mouseover', function(e) {
              // e.target.setStrokeColor("blue");
              // e.target.setStrokeStyle("solid");
              // e.target.setStrokeWeight(8);
            });
            polygonLayer.addEventListener('mouseout', function(e) {
              // e.target.setStrokeColor("red");
              // e.target.setStrokeStyle("solid");
              // e.target.setStrokeWeight(5);
            });
          }
        } else {
          addMapLayer(this, polygonLayer, 'cell');
          polygonLayer.addEventListener('click', function(e) {
            _self.map.removeOverlay(_self.labelText);
            _self.labelText = new BMap.Label('', {
              // offset: new BMap.Size(20, -10)
            });
            _self.setCellLabelInfo(e, 'click');
            _self.layerClick(e.target, Type);
          });
          polygonLayer.addEventListener('mouseover', function(e) {
            _self.setCellLabelInfo(e);

            // e.target.setStrokeColor("blue");
            // e.target.setStrokeStyle("solid");
            // e.target.setStrokeWeight(5);
          });
          polygonLayer.addEventListener('mouseout', function(e) {
            _self.map.removeOverlay(e.target.label);

            // e.target.setStrokeColor("red");
            // e.target.setStrokeStyle("dashed");
            // e.target.setStrokeWeight(1);
          });
        }
      }
    },
    setCellLabelInfo(e, type) {
      let layer = e.target;
      let _self = this;
      let label = layer.label;
      if (type == 'click') {
        label = _self.labelText;
      }
      let areaInfo = [];
      let areaName = '未知';
      areaInfo = _self.areaData.filter(item => {
        return item.id == layer.data.area_id;
      });
      if (areaInfo.length > 0) {
        areaName = areaInfo[0].area_name;
      }
      let text = '';
      text = `<div>所属区域：${areaName}</div>
        <div>编号：${layer.data.BGID}</div>
        <div>面积：${layer.data.BGSQua} ㎡</div>
        `;

      label.setStyle({
        backgroundColor: '#ffc614'
        // border:'0px';
      });
      label.setContent(text);
      label.setOffset(new BMap.Size(-20, -20));
      label.setPosition(getCenterPoint(e.target.getPath()));
      _self.map.addOverlay(label);
    },
    /**
     * 图层点击事件，获取区域或单元格内部件所有信息
     * @param {Object} e  图层对象
     * @param {Number} type 事件类型 0区域事件  1单元格事件
     */
    layerClick(e, type) {
      const _self = this;
      let layer = e;
      _self.clearSelectOptions(layer, type); //清除上一次地图选中图层
      // _self.map.panTo(getCenterPoint(layer.getPath())); //设置地图中心点
      let data = this.oldAllVideoData.filter(item => {
        const point = new BMap.Point(item.Lng, item.Lat);
        return BMapLib.GeoUtils.isPointInPolygon(point, layer);
      });
      this.pointClov(data);
    },
    /**
     * 清除上一次地图选中图层
     * @param {Object} layer 地图图层
     * @param {Number} type 图层类型 0区域图层 1单元格图层
     */
    clearSelectOptions(layer, type) {
      if (this.selectMapLayer != '') {
        this.selectMapLayer.setStrokeColor(
          this.$webconfig.PolygonStyle.strokeColor
        );

        if (type == 0) {
          this.selectMapLayer.setStrokeWeight(3);
          this.selectMapLayer.setStrokeStyle('solid');
          layer.setStrokeWeight(2);
        } else {
          this.selectMapLayer.setStrokeWeight(1);
          this.selectMapLayer.setStrokeStyle('dashed');
          layer.setStrokeWeight(2);
        }
      }
      if (type == 0) {
        layer.setStrokeWeight(3);
      } else {
        layer.setStrokeWeight(3);
      }
      layer.setStrokeColor(this.$webconfig.PolygonStyle.clickStrikeColor);
      layer.setStrokeStyle('solid');
      this.selectMapLayer = layer;
    },
    /**
     * 设置多边形随机颜色配置
     */
    setStyleOptions() {
      const color = this.$webconfig.color[
        Math.floor(Math.random() * this.$webconfig.color.length + 0)
      ];
      return {
        strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
        fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 1, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' //边线的样式，solid或dashed。
      };
    },

    /************************** END ********************************************* */

    /**@description
     * 返回视频监督中心
     */
    back() {
      // var a=123123;
      // a.toFixed(5)
      this.$router.push('video');
    },
    /**
     *树信息过滤
     *@param {String} value 当前输入值
     *@param {Objcet} data 树数据原形
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    /**
     * @description 获取节点数据，移动地图中心位置
     * @param {Object} data 节点数据
     */
    clickPlayVideo(data) {
      let map = this.map;
      let point = data.point;
      let content = `<div class="dial">
                <p>设备名称：${data.name}</p>
                <p>设备类型：${
                  data.type == 0 ? '球机' : data.type == 1 ? '枪机' : ''
                }</p>
                <p>设备坐标：${data.Lng.toFixed(5)},${data.Lat.toFixed(5)}</p>
                <p>设备状态：${Number(data.status) == 1 ? '正常' : '离线'}</p>
                </div>`;
      const pot = {
        width: 300,
        textAlign: 'left'
      };
      var winfoLay = new BaiduCustomWinInfo(point, map, content, pot);
      var infoWindow = new BMap.InfoWindow(content, pot); // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point);

      // var infoBox = new BMapLib.InfoBox(map, this.htmLText(content), {
      //   boxStyle: {
      //     width: `300px`
      //   },
      //   closeIconUrl:'../../../../static/images/',
      //   // closeIconMargin: '10px 2px 0 0',
      //   enableAutoPan: true,
      //   alignBottom: false
      // });
      // infoBox.show(point);
    },
    /**
     * @description 树节点点击事件
     * @param {Object}  data 点击节点数据源
     */
    videoNodeClick(data) {
      if (data.type !== 2) {
        //清除目录节点时间
        // if (data.status == 1) {
        this.clickPlayVideo(data);
        // } else {
        this.map.panTo(data.point);
        this.map.setViewport([data.point]); //调整视野
        // }
      }
    },
    /**@description 触发关闭 */
    close(msg) {
      this.visable = msg;
    },
    /**坐标转换 */
    async setConvert(data) {
      let list = data;
      const DataLength = data.length;
      let now = [];
      const covertor = new BMap.Convertor();
      if (DataLength > 0) {
        for (let index = 0; index < list.length; index++) {
          const point = new BMap.Point(list[index].Lng, list[index].Lat);
          let translateCallback = async data => {
            if (data.status === 0) {
              list[index].point = data.points[0];
              now.push(index);
              if (now.length == list.length) {
                console.log('--------------------');
                console.log(list);
                console.log(JSON.stringify(list));
                this.videoData = transData(
                  list,
                  'device_id',
                  'parent_id',
                  'children'
                );

                //过滤目录节点和坐标数据为0的数据 用来定位视图
                let clearFileAndLng0List = list.filter(item => {
                  return item.type != 2 && item.Lng != 0 && item.Lat != 0;
                });
                let markList = list.filter(item => {
                  return item.type != 2;
                });
                console.log(clearFileAndLng0List);
                this.setMark(markList);
                let pointArray = clearFileAndLng0List.map(item => {
                  return item.point;
                });
                console.log(pointArray);
                this.map.setViewport(pointArray); //调整视野
                this.treeLoading = false;
                console.log('--------------------');
              }
            }
          };
          covertor.translate([point], 1, 5, translateCallback);
        }
      } else {
        this.treeLoading = false;
      }
    },

    /**
     * @description 设置聚合图层
     * @param {data}
     */
    setMark(data) {
      console.time();
      let marks = [];
      var markerClusterer = new BMapLib.MarkerClusterer(this.map);
      this.videoMarkerClusterer = markerClusterer;

      data.forEach(item => {
        let pt = item.point;
        const url =
          Number(item.type) == 0 ? this.icon.qiuji : this.icon.qiangji;
        let icon = new BMap.Icon(url, new BMap.Size(40, 40));
        let Options = {
          icon: icon,
          title: item.name
        };
        let marker = new BMap.Marker(pt, Options);
        marker.data = item;

        this.markerEventListener(marker);
        marks.push(marker);
      });
      this.videoMarks = marks;

      this.videoMarkerClusterer.addMarkers(marks);
      console.timeEnd();
    },
    /**
     * @description 地图坐标数据点击事件
     * @param {Object} marker 底座点数据
     */
    markerEventListener(marker) {
      marker.addEventListener('mouseover', ({ type, target, point, pixe }) => {
        target.setZIndex(20);
        target.setTop();
        var p = target;
        var data = target.data;
        var point = data.point;
        let map = this.map;
        let content = `<div class="dial">
                <p>设备名称：${data.name}</p>
                <p>设备类型：${
                  data.type == 0 ? '球机' : data.type == 1 ? '枪机' : ''
                }</p>
              <p>设备坐标：${data.Lng.toFixed(5)},${data.Lat.toFixed(5)}</p>
                <p>设备状态：${Number(data.status) == 1 ? '正常' : '离线'}</p>
                </div>`;
        const pot = {
          width: 300,
          textAlign: 'left'
        };
        var winfoLay = new BMap.InfoWindow(content, pot);
        this.map.openInfoWindow(winfoLay, point);
      });
      marker.addEventListener('click', ({ type, target, point, pixe }) => {
        console.log(target);
        if (Number(target.data.status) == 1) {
          this.title = target.data.name;
          // this.src='rtsp://172.17.204.180:11554/000200000601.34e2b9016a5742169eb8d3fdeacce4f8.0';
          this.visable = true;
          this.src = target.data.Url;
          this.selectData = target.data;
        }
      });
    },

    /**@description 地图初始化 */
    mapReady({ BMap, map }) {
      this.map = map;
      this.setAutoComplete();
      this.getViodeData();
      this.getAreaData();
      this.setMapClick();
    },
    setMapClick() {
      const map = this.map;

      map.addEventListener('click', ({ type, target, point, pixe }) => {
        this.isall = false;
      });
      map.addEventListener('zoomstart', ({ type, target, point, pixe }) => {
        this.isall = false;
      });
      map.addEventListener('dragstart', ({ type, target, point, pixe }) => {
        this.isall = false;
      });
    },

    /**
     * @description 获取视频数据
     * */
    async getViodeData() {
      this.treeLoading = true;
      const res = await this.$http.get('/video/index/getCatalog');
      console.log(res);
      if (res.data && res.data.success) {
        //  this.setConvert(res.data.result.list);
        // this.setConvert(dataJson.data.list);
        // this.oldAllVideoData = dataJson.data.list;
        this.oldAllVideoData = res.data.result.list;
        this.pointClov(this.oldAllVideoData);
        // this.pointClov(dataJson.data.list);
        this.treeLoading = false;
      } else {
        this.$message.waring(res.data.msg);
        this.treeLoading = false;
      }
    },
    /**原始坐标转换百度坐标 */
    pointClov(data) {
      let list = Object.assign([], data);
      const DataLength = data.length;
      if (DataLength > 0) {
        list = list.map(item => {
          item.point = new BMap.Point(item.Lng, item.Lat);
          return item;
        });
        console.time();
        // this.videoData = transData(list, 'device_id', 'parent_id', 'children');
        this.videoData = toTree(list, 'device_id', 'parent_id');

        console.timeEnd();
        //过滤目录节点和坐标数据为0的数据 用来定位视图
        let clearFileAndLng0List = list.filter(item => {
          return item.type != 2 && item.Lng != 0 && item.Lat != 0;
        });
        let markList = list.filter(item => {
          return item.type != 2;
        });
        console.log(clearFileAndLng0List);
        if (this.videoMarkerClusterer.clearMarkers)
          this.videoMarkerClusterer.clearMarkers();
        this.setMark(markList);
        let pointArray = clearFileAndLng0List.map(item => {
          return item.point;
        });
        console.log(pointArray);
        this.map.setViewport(pointArray); //调整视野
      } else {
        this.treeLoading = false;
      }
    },
    /**原始坐标转换百度坐标 */
    pointCoverter(x, y) {
      let nowPoint = '';
      const point = new BMap.Point(x, y);
      const covertor = new BMap.Convertor();
      const points = [point];
      let returnPoint = '';
      let translateCallback = async data => {
        console.log(data);
        if (data.status === 0) {
          nowPoint = data.points[0];
          return nowPoint;
        }
      };

      covertor.translate(points, 1, 5, translateCallback);
    }
  },
  computed: {
    // vMapHeight() {
    //   return document.body.clientHeight - 50;
    // }
  },
  watch: {
    filterText(val) {
      this.$refs.videoTree.filter(val);
    }
  }
};
</script>
 
<style lang="scss" >
.video-map {
  position: relative;
  .video-tree {
    position: absolute;
    top: 0;
    right: 0px;
    width: 280px;
    height: calc(100vh - 50px);
    // height: 300px;
    background: #fff;
    transition: transform 0.25s linear 0s;
    -moz-box-shadow: -8px 0 18px rgba(2, 1, 1, 0.08);
    -webkit-box-shadow: -8px 0 18px rgba(2, 1, 1, 0.08);
    box-shadow: -8px 0 18px rgba(2, 1, 1, 0.08);
  }

  .control-map-tool {
    position: absolute;
    top: 0px;
    right: 290px;
    z-index: 12px;
    transition: all 0.4s;
    .control-content-tool {
      font-size: 12px;
      float: left;
      width: 43px;

      color: #fff;

      .control-content-tool-item {
        background-color: #00a0ea;
        text-align: center;
        height: 25px;
        padding: 7px 0;
        border: 1px solid rgba(255, 255, 255, 0.59);
        margin-bottom: 5px;
        -moz-box-shadow: 0px 3px 10px #787878;
        -webkit-box-shadow: 0px 3px 10px #787878;
        box-shadow: 0px 3px 10px #787878;
        cursor: pointer;
        .control-icon {
          font-size: 25px;
          // margin-top: 3px;
          margin-bottom: 3px;
        }
      }
      .contlor-content-tool-color {
        background-color: #135c7d !important;
      }
    }
  }

  .video-search {
    position: absolute;
    top: 20px;
    left: 40px;
    width: 365px;
    .video-search-button {
      display: flex;
      height: 36px;
      line-height: 36px;
      .button-close {
        background: #fff;
        color: #3385ff;
        padding: 0px 10px;
        border-left: 1px solid #eee;
        &:hover {
          cursor: pointer;
        }
      }
      .button-enter {
        background-color: #3385ff;
        padding: 2px 20px;
        border-radius: 0 2px 2px 0;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
        &:hover {
          cursor: pointer;
          background-color: #2e77e5;
        }
      }
    }

    .video-search-content {
      pointer-events: auto;
      margin-top: 10px;
      margin-right: 60px;
      background: #fff;
      padding: 10px;
      overflow: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      max-height: calc(100vh - 200px);
      transition: max-height 0.5s;
      border-radius: 2px;
      box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
      .content-title {
        margin: 8px 0 0;
        padding: 5px 10px;
        background-color: #e5eeff;
        font-size: 12px;
        // line-height: 25px;
        text-align: center;
        b {
          color: #f44336;
          font-size: 14px;
        }
      }
      .contetn-list {
        .list {
          display: flex;
          margin-top: 10px;
          &:hover {
            background-color: #f6f6f6;
            cursor: pointer;
            .item2 {
              .icon {
                color: #f44336;
              }
            }
          }
          .item1 {
            font-size: 12px;
            flex: 1;
            padding: 8px 0;
            .title {
              padding: 5px 0;
              line-height: 1.2;
              color: #3385ff;
            }
          }
          .item2 {
            flex: 0.3;
            font-size: 40px;
            .icon {
              color: #3385ff;
            }
          }
        }
      }
    }

    .animation {
      animation-name: card-drop;
      animation-duration: 0.5s;
    }
    .flodAnimation {
      overflow: hidden;
      max-height: 63px !important;
      background: #fff !important;
    }
    .el-input {
      box-sizing: border-box;

      box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
      .el-input__inner {
        border: 1px solid #fff;
        border-radius: 0;
        &:hover {
          border-color: #fff;
        }
        &:focus {
          border-color: #fff;
        }
      }
      .el-input-group__append,
      .el-input-group__prepend {
        border-radius: 0px;
        color: #fff;
        // background-color: #3385ff;
        padding: 0px;
        border: 0px;
        // cursor: pointer;

        &:hover {
          // background-color: #2e77e5;
        }
      }
    }
  }
  .tree-button {
    padding: 10px;
    color: #fff;
    font-size: 14px;
    background: #409eff;
    &:hover {
      cursor: pointer;
      background: #66b1ff;
    }
  }
  .tree-main {
    // margin-top: 10px;
    height: calc(100vh - 150px);
    padding: 10px;
    // height: 300px;
    .el-tree {
      margin-top: 10px;
      min-height: 300px;
      height: 100%;
      font-size: 13px;
      overflow-y: auto;
    }
    .video-default {
      color: #00a0e9;
    }
    .video-out {
      color: rgb(221, 221, 221);
    }
  }
}
.dial {
  p {
    margin: 2px;
    font-size: 13px;
  }
}
</style>