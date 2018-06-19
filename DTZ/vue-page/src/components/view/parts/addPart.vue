<template>
  <div class="partsTable">
    <div class="partsForm" :style="wrapperHeight" style="overflow: auto">
      <el-button type="text" @click="backClick">
        <base-icon icon="back"/>
        返回
      </el-button>

      <el-form :model="partsForm" :rules="this.$validateRule" ref="partsForm" label-width="100px" >
        <el-form-item label="部件分类" prop="group_code">
          <el-cascader
            v-model="groupList"
            @change="groupChange"
            :placeholder="partsForm.cms_parts_group.group_name"
            :props="groupProps"
            :options="groupOptions"
            clearable
            filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属区域" prop="area_code">
          <el-cascader @change="selectChange" :placeholder='partsForm.cms_area.area_name' :props="cascaderProps"
                       :options="options" clearable
                       filterable>
          </el-cascader>
        </el-form-item>
        <!--<el-form-item label="部件名称" prop="ObjName">-->
        <!--<el-input v-model="partsForm.ObjName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="主管部门" prop="Dept1">
          <!--<el-select v-model="partsForm.Dept1" clearable placeholder="请选择"-->
          <!--@change="deptChange(partsForm.Dept1,'DeptCode1','DeptName1')">-->
          <!--<el-option-->
          <!--v-for="(item ,index) in deptList"-->
          <!--:label="item.org_name"-->
          <!--:value="item.org_name + ','+item.org_code"-->
          <!--:key="index">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <el-cascader @change="selectDept" :placeholder="partsForm.DeptName1" :props="deptProps"
                       :options="departOptions" clearable
                       filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="权属单位" prop="Dept2">
          <!--<el-select v-model="partsForm.Dept2" clearable placeholder="请选择"-->
          <!--@change="deptChange(partsForm.Dept2,'DeptCode2','DeptName2')">-->
          <!--<el-option-->
          <!--v-for="(item ,index) in deptList"-->
          <!--:label="item.org_name"-->
          <!--:value="item.org_name + ','+item.org_code"-->
          <!--:key="index">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <el-cascader @change="selectBelongCompany" :placeholder="partsForm.DeptName2" :props="deptProps"
                       :options="departOptions" clearable
                       filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="养护单位" prop="Dept3">
          <!--<el-select v-model="partsForm.Dept3" clearable placeholder="请选择"-->
          <!--@change="deptChange(partsForm.Dept3,'DeptCode3','DeptName3')">-->
          <!--<el-option-->
          <!--v-for="(item ,index) in deptList"-->
          <!--:label="item.org_name"-->
          <!--:value="item.org_name + ','+item.org_code"-->
          <!--:key="index">-->
          <!--</el-option>-->
          <!--</el-select>-->

          <el-cascader @change="selectCuringCompany" :placeholder="partsForm.DeptName3" :props="deptProps"
                       :options="departOptions" clearable
                       filterable>
          </el-cascader>
        </el-form-item>

        <el-form-item label="单元网格" prop="BGID">
          <el-input v-model="partsForm.BGID" disabled></el-input>
        </el-form-item>
        <el-form-item label="百度坐标" prop="baidu">
          <el-input v-model="partsForm.baidu_x" placeholder="x坐标" @focus="querySearch"
                    @blur="notClick"></el-input>
          <el-input v-model="partsForm.baidu_y" placeholder="y坐标" @focus="querySearch"
                    @blur="notClick"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address_name">
          <el-input v-model="partsForm.address_name"></el-input>
        </el-form-item>
        <el-form-item label="部件状态" prop="ObjState">
          <el-select v-model="partsForm.ObjState" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="(item ,index) in bjzt"
              :label="item.label"
              :value="item.label"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初始日期" prop="ORDate">
          <el-input v-model="partsForm.create_date" disabled></el-input>

          <!--<el-date-picker-->
          <!--v-model="partsForm.ORDate"-->
          <!--type="date"-->
          <!--placeholder="选择日期"-->
          <!--:picker-options="pickerOptions1">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <el-form-item label="变更日期" prop="CHDate">
          <el-input v-model="partsForm.update_date" disabled></el-input>

          <!--<el-date-picker-->
          <!--v-model="partsForm.CHDate"-->
          <!--type="date"-->
          <!--placeholder="选择日期"-->
          <!--:picker-options="pickerOptions1">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <el-form-item label="数据来源" prop="DataSource">
          <!--<el-input v-model="partsForm.DataSource"></el-input>-->

          <el-select v-model="partsForm.DataSource" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="(item ,index) in sourceType"
              :label="item.label"
              :value="item.label"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="partsForm.Note"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建者" prop="DataSource">
                  <el-input  v-model="partsForm.DataSource"></el-input>
              </el-form-item>
              <el-form-item label="更新者" prop="DataSource">
                  <el-input  v-model="partsForm.DataSource"></el-input>
              </el-form-item>
              <el-form-item label="创建时间" prop="DataSource">
                  <el-input  v-model="partsForm.DataSource"></el-input>
              </el-form-item>
              <el-form-item label="更新时间" prop="DataSource">
                  <el-input  v-model="partsForm.DataSource"></el-input>
              </el-form-item> -->
        <!-- <el-form-item label="图片路径" prop="pic_path">
                  <el-input  v-model="partsForm.pic_path"></el-input>
              </el-form-item> -->
        <el-form-item label="图片" style="width:49%" prop="">
          <div @click='chooseImg' style="width:110px;height:110px;" title="点击选择图片">
            <img v-if="image.src" :src="image.src" class="avatar">
            <img v-else
                 class="avatar img_src">
            <input id="upload_img" type="file" name="file" @change="onFileChange" class="input_file"
                   accept="image/gif,image/jpeg,image/jpg,image/png"/>
          </div>
          <div @click="removeImg" class="removebtn" v-if="image.src">
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item label="原始坐标" prop="original">
                  <el-input  v-model="partsForm.original"></el-input>
              </el-form-item> -->

      </el-form>

      <el-button @click="addPart" style="margin-left:130px;" type="success">保存</el-button>
    </div>
    <div class="partMap">
      <div class="partMap-content">
        <div class="partMap-content-tip">
          <base-icon style="color:#00a0e9;font-size:18px;" icon="tip"/>
          通过拖动图标来重新定位，绘制完成后数据同步于左侧表单中


        </div>
        <!--<div class="partMap-content-update">-->
          <!--<el-button type="primary" @click="updateParts()">更改</el-button>-->

        <!--</div>-->
        <base-map :center="center" :style="wrapperHeight" @ready="ready" :zoom="14"></base-map>
      </div>
    </div>
  </div>
</template>

<script>
  import {transData, getDicData} from "assets/js/commonManage.js";
  import BaseMap from "common/BaseMap";
  import {addMapLayer} from "assets/js/commonManage.js";
  import {dateFormat} from "../../../assets/js/date";

  export default {
    data() {
      return {
        wrapperHeight: {
          height: (document.body.clientHeight - 50) + 'px'
        },
        bjzt: [],
        loginUserId: '',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        deptList: [],//部门数组
        image: {},//图片流预览图片
        delImgInfo: false,
        groupList: [],
        partsForm: {},
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
        groupOptions: [],
        groupProps: {
          value: "group_code",
          label: "group_name",
          children: "children",
          disabled: "disabled"
        },
        deptProps: {
          value: "org_name",
          label: "org_name",
          children: "children",
          disabled: "disabled"
        },
        departOptions: [],
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
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        },
        cellDataById: [],
        cellData: [],
        selectArea: {},
        isEdit: false,
        defaultArea: null,
        defaultCell: null,
        defaultAddress: {
          baidu_x: '',
          baidu_y: '',
          info: {}
        },
        sourceType: []
      };
    },
    components: {
      BaseMap
    },
    created() {
      console.log('207', this.$route.query);
      if (this.$route.query.areaId) {
        this.isEdit = true;
      }



      if (this.$route.query.data) {
        this.partsForm = this.$route.query.data;
        this.image.src = this.imgUrl(this.partsForm.pic_path)

      } else {
        this.partsForm = {
          BGID: "",
          CHDate: null,
          DataSource: "",
          DeptCode1: "",
          DeptCode2: "",
          DeptCode3: "",
          DeptName1: "暂无",
          DeptName2: "",
          DeptName3: "",
          Note: "",
          ORDate: null,
          ObjID: "5303220020000402014245",
          ObjName: "",
          ObjState: "完好",
          address_name: "云南省曲靖市陆良县S18(曲陆高速)",
          area_code: "530322002000",
          baidu_x: 103.647973,
          baidu_y: 25.022212,
          cms_area: {
            area_code: "530322002000",
            area_name: "同乐街道",
            city_type: null,
            id: 4,
            parent_id: 2,
            parent_ids: "0,2,",
            scope_path: null
          },
          cms_parts_group: {
            group_name: "",
            group_pic_path: "static/upload/partIcons/default.svg"
          },
          create_by: "f7b9b600-6076-11e7-ba04-f3bc0839eb06",
          create_date: "2017-12-20T08:45:02.000Z",
          group_code: "0402",
          id: 14245,
          original_x: 103.6395904770614,
          original_y: 25.019435815719334,
          pic_path: "static/upload/images/151375949433665df96e6.jpg",
          update_by: null,
          update_date: null
        }
      }
      if (this.partsForm.create_date) {
        if (!this.isEdit) {
          this.partsForm.create_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        } else {
          this.partsForm.create_date = dateFormat(new Date(this.partsForm.create_date), 'yyyy-MM-dd hh:mm:ss');
        }

      }
      if (this.partsForm.update_date) {
        this.partsForm.update_date = dateFormat(new Date(this.partsForm.update_date), 'yyyy-MM-dd hh:mm:ss');
      }


    },
    mounted() {

    },
    methods: {
      backClick() {
        this.$router.push("/parts");
      },

      imgUrl(url){
        return `http://${this.$webconfig.serverIp}/${url}`;
      },
      /**
       * 查询部门列表
       */
      async getOrgName() {
        const res = await this.$http.get('/sys/DepartController/getDepartName');
        console.log(res);
        if (res.data && res.data.success) {
          const arr = res.data.result;
          this.deptList = arr;
          this.departOptions = transData(this.deptList, "id", "parent_id", "children");
        } else {
          this.$message.error('获取部门信息失败');
        }
      },
      /**
       * 获取部件分类信息
       */
      async getPGData() {
        const res = await this.$http.get("basesource/PartsController/getPGData");
        console.log(res);
        if (res.data && res.data.success) {
          this.groupOptions = transData(res.data.result, "id", "parent_id", "children");
        } else {
          this.$message.error(res.data.msg);
        }
        console.log(this.groupOptions);
      },
      /**
       * 通过区域id查询单元格信息
       * @param {String} id  区域id
       */
      async getCellDataById(data) {
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
              this.cellDataById = Res.data.result;

              this.Geocoder(data);
              console.log('celldata', this.cellDataById);
              if (this.isEdit) {
                console.log(this.BGID);
                this.cellDataById.map(item => {
                  if (item.BGID == this.$route.query.BGID) {
                    let _self = this;
                    _self.cellForm.id = item.id;
                    _self.cellForm.area_id = item.area_id;
                    _self.cellForm.scope_path = item.scope_path;
                    _self.cellForm.BGSQua = item.BGSQua;
                    _self.cellForm.BGID = item.BGID;
                    // this.cellForm.area_code = layer.data.area_code;
                    _self.cellForm.Note = item.Note;
                  }
                })
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
      async addPart() {

        let params = Object.assign({}, this.partsForm);

        params.userid = this.loginUserId;
        let formData = new FormData();
        let file = document.getElementById("upload_img").files[0];
        if (!file && !this.partsForm.pic_path) {
          this.$message.warning("请选择图片");
          return
        }
        if (this.delImgInfo) {
          params.delImgInfo = this.delImgInfo;
        };
        formData.append('image', file); //file就是图片或者文件
        $.each(params, function (i, val) {
          if (val !== null && val !== undefined && val !== '') {
            formData.append(i, val);
          }
        });
        const Res = await this.$http.post(
          "/basesource/PartsController/doAddOrUpdatePart",
          formData
        );
        if (Res) {
          if (Res.data.success) {
            this.$message.success("保存成功");
            this.map.clearOverlays();
            this.$router.push('/parts');
          } else {
            this.$message.error('请选择图片');
          }
        }

      },
      deptChange(value, code, name) {
        const arr = value.split(',');
        console.log(value, code, name);
        this.partsForm[code] = arr[1];
        this.partsForm[name] = arr[0];
      },
      /**
       * 添加地图图层
       */
      addCellPolygon(data) {
        const arr = JSON.parse(data.scope_path);
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

          this.map.addOverlay(polygonLayer);
        }
      },
      updateParts() {
        let _this = this
        console.log(this.defaultArea);
        console.log(this.defaultCell)
        if (this.defaultArea === null) {
          _this.$confirm('未选择已规划的所属区域，是否继续更改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            _this.partsForm.baidu_x = _this.defaultAddress.baidu_x;
            _this.partsForm.baidu_y = _this.defaultAddress.baidu_y;
            _this.partsForm.address_name = _this.defaultAddress.info.address_name
          })
        } else {
          _this.$confirm(`修改至${this.defaultArea.area_name},是否继续修改`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            _this.partsForm.cms_area.area_name = _this.defaultArea.area_name;
            _this.partsForm.baidu_x = _this.defaultAddress.baidu_x;
            _this.partsForm.baidu_y = _this.defaultAddress.baidu_y;
            _this.partsForm.address_name = _this.defaultAddress.info.address;
            _this.partsForm.BGID = _this.defaultCell.BGID

          })
        }

      },
      /**
       * 地图初始化
       */
      ready({BMap, map}) {

        console.log('365', this.partsForm)

        this.map = map;
        this.setMapLayer({BMap, map})
        this.init()
      },
      init(){
        this.loginUserId = JSON.parse(this.$getStore('userData')).id;//当前登录用户id
        this.getAreaData();
        this.getPGData();
        this.getOrgName();
        this.getCellData();
        this.sourceType = getDicData('bjsjly');
        this.bjzt = getDicData('bjzt');
      },
      //设置点Lable文本显示
      setText(data) {
        return data != null && data != undefined ? data : "";
      },

      //区域编码转code
      areaCode_name(code) {
        let _this = this;
        for (let item of _this.areaData) {
          if (code === item.id) {
            return item.area_name
          }
        }
      },
      /**
       * 添加所有部件与地图中
       */
      setMapLayer({BMap, map}) {
        console.log('375375375', this.partsForm)
        let _this = this

        // console.log('415',badData.length)
        let marks = [];
        var data;

        if (this.$route.query.data) {
          data = this.$route.query.data;

        } else {
          data = {
            BGID: "",
            CHDate: null,
            DataSource: "实测",
            DeptCode1: "",
            DeptCode2: "",
            DeptCode3: "",
            DeptName1: "暂无",
            DeptName2: "",
            DeptName3: "",
            Note: "11",
            ORDate: null,
            ObjID: "5303220020000402014245",
            ObjName: "",
            ObjState: "完好",
            address_name: "云南省曲靖市陆良县S18(曲陆高速)",
            area_code: "530322002000",
            baidu_x: 103.647973,
            baidu_y: 25.022212,
            cms_area: {
              area_code: "",
              area_name: "",
              city_type: null,
              id: 4,
              parent_id: 2,
              parent_ids: "0,2,",
              scope_path: null
            },
            cms_parts_group: {
              group_name: "行树",
              group_pic_path: "static/upload/partIcons/行树.svg"
            },
            create_by: "f7b9b600-6076-11e7-ba04-f3bc0839eb06",
            create_date: "2017-12-20T08:45:02.000Z",
            group_code: "0402",
            id: 14245,
            original_x: 103.6395904770614,
            original_y: 25.019435815719334,
            pic_path: "151375949433665df96e6.jpg",
            update_by: null,
            update_date: null
          }

        }

        console.log('379379', data);

        let pt = new BMap.Point(data.baidu_x, data.baidu_y);
        this.map.centerAndZoom(pt, 16);
        let icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${data.cms_parts_group.group_pic_path}`, new BMap.Size(40, 40))
        let Options = {
          icon: icon,
          title: data.address_name
        };
        let marker = new BMap.Marker(pt, Options);


        this.map.panTo(pt);
        let content =
          `<div class="map-windInfo" style="font-size: 12px;">
            <div>部件标识码：${this.setText(data.ObjID)}</div>
             <div>部件类型：${this.setText(data.cms_parts_group.group_name)}</div>
             <div>所属区域：${this.setText(data.cms_area.area_name)}</div>
            <div>描述：${this.setText(data.ObjState)}</div>
            </div>
            `;
        var infoWindow = new BMap.InfoWindow(content, {
          width: 250
        }); // 创建信息窗口对象
        this.map.openInfoWindow(infoWindow, pt);
        this.map.setZoom(16);
        // this.isShowPartInfo = true;
        // this.partInfo = Object.assign({}, data);
        // this.getPartsCaseInfo(data.id);


        marker.data = data;
        marker.enableDragging();

        marker.addEventListener("dragend", function (e) {  //拖动事件
          let dragPoint = e.point;
          console.log('394', dragPoint);
          _this.defaultAddress.baidu_x = dragPoint.lng;
          _this.defaultAddress.baidu_y = dragPoint.lat;

          let point = new BMap.Point(dragPoint.lng, dragPoint.lat);

          /**
           * 反向推获取当前所在单元格和所在区域
           */

          for (const item of _this.areaData) {
            const arrPath = JSON.parse(item.scope_path);
            if (arrPath != null) {

              let pot = arrPath.map(ite => {
                return new BMap.Point(ite.lng, ite.lat);
              });
              var label = new BMap.Label(data.area_name, {
                // offset: new BMap.Size(20, -10)
              });
              const style = _this.setStyleOptions();
              let polygonLayer = new BMap.Polygon(pot, style);
              polygonLayer.data = data;
              polygonLayer.label = label;

              let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
              console.log(flag)
              if (flag) {
                _this.defaultArea = item;

                console.log('2',_this.defaultArea)

              }
            }
          }
          for (const item of _this.cellData) {
            const arrPath = JSON.parse(item.scope_path);
            if (arrPath != null) {

              let pot = arrPath.map(ite => {
                return new BMap.Point(ite.lng, ite.lat);
              });
              var label = new BMap.Label(data.area_id, {
                // offset: new BMap.Size(20, -10)
              });
              const style = _this.setStyleOptions();
              let polygonLayer = new BMap.Polygon(pot, style);
              polygonLayer.data = data;
              polygonLayer.label = label;

              let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
              console.log(flag)
              if (flag) {
                _this.defaultCell = item
              }
            }
          }

          let geoc = new BMap.Geocoder();
          geoc.getLocation(point, function (result) {
            if (result) {
              console.log('位置信息', result);
              _this.defaultAddress.info = result

              if (_this.defaultArea === null) {
                _this.partsForm.baidu_x = _this.defaultAddress.baidu_x;
                _this.partsForm.baidu_y = _this.defaultAddress.baidu_y;
                _this.partsForm.address_name = _this.defaultAddress.info.address_name

              } else {
                console.log('1',_this.defaultAddress.info);
                _this.partsForm.cms_area.area_name = _this.defaultArea.area_name;
                _this.partsForm.cms_area.area_code = _this.defaultArea.area_code;
                _this.partsForm.baidu_x = _this.defaultAddress.baidu_x;
                _this.partsForm.baidu_y = _this.defaultAddress.baidu_y;
                _this.partsForm.address_name = _this.defaultAddress.info.address;
                _this.partsForm.BGID = _this.defaultCell.BGID
                _this.partsForm.area_code = _this.defaultArea.area_code


              }
              map.closeInfoWindow(infoWindow, pt);
            }
          });


        });
        this.markerEventListener(marker);
        marks.push(marker)
//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
        this.marks = marks;
        let markerClusterer = new BMapLib.MarkerClusterer(this.map);
        markerClusterer.addMarkers(marks);
        this.markerClusterer = markerClusterer

      },
      /**
       * 点坐标事件集合
       * @param {Object} 地图marker对象
       */
      markerEventListener(marker) {
        console.log(marker)

      },
      querySearch() {
        this.map.addEventListener("click", (e) => {
          var pt = e.point;
          var geoc = new BMap.Geocoder();
          geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents;
            console.log(addComp);
            alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          });
          // console.log(e);
          // this.partsForm.baidu = '222222';
          // // var marker = new BMap.Marker(new BMap.Point(e.point.lng,e.point.lat)); // 创建点
          // // this.map.addOverlay(marker);            //增加点
          // alert(e.point.lng + "," + e.point.lat);
        });
      },
      notClick() {

      },
      /**i
       * 添加地图图层
       * @param {Object} data 数据源
       * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
       */
      async addPolygon(data, type, show) {
        let _this = this
        const Type = type || 0;
        const arr =
          Type == 0
            ? JSON.parse(data.scope_path)
            : JSON.parse(data.scope_path);

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

          label.setPosition(polygonLayer.getBounds().getCenter());
          polygonLayer.label = label;
          // this.addMenu(polygonLayer);
          // this.mapAreaInfo.calculate = BMapLib.GeoUtils
          //   .getPolygonArea(polygonLayer)
          //   .toFixed(2);

          this.map.addOverlay(polygonLayer);
          if (Type == 0) {
            this.map.addOverlay(label);
            addMapLayer(this, polygonLayer, "area");

          } else {
            addMapLayer(this, polygonLayer, "cell");
            polygonLayer.addEventListener("click", function (e) {

              let layer = e.target;
              console.log('单元格点击', layer.data);
              this.map.panTo(getCenterPoint(layer.getPath())); //设置地图中心点
              this.map.setZoom(19);

              let label = layer.label;
              let content = `<div class="map-windInfo">
            <p>面积：${layer.data.BGSQua}㎡</p>
            <p>BGID：${layer.data.BGID}</p>
            <p>所属区域：${_this.areaCode_name(layer.data.area_id)}</p>
            </div>
            `;
              label.setContent(content);
              label.setPosition(getCenterPoint(e.target.getPath()));
              this.map.addOverlay(label);


              //

              let data = _this.partsData.filter(item => {
                const point = new BMap.Point(item.baidu_x, item.baidu_y);
                return BMapLib.GeoUtils.isPointInPolygon(item.point, layer);
              });

            });
            polygonLayer.addEventListener("mouseover", function (e) {
              e.target.setStrokeColor("blue");
              e.target.setStrokeStyle("solid");
              e.target.setStrokeWeight(2);
            });
            polygonLayer.addEventListener("mouseout", function (e) {
              this.map.removeOverlay(e.target.label);
              e.target.setStrokeColor("red");
              e.target.setStrokeStyle("dashed");
              e.target.setStrokeWeight(1);
            });
          }
        }


      },

      /**
       * 设置多边形随机颜色配置
       */

      setStyleOptions() {
        const color =
          "#" +
          Math.random()
            .toString(16)
            .substring(2)
            .substr(0, 6);
        return {
          strokeColor: "red", //边线颜色。
          fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1, //边线的宽度，以像素为单位。
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "dashed" //边线的样式，solid或dashed。
        };
      },
      /**
       * 获取区域信息
       */
      async getAreaData() {
        try {
          const res = await this.$http.get(
            "/cms/AreaController/queryAllAreaData"
          );
          console.log('886',res);
          if (res.data.success) {
            this.areaData = res.data.result;
            for (const item of this.areaData) {
              this.addPolygon(item);
            }
            let data = this.areaData.map(item => {
              item.value = {
                id: item.id,
                area_code: item.area_code,
                area_name: item.area_name,
                scope_path: item.scope_path
              };
              let parentIds = item.parent_ids.split(",");
              let path = JSON.parse(item.scope_path);
              // if (parentIds.length > 3 && path == null) {
              //   item.disabled = true;
              // } else {
              //   item.disabled = false;
              // }
              return item;
            });
            this.options = transData(data, "id", "parent_id", "children");
          }
        } catch (error) {
          console.log(error);
        }
      },
      /**
       * 获取单元格信息
       */
      async getCellData() {
        try {

          const res = await this.$http.get("/cms/CellController/querCellAllList");
          if (res.data.success) {
            this.cellData = res.data.result;
            for (const item of this.cellData) {
              this.addPolygon(item, 1, item.BGID);
            }
          }
        } catch (error) {
          console.log(error);
        }
      },

      /**
       * 数据来源类型
       */
      async dataSourceType() {
        try {
          let res = await this.$http.get('/basesource/PartsController/dataSource')
          console.log('719', res)
          if (res.data.success) {
            this.sourceType = res.data.result
          }
        } catch (err) {
          console.log(error)

        }

      },

      selectChange(data) {
        let info = data[data.length - 1];
        this.partsForm.area_id = info.id;
        this.partsForm.area_code = info.area_code;
        this.selectArea = info;
        this.map.clearOverlays();
        this.getCellDataById(info);
      },
      selectDept(data) {
        console.log('419', data)
        let info = data[data.length - 1];
        // this.partsForm.area_id = info.id;
        console.log(info);
        this.partsForm.DeptName1 = info;
        // this.selectArea = info;
        console.log('417')

      },

      selectBelongCompany(data) {
        let info = data[data.length - 1];
        // this.partsForm.area_id = info.id;
        console.log(info);
        this.partsForm.DeptName2 = info;
        // this.selectArea = info;


      },
      selectCuringCompany(data) {
        let info = data[data.length - 1];
        this.partsForm.DeptName3 = info;
      },
      groupChange(data) {//分类改变
        let info = data[data.length - 1];
        this.partsForm.group_code = info;
      },
      /**
       * 百度地图逆地址查询
       */
      Geocoder(data) {
        let myGeo = new BMap.Geocoder();
        const _self = this;
        myGeo.getPoint(
          data.area_name,
          function (point) {
            // _self.map.clearOverlays();
            _self.addPolygon(data);
            _self.cellDataById.map(item => {
              _self.addCellPolygon(item);
            });
            if (point) {
              _self.map.panTo(point, {
                noAnimation: false
              });

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
      },
      chooseImg() {
        $('input[type=file]').trigger('click');
        return false
      },
      /**
       * 图片选择change事件
       *
       */
      onFileChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (files[0]) {
          const isImg = files[0].type.substr(0, 5);
          const isLt2M = files[0].size / 1024 / 1024 < 2;
          if (isImg !== 'image') {
            this.$message.error('只能上传图片！')
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过2M！')
          }
          if (isImg === 'image' && isLt2M) {
            if (!files.length) return;
            this.createImage(files)
          }
          if (this.partsForm.pic_path) {
            this.delImgInfo = true;
          }
          return isImg === 'image' && isLt2M
        }

      },
      //读取图片操作
      createImage(files) {
        let VM = this;
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = function (e) {
            VM.image = {src: e.target.result}
          };
          reader.readAsDataURL(file);
        }
      },
      removeImg() {
        $('#upload_img').val('');
        this.image = {};
        if (this.partsForm.pic_path) {
          this.delImgInfo = true;
        }
      },
    }
  };
</script>


<style lang="scss" scoped>
  .partsTable {
    display: flex;
    .partsForm {
      flex: 0.35;
      padding: 20px 0;
      width: 320px;
      .input_file {
        display: none;
      }
      .avatar {
        width: 109px;
        height: 109px;
        display: block;
        cursor: pointer;
      }

      .img_src {
        background-image: url('../../../assets/images/img.png');
        background-size: 109px 109px;
      }
      .removebtn {
        margin-left: 95px;
        margin-top: -10px;
      }
    }

    .partMap {
      flex: 1;
      .partMap-content {
        position: relative;
        .partMap-content-tip {
          position: absolute;
          top: 0px;
          left: 5px;
          padding: 10px;
          font-size: 12px;
          background: rgba(201, 176, 35, 0.6);
          border: 1px solid rgba(255, 0, 0, 0.247);
          z-index: 1;
        }
        .partMap-content-update {
          position: absolute;
          top: 0px;
          right: 5px;
          padding: 10px;
          font-size: 12px;
          z-index: 1;

        }
      }
    }
    .el-cascader {
      width: 100%;
    }
  }
</style>
