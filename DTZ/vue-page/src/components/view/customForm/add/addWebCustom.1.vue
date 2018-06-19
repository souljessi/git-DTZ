<template>
    <div class="web-tm-wrap">
        <el-button type="success" @click='routerBack'>返回</el-button>
        <div class="tm-bg">
            <!-- 左侧组件列表 -->
            <ul class="viewFieldView">
                <draggable v-model="leftArray" :options="dragOptions" @start="drag=true" @end="temEnd">
                    <transition-group type="transition" :name="'flip-list'">
                        <li class="filed-item" v-for="(element,index) in leftArray" :key="index">
                            <div class="handle">
                                <span style="float:left">{{element.label}}</span>
                                <span style="float:right">
                                    <base-icon style="font-size:16px;" :icon="element.icon" /></span>
                            </div>
                        </li>
                    </transition-group>
                </draggable>
            </ul>
            <!-- 右侧字段信息 -->
            <div class="form-right">
                <div class="form-right-header">
                    <div style="flex:1" @click=" rightActive=1">控件设置</div>
                    <div style="flex:1" @click="rightActive=2">表单设置</div>
                </div>
                <!-- 表单属性 -->
                <div v-show="rightActive===2">
                    <div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">审批名称</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="formInfo.template_name">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">审批编码</label>
                                <span class="tm-label-span">请输入审批名称拼音简写</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="formInfo.template_code">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">审批说明</label>
                                <span class="tm-label-span">最多100个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="formInfo.mark">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">图标</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <div class="wf-field wf-setting-icon">
                                <div class="fieldblock">
                                    <div class="wf-iconselect" style="display: block">
                                        <ul id="approveIcon" style="display: block;float: left">
                                            <li v-for="(item,index) in iconArr" :key="index" class="iconitem selected">
                                                <img :src="'http://'+ServerimageUrl+item.img" @click="iconSelect(index)">
                                                <span v-show="item.showing" :index=index class="el-checkbox__input
                                       is-checked" style="top:-23px;left:24px">
                                                    <span class="el-checkbox__inner"></span>
                                                    <input type="checkbox" class="el-checkbox__original" value="workHours">
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 字段属性 -->
                <div v-show="rightActive===1">
                    <!-- m-input -->
                    <form v-show="checkObj.type=='m-input'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">Input的类型</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <select class="tm-select" v-model="checkObj.inputType">
                                <option value="text">文本（Text）</option>
                                <option value="number">数字（Number）</option>
                                <option value="email">邮件（Email）</option>
                                <option value="password">密码（Password）</option>
                                <option value="tel">电话（Tel）</option>
                            </select>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">Input输入最小长度</label>
                                <span class="tm-label-span">默认0</span>
                            </div>
                            <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.minLength">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">Input输入最大长度</label>
                                <span class="tm-label-span">默认100</span>
                            </div>
                            <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.maxlength">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否必填</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item" v-show="checkObj.readonly">
                            <div>
                                <label class="tm-label">默认值</label>
                                <span class="tm-label-span">默认为空</span>
                            </div>
                            <input v-show="checkObj.inputType=='text'" type="text" class="tm-input" v-model="checkObj.value">
                            <input v-show="checkObj.inputType=='number'" type="number" class="tm-input" v-model="checkObj.value">
                            <input v-show="checkObj.inputType=='email'" type="email" class="tm-input" v-model="checkObj.value">
                            <input v-show="checkObj.inputType=='password'" type="password" class="tm-input" v-model="checkObj.value">
                            <input v-show="checkObj.inputType=='tel'" type="tel" class="tm-input" v-model="checkObj.value">

                        </div>

                    </form>
                    <!-- m-textarea -->
                    <form v-show="checkObj.type=='m-textarea'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">Input输入最小长度</label>
                                <span class="tm-label-span">默认0</span>
                            </div>
                            <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.minLength">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">Input输入最大长度</label>
                                <span class="tm-label-span">默认100</span>
                            </div>
                            <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.maxlength">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否必填</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item" v-show="checkObj.readonly">
                            <div>
                                <label class="tm-label">默认值</label>
                                <span class="tm-label-span">默认为空</span>
                            </div>
                            <input type="text" class="tm-input" v-model="checkObj.value">
                        </div>
                    </form>
                    <!-- m-radio -->
                    <form v-show="checkObj.type=='m-radio'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">选项</label>
                                <span class="tm-label-span">最多200项，每项最多20字</span>
                            </div>
                            <div v-for="(item,index) in checkObj.options" :key="index" class="tm-checked">
                                <el-radio v-model="checkObj.value" :label="item.value">
                                    &nbsp;
                                </el-radio>
                                <input maxlength="20" class="tm-input-select" :value=item.value index/>
                                <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;color:#fff;font-size=20px; border-radius: 50%" @click="deleteSelector(index)">
                                    <i class="el-icon-minus"></i>
                                </span>
                                <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;color:#fff;margin-left: 5px" @click="addSelector(index)">
                                    <i class="el-icon-plus"></i>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="tm-form-item">
                                <div>
                                    <label class="tm-label">是否必填</label>
                                    <span class="tm-label-span"></span>
                                </div>
                                <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                                </el-switch>
                            </div> -->
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                    </form>
                    <!-- m-checkbox -->
                    <form v-show="checkObj.type=='m-checkbox'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">选项</label>
                                <span class="tm-label-span">最多200项，每项最多20字</span>
                            </div>
                            <el-checkbox-group v-model="checkObj.value">
                                <div v-for="(item,index) in checkObj.options" :key="index" class="tm-checked">
                                    <el-checkbox :label="item.key">
                                        &nbsp;
                                    </el-checkbox>
                                    <input maxlength="20" class="tm-input-select" :value=item.value index/>

                                    <span v-if="checkObj.options.length > 1" style="margin-left:5px; width:15px;height:15px;font-size:16px;background-color: #333333;color:#fff;font-size=20px; border-radius: 50%" @click="deleteSelector(index)">
                                        <i class="el-icon-minus"></i>
                                    </span>
                                    <span style="width:15px;margin-left:5px;height: 15px;font-size:16px;background-color: #333333;border-radius: 50%;color:#fff;margin-left: 5px" @click="addSelector(index)">
                                        <i class="el-icon-plus"></i>
                                    </span>
                                </div>
                            </el-checkbox-group>

                        </div>
                        <!-- <div class="tm-form-item">
                                <div>
                                    <label class="tm-label">是否必填</label>
                                    <span class="tm-label-span"></span>
                                </div>
                                <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                                </el-switch>
                            </div> -->
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                    </form>
                    <!-- m-selector -->
                    <form v-show="checkObj.type=='m-selector'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">选项</label>
                                <span class="tm-label-span">最多200项，每项最多20字</span>
                            </div>
                            <div v-for="(item,index) in checkObj.options" :key="index" class="tm-checked">
                                <el-radio v-model="checkObj.value" :label="item.value">
                                    &nbsp;
                                </el-radio>
                                <input maxlength="20" class="tm-input-select" :value=item.value index/>
                                <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;color:#fff;font-size=20px; border-radius: 50%" @click="deleteSelector(index)">
                                    <i class="el-icon-minus"></i>
                                </span>
                                <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;color:#fff;margin-left: 5px" @click="addSelector(index)">
                                    <i class="el-icon-plus"></i>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="tm-form-item">
                                <div>
                                    <label class="tm-label">是否必填</label>
                                    <span class="tm-label-span"></span>
                                </div>
                                <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                                </el-switch>
                            </div> -->
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                    </form>
                    <!-- m-timepick -->
                    <form v-show="checkObj.type=='m-timepick'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">日期格式</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <select class="tm-select" v-model="checkObj.dateType">
                                <option value="timepick">时间</option>
                                <option value="datepick">日期</option>
                                <option value="datetimepick">日期时间</option>
                            </select>
                        </div>
                        <!-- 通过if 过滤第一次没绑定值的情况下无法找到isTimeRange报错的问题 -->
                        <div class="tm-form-item" v-if="checkObj.dateType=='timepick'&&checkObj.timePickDate">
                            <div>
                                <label class="tm-label">是否限定时间范围</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.timePickDate.isTimeRange">
                            </el-switch>
                            <!-- {{'asdasda'+checkObj.timePickDate}} -->
                        </div>
                        <div v-if="checkObj.dateType=='timepick'&&checkObj.timePickDate&&checkObj.timePickDate.isTimeRange">
                            <div class="tm-form-item">
                                <div>
                                    <label class="tm-label">限定可选起始时间</label>
                                    <span class="tm-label-span"></span>
                                </div>
                                <el-time-picker id="starttime" style="margin-top:5px;" name='starttime' :key='1' v-model="checkObj.timePickDate.timeRangeStart" placeholder="选择时间"></el-time-picker>
                            </div>
                            <div class="tm-form-item" style="margin-top:6px;">
                                <div>
                                    <label class="tm-label">限定可选结束时间</label>
                                    <span class="tm-label-span"></span>
                                </div>
                                <el-time-picker id="endtime" style="margin-top:5px;" name='endtime' :key='2' v-model="checkObj.timePickDate.timeRangeEnd" placeholder="选择时间"></el-time-picker>
                            </div>
                        </div>
                        <div class="tm-form-item" v-if="checkObj.dateType=='datepick'&&checkObj.datePickDate">
                            <div>
                                <label class="tm-label">日期单位</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <select class="tm-select" v-model="checkObj.datePickDate.type">
                                <option value="date">天</option>
                                <option value="week">周</option>
                                <option value="month">月</option>
                                <option value="year">年</option>
                            </select>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                    </form>
                    <!-- m-search -->
                    <form v-show="checkObj.type=='m-search'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否必填</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否只读</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.readonly" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                        <div class="tm-form-item" v-show="checkObj.readonly">
                            <div>
                                <label class="tm-label">默认值</label>
                                <span class="tm-label-span">默认为空</span>
                            </div>
                            <input type="text" class="tm-input" v-model="checkObj.value">
                        </div>
                    </form>
                    <!-- m-upLoad -->
                    <form v-show="checkObj.type=='m-upLoad'">
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">标题</label>
                                <span class="tm-label-span">最多10个字</span>
                            </div>
                            <input maxlength="10" class="tm-input" v-model="checkObj.label">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文本提示</label>
                                <span class="tm-label-span">最多20个字</span>
                            </div>
                            <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">最大上传文件数量</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <select class="tm-select" v-model="checkObj.limitNum">
                                <option :value="999">不限制</option>
                                <option :value="item+1" v-for="(item,index) in 9" :key="index+1">{{item+1}}</option>

                            </select>
                        </div>
                        <div class="tm-form-item" v-show="!checkObj.readonly">
                            <div>
                                <label class="tm-label">文件上传类型</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <select class="tm-select" v-model="checkObj.limitNum">
                                <option :value="999">不限制</option>
                                <option :value="1">图片类</option>
                                <option :value="2">视频类</option>
                                <option :value="3">音频类</option>
                                <option :value="4">文档类</option>
                                <option :value="5">压缩包</option>

                            </select>
                        </div>
                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">单个文件大小（M）</label>
                                <span class="tm-label-span">默认1M</span>
                            </div>
                            <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.fileSize">
                        </div>

                        <div class="tm-form-item">
                            <div>
                                <label class="tm-label">是否必填</label>
                                <span class="tm-label-span"></span>
                            </div>
                            <el-switch class="tm-switch" v-model="checkObj.required" active-text="开" inactive-text="关">
                            </el-switch>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 中间部分实时展示 -->
            <div class="form" style=" overflow: hidden;">
                <div class="tm-formCanvas">
                    <div class="builderView">
                        <draggable style="min-height:400px;" :list="myArray" @end='onEnd' :options="formDragOptions">
                            <div class="tm-filed-item" :index=index v-for="(element,index) in myArray" :key="index">
                                <!-- m-input -->
                                <div class="tm-content" v-show="element.type=='m-input'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <span class="tm-placeholder" v-if="!element.readonly">{{element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>
                                        </div>
                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-textarea -->
                                <div class="tm-content" v-show="element.type=='m-textarea'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div style="height:50px;" :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <span class="tm-placeholder" v-if="!element.readonly">{{element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>
                                        </div>
                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-radio -->
                                <div class="tm-content" v-show="element.type=='m-radio'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div style="margin-top:5px;">
                                            <el-radio :disabled='element.readonly' v-for="(item,index) in element.options" :key="index" v-model="element.value" :label="item.value"></el-radio>
                                        </div>

                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-checkbox -->
                                <div class="tm-content" v-show="element.type=='m-checkbox'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div style="margin-top:5px;">
                                            <el-checkbox-group v-model="element.value">
                                                <el-checkbox :disabled='element.readonly' v-for="(item,index) in element.options" :key="index" :label="item.key">{{item.value}}</el-checkbox>
                                            </el-checkbox-group>
                                        </div>

                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-selector -->
                                <div class="tm-content" v-show="element.type=='m-selector'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <span class="tm-placeholder" v-if="!element.readonly">{{element.value!=''?element.value:element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>
                                            <span class="tm-select-righticon">
                                                <base-icon icon="cusxialaright" />
                                            </span>
                                        </div>

                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-timepick -->
                                <div class="tm-content" v-show="element.type=='m-timepick'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <span style="margin-left:10px;">
                                                <base-icon :icon="element.dateType=='datepick'?'cusriqi':'cusshijian' " />
                                            </span>
                                            <span style="margin-left:0px;" class="tm-placeholder" v-if="!element.readonly">{{element.value!=''?element.value:element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>

                                        </div>

                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-search -->
                                <div class="tm-content" v-show="element.type=='m-search'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <base-icon style="margin-left:10px;" icon="count" />
                                            <span class="tm-placeholder" style="margin-left:0px;" v-if="!element.readonly">{{element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>
                                        </div>
                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- m-upLoad -->

                                <div class="tm-content" v-show="element.type=='m-upLoad'">
                                    <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                                    <div class="handle">
                                        <span class="tm-label">{{element.label}}</span>
                                        <div :class="['tm-input-road',element.readonly?'tm-readonly':'']">
                                            <base-icon style="margin-left:10px;" icon="count" />
                                            <span class="tm-placeholder" style="margin-left:0px;" v-if="!element.readonly">{{element.placeholder}}</span>
                                            <span class="tm-placeholder" v-else>{{element.value}}</span>
                                            <span class="tm-required" v-show="element.required">(必填)</span>
                                        </div>
                                        <!-- <div style="float:left" v-show="element.readonly">
                                            <span style="margin-left:15px;">{{element.value}}</span>
                                        </div> -->
                                    </div>
                                </div>
                            </div>

                        </draggable>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import * as formType from "assets/js/webFormType.js";
export default {
  data() {
    return {
      rightActive: 1,
      drag: false,
      leftArray: "",
      editable: false,
      myArray: [],
      checkObj: {},
      iconArr: [],
      ServerimageUrl: "", //后台地址 ,
      formInfo: {
        id: "",
        template_name: "",
        template_code: "",
        mark: "",
        create_user: "",
        icon_path: "",
        is_use: "0",
        is_custom_tem: "1"
      }
    };
  },
  methods: {
    routerBack() {
      this.$router.back();
    },
    /**
     * 读取服务端图标
     */
    async getIcon() {
      let vm = this;
      const res = await vm.$http.get(
        "/sys/templateController/appReadCustomTemplate"
      );
      let obj = {};
      console.log(333333333333333333, res);
      if (res && res.data.success) {
        let imgs = res.data.result;
        for (let i = 0; i < imgs.length; i++) {
          obj.img = imgs[i].img;
          obj.showing = imgs[i].showing;
          vm.iconArr.push(obj);
          obj = {};
        }
      }
    },
    /**
     * 图标选择
     * @param index
     */
    iconSelect(index) {
      let vm = this;
      for (let i = 0; i < vm.iconArr.length; i++) {
        if (index === i) {
          vm.iconArr[i].showing = true;
          vm.formInfo.icon_path = vm.iconArr[i].img;
        } else {
          vm.iconArr[i].showing = false;
        }
      }
    },
    /**
     * 移除选中节点
     * @param {Object} element
     * @param {Number} index
     */
    nodeRemove(element, index) {
      console.log("element", element);
      const array = this.myArray.filter((item, i) => {
        if (index != i) {
          return item;
        }
      });
      this.myArray = array;
      console.log(333, this.myArray);
      return false;
    },
    /**
     * 拖拽结束时间
     * @param {Object} event
     */
    onEnd(event) {
      this.selectedField(event);
    },
    /**
     * 拖拽结束后设置active效果
     * @param {Object} event
     */
    selectedField(event) {
      var filed_item = $(".builderView").find(".tm-filed-item");
      filed_item.removeClass("active");
      console.warn($(".tm-filed-item:eq(" + event.newIndex + ")"));
      $(".tm-filed-item:eq(" + event.newIndex + ")").addClass("active");
      this.checkObj = this.myArray[event.newIndex];
      console.log(this.checkObj);
    },
    temEnd(event) {
      this.myArray = JSON.parse(JSON.stringify(this.myArray));
      //   this.myArray=Object.assign([],this.myArray)
    },
    //删除选项按钮
    deleteSelector(index) {
      console.log("index", index);
      let vm = this;
      console.log("vm.checkObj", vm.checkObj.options);
      vm.checkObj.options.splice(index, 1);
    },
    //添加选项按钮
    addSelector(index) {
      let vm = this;
      let val = {
        key: index + 1,
        value: "选项" + (vm.checkObj.options.length + 1)
      };
      console.log("addIndex", index + 1);
      let value = JSON.parse(JSON.stringify(vm.checkObj.value));
      vm.checkObj.options.splice(index + 1, 0, val);
      vm.checkObj.value = value;
      console.log("value", value);
    }
  },
  created() {
    this.leftArray = formType.formType;
    this.ServerimageUrl = this.$webconfig.serverIp;
    console.log(this.ServerimageUrl);
    this.getIcon();
  },
  mounted() {
    //鼠标移入控件
    let bv = $(".builderView");
    const self = this;
    console.log(bv);
    bv.on("mouseover mouseout", ".tm-filed-item", function(e) {
      e.stopPropagation();
      $(this).toggleClass("filed-item-hover");
    });
    //点击控件
    bv.on("click", ".tm-filed-item", function(e) {
      console.log("进入点击空间");
      self.checkObj = {};
      console.log(e);
      console.log($(this).attr("index"));
      self.checkObj = self.myArray[$(this).attr("index")];
      console.log("object", self.checkObj);
      if (self.checkObj === undefined) self.checkObj = {};
      //   console.log("object", self.checkObj.timePickDate.isTimeRange);

      e.stopPropagation();
      console.log(22222);
      var filed_item = $(".builderView").find(".tm-filed-item");

      filed_item.removeClass("active");
      $(this).addClass("active");
      //console.log($(this).data("id"))
    });
  },
  components: {
    draggable
  },
  computed: {
    dragOptions() {
      return {
        sort: false,
        group: {
          name: "form",
          pull: "clone",
          put: false
        },
        animation: 150
      };
    },
    formDragOptions() {
      return {
        group: {
          name: "form",
          pull: false,
          put: true
        },
        animation: 150
      };
    }
  }
};
</script>



<style lang="scss"  scoped>
.web-tm-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* height: calc(100vh - 60px); */

  //   background: url("../../../assets/images/bg.png") no-repeat top center;
  /* background: red; */
  /* background-image: url(/static/img/loginBg11.936629c.jpg); */
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  background-size: 100% 100%;

  .form-right {
    float: right;
    width: 300px;
    background-color: #d6e1ec;
    .form-right-header {
      padding: 10px 10px;
      display: flex;
      text-justify: inter-cluster;
      text-align: center;
    }
    // border: 1px solid red;
  }
  .wf-field {
    display: block;
    margin: 5px 0 30px;
  }

  .wf-field .fieldblock {
    display: block;
    margin: 5px 0;
    line-height: normal;
  }

  .wf-iconselect {
    overflow: auto;
    height: 300px;
  }

  .wf-iconselect .iconitem {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    overflow: hidden;
    position: relative;
  }

  .wf-iconselect .iconitem .icon {
    position: absolute;
    display: block;
    border-radius: 50%;
    bottom: 1px;
    right: 1px;
    color: #fff;
    padding: 3px 2px 2px 3px;
    margin: 2px 2px 2px 2px;
    font-size: 14px;
    background: #3f9af9;
  }

  .icon {
    font-family: "iconfontold" !important;
    font-size: 16px;
    font-style: normal;
    vertical-align: middle;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  .el-icon-check:before {
    content: "\e60b";
  }

  #approveIcon li {
    display: list-item;
    margin-right: 10px;
    float: left;
    cursor: pointer;
  }

  #approveIcon li img {
    width: 40px;
    height: 40px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #20a0ff;
    border-color: rgb(1, 144, 254);
  }

  .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid rgb(191, 203, 217);
    border-radius: 4px;
    box-sizing: border-box;
    width: 15px;
    height: 15px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  }
  .tm-readonly {
    background-color: #e4e8f1;
  }

  .tm-switch {
    margin-top: 10px;
  }

  .tm-form-item {
    margin-top: 20px;
  }

  .tm-checked {
    .el-radio__label {
      padding-left: 0px;
    }
  }
  .tm-label-span {
    padding-left: 5px;
    font-size: 12px;
    color: #5a5a5a;
  }

  .tm-input {
    // width: 100%;
    // color: #fff;
    border: 1px solid rgba(155, 152, 152, 0.671);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 20px;
    border-radius: 1px;
    padding: 5px 10px;
  }

  .tm-select {
    width: 200px;
    // color: #fff;
    border: 1px solid rgba(155, 152, 152, 0.671);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 30px;
    border-radius: 1px;
    padding: 5px 10px;
  }
  .tm-select-righticon {
    float: right;
    margin-right: 10px;
  }

  .tm-select option {
    width: 200px;
    color: #474747;
    background: rgb(201, 206, 217);
    height: 50px;
  }

  .tm-drag {
    min-height: 548px;
    cursor: move;
    background: red;
  }

  /* .tm-bg {
    position: absolute;
    left: 0%;
    top: 0;
    min-height: 800px;
    width: 100%;
    background: url(/static/img/bg.a11b598.png) no-repeat top center;
    -webkit-background-size: 100% 100%;
    z-index: -1;
} */

  .tm-formCanvas {
    // background: url("../../../assets/images/phone.png") no-repeat top center;
    list-style: none;
  }

  .filed-item {
    /* background: #ffffff;*
    /* border: 1px solid #c8c8c8; */
    border: 1px dashed rgb(240, 144, 0);
    background: #e4e7ed;
    /*  border-left: 1px solid #fff;
    border-right: 1px solid #fff;;*/
    margin: 5px 0;
    padding: 10px 10px;
    position: relative;
    cursor: move;
  }

  .tm-content {
    padding: 10px 10px;
  }

  .tm-filed-item {
    background: #ffffff;
    /* border: 1px solid #c8c8c8;  */
    // border: 1px solid #dde1e8;
    /* background: rgb(246, 166, 21); */
    // border-left: 1px solid #fff;
    // border-right: 1px solid #fff;
    // margin: 10px 0;

    position: relative;
    cursor: move;
  }

  .tm-input-select {
    // width: 50%;
    // color: #fff;
    border: 1px solid rgba(155, 152, 152, 0.671);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 20px;
    border-radius: 1px;
    padding: 5px 10px;
  }
  .tm-filed-item .js-remove {
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    top: 0;
    right: 0;
    background: #20a0ff;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: none;
    z-index: 999;
  }

  .filed-item-hover {
    border: 1px dashed #20a0ff !important;
  }

  .filed-item-hover .js-remove {
    display: block;
  }

  .form {
    /* border: 1px solid #e8e8e8; */
    /* background: #fff; */
    /* background: url(/assets/img/phone.b57729f.png) no-repeat top center; */
    /* padding: 20px 10px;
    border-radius: 10px; */
  }

  .builderView {
    // position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    // left: 38px;
    // top: 84px;
    // right: 38px;
    // bottom: 0;
    // max-height: 548px;
    border: 1px solid #20a0ff;
    background: #ebeef5;
  }

  .builderView::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
    background-color: #f7f7f7;
  }

  .builderView::-webkit-scrollbar {
    width: 6px;
    background-color: #f7f7f7;
  }

  .builderView::-webkit-scrollbar-thumb {
    background-color: #dad6d6;
  }

  .active {
    border: 1px solid #20a0ff !important;
  }

  .viewFieldView {
    float: left;
    width: 260px;
    list-style: none;
    margin: 0;
    padding: 0;
    // border: 1px solid red;
    overflow: hidden;
    background-color: #d6e1ec;
    // padding: 100px 0 0 30px;
  }

  .viewFieldView li {
    /* width: 30%; */
    width: 100px;
    /* height: 42px; */
    float: left;
    margin-right: 10px;
    /* background: rgba(1, 1, 1, .7); */
    // color: rgb(0, 0, 0);
    padding: 8px 8px 8px 8px;
    font-size: 12px;
  }

  .builderView {
    margin: 0 10px;
    list-style: none;
    font-size: 15px;
  }

  .builderView li {
    text-indent: -999em;
    height: 7px;
    background: none !important;
    border-bottom: 3px solid #ff0000;
    margin-bottom: 3px;
    padding: 0;
    position: relative;
    border-radius: 0;
  }

  .builderView li:before {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    background: #f00;
    left: 0;
    top: 0;
  }

  .builderView li:after {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    background: #f00;
    right: 0;
    top: 0;
  }

  .tm-input-road {
    border: 1px solid #dcdfe6;
    height: 30px;
    margin-top: 5px;
    line-height: 30px;
    width: 99%;
    padding: 0px;
    border-radius: 4px;
    color: #606266;
  }
  .builderView .handle {
    overflow: hidden;
  }

  .builderView .filed-item:after {
    content: "";
    display: block;
    clear: both;
    overflow: hidden;
  }

  .tm-label {
    font-size: 14px;
    font-weight: bold;
  }

  .tm-float-right {
    /* margin-left: 160px; */
    float: right;
    color: #777;
  }

  .tm-placeholder {
    padding: 5px;
    font-size: 12px;
    /* display: table-row; */
    margin-left: 10px;
    color: #777;
  }

  .tm-required {
    font-size: 12px;
    color: #777;
  }
}
* {
  margin: 0px;
  padding: 0px;
}
</style>
