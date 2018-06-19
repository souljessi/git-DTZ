<template>
  <div class="partsTable">
    <div class="partsForm">
		<el-form :model="partsForm" :rules="this.$validateRule" ref="partsForm" label-width="100px">
			<el-form-item label="部件分类" prop="group_code">
				<el-cascader 
					v-model="groupList"
					@change="groupChange" 
					placeholder="试试搜索：私搭乱建" 
					:props="groupProps" 
					:options="groupOptions" 
					clearable
					filterable>
				</el-cascader>
			</el-form-item>
			<el-form-item label="所属区域" prop="area_code">
				<el-cascader @change="selectChange" placeholder="试试搜索：东门" :props="cascaderProps" :options="options" clearable
					filterable>
				</el-cascader>
			</el-form-item>
			<el-form-item label="部件名称" prop="ObjName">
				<el-input v-model="partsForm.ObjName"></el-input>
			</el-form-item>
			<el-form-item label="主管部门" prop="Dept1">
				<el-select  v-model="partsForm.Dept1" clearable placeholder="请选择" @change="deptChange(partsForm.Dept1,'DeptCode1','DeptName1')">
					<el-option
						v-for="(item ,index) in deptList"
						:label="item.org_name"
						:value="item.org_name + ','+item.org_code"
						:key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="权属单位" prop="Dept2">
				<el-select  v-model="partsForm.Dept2" clearable placeholder="请选择" @change="deptChange(partsForm.Dept2,'DeptCode2','DeptName2')">
					<el-option
						v-for="(item ,index) in deptList"
						:label="item.org_name"
						:value="item.org_name + ','+item.org_code"
						:key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="养护单位" prop="Dept3">
				<el-select  v-model="partsForm.Dept3" clearable placeholder="请选择" @change="deptChange(partsForm.Dept3,'DeptCode3','DeptName3')">
					<el-option
						v-for="(item ,index) in deptList"
						:label="item.org_name"
						:value="item.org_name + ','+item.org_code"
						:key="index">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="单元网格" prop="BGID">
				<el-input  v-model="partsForm.BGID" disabled></el-input>
			</el-form-item>
			<el-form-item label="百度坐标" prop="baidu">
				<el-input  v-model="partsForm.baidu" placeholder="请在地图上点击设置坐标" @focus="querySearch" @blur="notClick"></el-input>
			</el-form-item>
			<el-form-item label="详细地址" prop="address_name">
				<el-input  v-model="partsForm.address_name"></el-input>
			</el-form-item>
			<el-form-item label="部件状态" prop="ObjState">
				<el-select  v-model="partsForm.ObjState" placeholder="请选择">
					<el-option
						v-for="(item ,index) in bjzt"
						:label="item.label"
						:value="item.label"
						:key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="初始日期" prop="ORDate">
				<el-date-picker
				v-model="partsForm.ORDate"
				type="date"
				placeholder="选择日期"
				:picker-options="pickerOptions1">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="变更日期" prop="CHDate">
				<el-date-picker
				v-model="partsForm.CHDate"
				type="date"
				placeholder="选择日期"
				:picker-options="pickerOptions1">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="数据来源" prop="DataSource">
				<el-input  v-model="partsForm.DataSource"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="Note">
				<el-input  type="textarea" :rows="2" placeholder="请输入内容" v-model="partsForm.Note"></el-input>
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
					<el-button  type="danger" icon="el-icon-delete"></el-button>
				</div>
			</el-form-item>
		
		</el-form>
			<el-button @click="cancelEdit">取消</el-button>

      <el-button @click="editPart"  type="success">保存</el-button>
    </div>
    <div class="partMap">
      <div class="partMap-content">
        <div class="partMap-content-tip">
          <base-icon style="color:#00a0e9;font-size:18px;" icon="tip" /> 通过使用地图上的绘制工具绘制单元格范围，绘制完成后数据同步于左侧表单中,右键可开启编辑图层
        </div>
        <base-map :center="center" :height="660" @ready="ready" :zoom="14"></base-map>
      </div>
    </div>
  </div>
</template>

<script>
import { transData,getDicData } from "assets/js/commonManage.js";
import BaseMap from "common/BaseMap";
export default {
	data() {
			return {
				bjzt:[],
				loginUserId:'',
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
				},
				deptList:[],//部门数组
				image: {},//图片流预览图片
				delImgInfo:false,
				groupList:[],
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
				groupOptions:[],
				groupProps: {
					value: "group_code",
					label: "group_name",
					children: "children",
					disabled: "disabled"
				},
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
				cellData: [],
				selectArea: {}
			};
	},
	props: ['rowData'],
  components: {
		BaseMap
	},
	created() {

	},
	mounted() {
		this.loginUserId = JSON.parse(this.$getStore('userData')).id;//当前登录用户id
		this.getAreaData();
		this.getPGData();
		this.getOrgName();
		this.bjzt = getDicData('bjzt');
		this.partsForm = Object.assign({},this.rowData);
	},
	methods: {

	/**
	 * 查询部门列表
	 */
	async getOrgName(){
		const res = await this.$http.get('/sys/DepartController/getDepartName');
		console.log(res);
		if (res.data && res.data.success) {
			const arr = res.data.result;
			this.deptList = arr;
		}else{
			this.$message.error('获取部门信息失败'); 
		}
	},
	/**
	 * 获取部件分类信息
	 */
	async getPGData(){
		const res =  await this.$http.get("basesource/PartsController/getPGData");
		console.log(res);
		if(res.data&&res.data.success){
			this.groupOptions = transData(res.data.result, "id", "parent_id", "children");
		}else{
			this.$message.error(res.data.msg);
		}
		console.log(this.groupOptions);
	},
    /**
     * 通过区域id查询单元格信息
     * @param {String} id  区域id
     */
    async getCellData(data) {
        const Res = await this.$http.get(
          "/cms/CellController/queryCellListByAreaId",
          {
            params: {
              area_id: data.id
            }
          }
        );
        if (Res) {
			if (Res.data.success) {
				this.cellData = Res.data.result;
				this.Geocoder(data);
				console.log(this.cellData);
			} else {
				this.$message.error(Res.data.msg);
			}
        }
    
    },
    /**
     * 修改部件信息
     */
    async editPart() {

		let params = Object.assign({}, this.partsForm);
		params.userid = this.loginUserId;
		let formData = new FormData();
		let file = document.getElementById("upload_img").files[0];
		if(this.delImgInfo){
			params.delImgInfo = this.delImgInfo;
		};
		formData.append('image', file); //file就是图片或者文件
		$.each(params, function (i, val) {
			if (val !== null&&val !== undefined&&val !=='') {
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
				this.$router.push('partsTable');
			} else {
				this.$message.error(error);
			}
        }
    
	},
	deptChange(value,code,name){
		const arr = value.split(',');
		console.log(value,code,name);
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
    /**
     * 地图初始化
     */
    ready({ BMap, map }) {
	
			this.map = map;
	},
	querySearch(){
		this.map.addEventListener("click",(e)=>{
			var pt = e.point;
			var geoc = new BMap.Geocoder();    
	geoc.getLocation(pt, function(rs){
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
	notClick(){
		
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
          offset: new BMap.Size(-20, 0)
        });

        let polygonLayer = new BMap.Polygon(point, this.styleOptions); //建立多边形覆盖物
        label.setPosition(polygonLayer.getBounds().getCenter());
        this.map.addOverlay(label);
        polygonLayer.label = label;

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
        if (res.data.success) {
          this.areaData = res.data.result;
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
    selectChange(data) {
			let info = data[data.length - 1];
			this.partsForm.area_id = info.id;
			this.partsForm.area_code = info.area_code;
			this.selectArea = info;
			this.map.clearOverlays();
			this.getCellData(info);
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
        function(point) {
          // _self.map.clearOverlays();
          _self.addPolygon(data);
          _self.cellData.map(item => {
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
		chooseImg(){
			$('input[type=file]').trigger('click');
			return false
		},
		/**
		 * 图片选择change事件
		 *
		 */
		onFileChange(e){
			let files = e.target.files || e.dataTransfer.files;
			if(files[0]){
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
				if(this.partsForm.pic_path){
					this.delImgInfo = true;
				}
				return isImg === 'image' && isLt2M
			}

		},
		//读取图片操作
		createImage(files){
			let VM = this
			for (let file of files) {
				let reader = new FileReader();
				reader.onload = function (e) {
					VM.image = {src: e.target.result}
				};
				reader.readAsDataURL(file);
			}
		},
		removeImg(){
			$('#upload_img').val('');
			this.image = {};
			if(this.partsForm.pic_path){
				this.delImgInfo = true;
			}
		},
		cancelEdit(){//关闭弹窗
			this.$emit('closeDig',false);
		}
  }
};
</script>


<style lang="scss" scoped>
.partsTable {
	display: flex;
	.partsForm {
		flex: 0.35;
		width: 350px;
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
			background-image: url('../../../assets/images/default.jpg');
			background-size: 109px 109px;
		}
		.removebtn{
			margin-left:95px;
			margin-top:-10px;
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
		}
	}
	.el-cascader{
		width:100%;
	}
}
</style>
