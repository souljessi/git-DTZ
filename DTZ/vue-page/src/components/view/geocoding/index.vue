<template>
  <div class="geo">
    <div class="geo-win">
      <el-checkbox-group v-model="checkList">
        <div class="clear" style="border-bottom:1px solid #ccc;padding:5px 10px;font-size:12px">
          <div style="float:left">类型</div>
          <div style="float:right">数量</div>
        </div>
        <div v-for="(item,index) in list" :key="index" style="margin:5px;" class="clear">
          <div style="float:left">
            <el-checkbox :label="item.name">{{item.label}}</el-checkbox>
          </div>
          <div style="float:right;font-size:12px;">
            <span v-show="item.name=='dp'">({{ZoneList.length}})</span>
            <span v-show="item.name=='jd'">({{RoadList.length}})</span>
            <span v-show="item.name=='mp'">({{HouseList.length}})</span>
            <span v-show="item.name=='xqd'">({{PoiList.length}})</span>

          </div>
        </div>

      </el-checkbox-group>
    </div>
    <base-map :center='center' :height='mapHeight' @ready='mapReady'></base-map>
  </div>
</template>


<script>
import BaseMap from "common/BaseMap.vue";
export default {
  data() {
    return {
      map: "",
      checkList: ["dp", "jd", "mp", "xqd"],
      pointArray: [],
      list: [
        {
          label: "地片与区片",
          name: "dp",
          url: "../../../../static/images/diqu.svg"
        },
        {
          label: "街道",
          name: "jd",
          url: "../../../../static/images/jiedao.svg"
        },
        {
          label: "门牌",
          name: "mp",
          url: "../../../../static/images/men.svg"
        },
        {
          label: "兴趣点",
          name: "xqd",
          url: "../../../../static/images/xinqu.svg"
        }
      ],
      mapHeight: document.body.clientHeight - 100,
      PoiList: [],
      RoadList: [],
      HouseList: [],
      ZoneList: [],
      markerClusterer: "",
      markers: {
        PoiMarker: [],
        RoadMarker: [],
        HouseMarker: [],
        ZoneMarker: []
      },
      center: {
        //地图中心点
        lng: 103.671826,
        lat: 25.037481
      }
    };
  },
  components: {
    BaseMap
  },
  created() {},
  watch: {
    checkList(val) {
      console.log(val);
      let mark = [];
      val.forEach(item => {
        if (item == "dp") mark = [...mark, ...this.markers.ZoneMarker];
        if (item == "jd") mark = [...mark, ...this.markers.RoadMarker];
        if (item == "mp") mark = [...mark, ...this.markers.HouseMarker];
        if (item == "xqd") mark = [...mark, ...this.markers.PoiMarker];
      });
      this.markerClusterer.clearMarkers();
      this.markerClusterer.addMarkers(mark);
    }
  },
  methods: {
    listChange() {},
    mapReady({ BMap, map }) {
      this.map = map;
      this.markerClusterer = new BMapLib.MarkerClusterer(map);
      this.getData();
    },
    async getData() {
      await this.getPoiData();
      await this.getZone();
      await this.getRoad();
      await this.getHouse();
      console.log(this.markers.PoiMarker);
      let marks = [
        ...this.markers.RoadMarker,
        ...this.markers.PoiMarker,
        ...this.markers.HouseMarker,
        ...this.markers.ZoneMarker
      ];
      console.log(marks);
      this.markerClusterer.addMarkers(marks);
      this.map.setViewport(this.pointArray); //调整视野
    },
    setMarkerPoints(data, name) {
      let marks = [];
      let url = "";
      this.list.forEach(item2 => {
        if (item2.name == name) {
          url = item2.url;
        }
      });
      data.forEach(item => {
        let pt = new BMap.Point(item.Baidu_lng, item.Baidu_lat);
        this.pointArray.push(pt);
        let icon = new BMap.Icon(url, new BMap.Size(30, 30));
        let Options = {
          icon: icon
        };
        let marker = new BMap.Marker(pt, Options);
        marker.data = item;
        this.markerEvent(marker);
        marks.push(marker);
      });
      return marks;
    },
    markerEvent(marker) {
      var opts = {
        width: 250
      };
      marker.addEventListener("click", ({ type, target, point, pixe }) => {
        target.setZIndex(20);
        console.log(target);
        target.setTop();
        var p = target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        let content = "";
        let pp = "";
        let data = target.data;
        if (target.data.type == "road") pp = `街道：${data.StrName}`;
        if (target.data.type == "house") pp = `门牌：${data.AddName}`;
        if (target.data.type == "zone") pp = `区片：${data.ZoneName}`;
        if (target.data.type == "poi") pp = `兴趣点：${data.POIName}`;
        content = `<div class="map-info">
        <p>${pp}</p>
        </div>`;
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
        p.openInfoWindow(infoWindow);
      });
    },
    async getPoiData() {
      let Res = await this.$http.get("/geo/PoiController/getPoiAll");
      if (Res && Res.data.success) {
        this.PoiList = Res.data.result;
        this.PoiList = this.PoiList.map(item => {
          item.type = "poi";
          return item;
        });
        this.markers.PoiMarker = this.setMarkerPoints(this.PoiList, "xqd");
      } else {
        vm.$message.error(Res.data.msg);
      }
    },
    async getZone() {
      let Res = await this.$http.get("/geo/ZoneController/getZoneAll");
      if (Res && Res.data.success) {
        this.ZoneList = Res.data.result;
        this.ZoneList = this.ZoneList.map(item => {
          item.type = "zone";
          return item;
        });
        this.markers.ZoneMarker = this.setMarkerPoints(this.ZoneList, "dp");
      } else {
        vm.$message.error(Res.data.msg);
      }
    },
    async getRoad() {
      let Res = await this.$http.get("/geo/RoadController/getRoadAll");
      if (Res && Res.data.success) {
        this.RoadList = Res.data.result;
        this.RoadList = this.RoadList.map(item => {
          item.type = "road";
          return item;
        });
        this.markers.RoadMarker = this.setMarkerPoints(this.RoadList, "jd");
      } else {
        vm.$message.error(Res.data.msg);
      }
    },
    async getHouse() {
      let Res = await this.$http.get("/geo/HouseController/getHouseAll");
      if (Res && Res.data.success) {
        this.HouseList = Res.data.result;
        this.HouseList = this.HouseList.map(item => {
          item.type = "house";
          return item;
        });
        this.markers.HouseMarker = this.setMarkerPoints(this.HouseList, "mp");
      } else {
        vm.$message.error(Res.data.msg);
      }
    }
  }
};
</script>

<style lang="scss">
.geo {
  position: relative;
  .geo-win {
    position: absolute;
    width: 150px;
    background: #fff;
    border: 4px solid #ffc614;
    box-shadow: 0px 0px 10px #333333;
    border-radius: 8px;
    padding: 10px;
    top: 0;
    right: 10px;
    z-index: 10;
  }
}
.map-info {
  p {
    // margin: 3px;
    font-size: 14px;
    font-weight: 700;
  }
}
.clear:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.clear {
  zoom: 1;
}
</style>

