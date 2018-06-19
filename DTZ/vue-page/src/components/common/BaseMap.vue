<template>
  <div id='baiduMap' :style="mapStyle">

  </div>
</template>

<script>
/**创建百度地图script
 * @param {String} ak   百度地图ak码
 * @returns Promise
 */
function MP(ak) {
  return new Promise(function(resolve, reject) {
    window.onload = function() {
      resolve(BMap);
    };
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=init';
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
export default {
  data() {
    return {
      ak: ' '
      // mapStyle: {
      //   width: '100%',
      //   height: `${this.height}px`
      //   // height:"calc(100vh - 50px)",
      //   // position: "absolute"; \
      // }
    };
  },
  computed: {
    mapStyle() {
      return {
        width: '100%',
        height: `${this.height}px`
      };
    }
  },
  props: {
    //地图高度
    height: {
      type: Number,
      default: 600
    },
    //地图中心点 默认昆明中心点
    center: {
      type: Object,
      default: function() {
        return {
          lng: 103.673116,
          lat: 25.036001
        };
      }
    },
    //地图缩放比例
    zoom: {
      type: Number,
      default: 19
    }
  },
  mounted() {
    const vm = this;
    this.$nextTick(function() {
      setTimeout(() => {
        this.initMap();
      }, 400);
    });
  },
  methods: {
    initMap() {
      console.log('height:', this.height);
      // this.$nextTick(function() {
      const _self = this;
      // MP(_self.ak).then(BMap => {
      const map = new BMap.Map('baiduMap', { enableMapClick: false }); //初始化地图  关闭poi功能 减少地图误操作
      let myStyle = {
        // features: ["road", "water", "land", "building"],
        style: 'normal'
        // styleJson: [
        //   [
        //     {
        //       featureType: "all",
        //       elementType: "all",
        //       stylers: {
        //         lightness: 10,
        //         saturation: -100
        //       }
        //     }
        //   ]
        // ]
      };

      // map.setMapStyle(myStyle);
      map.setMinZoom(3);
      map.setMaxZoom(19);
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      }); // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
      // map.addControl(top_left_control);
      // map.addControl(top_left_navigation);
      const point = new BMap.Point(this.center.lng, this.center.lat); //设置地图中心
      let boun = new BMap.Boundary();
      boun.get('陆良县', item => {
        console.log('陆良地图初始化');
        item.boundaries.forEach(element => {
          let ply = new BMap.Polygon(element, {
            strokeWeight: 2,
            strokeColor: '#007dff',
            fillColor: '#3a8ee6',
            fillOpacity: 0.1
          });
          map.addOverlay(ply); //添加覆盖物
          map.centerAndZoom(point, this.zoom); //设置缩放比例
          // map.centerAndZoom(point, 19); //设置缩放比例

          map.enableScrollWheelZoom(true); //开启鼠标缩放
          // var top_left_control = new BMap.ScaleControl({
          // anchor: BMAP_ANCHOR_TOP_LEFT
          // }); // 左上角，添加比例尺
          // map.addControl(top_left_control);
          // map.addControl(new BMap.NavigationControl());
          // const marker = new BMap.Marker(point); // 创建标注
          // map.addOverlay(marker); //添加标注
          this.$emit('ready', { BMap, map }); //触发地图组件信息回调
          // map.setViewport(ply.getPath()); //调整视野
          map.addEventListener('clearoverlays', (type, target) => {
            //监听用户全部清除操作，保留县级底图
            map.addOverlay(ply); //添加覆盖物
          });
        });
      });

      // });
      // });
    }
  }
};
</script>


<style lang="scss">
//去除百度地图logo
.anchorBL {
  display: none !important;
}
</style>
