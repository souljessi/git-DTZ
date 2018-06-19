<template>
  <div class="tm-wrap">
    <el-row>
      <el-col :span="18" style="color:#fff;margin-top: 25px">
        <div style="margin-left:80px;">
          <base-icon style="font-size:40px;" icon="cussheji" />
          <span style="font-size:30px; padding-right:5px;">审批管理后台</span>
          <span style="margin:0px;font-size:32px;">|</span>
          <span style="font-size:18px;padding-left:5px">设计器</span>
        </div>
      </el-col>
      <el-col :span="4" style="margin-top: 25px">
        <el-button style="width:90px;" type="primary" plain @click="back()">返回</el-button>
        <el-button style="width:90px;" type="primary" plain @click="formSave()">保存</el-button>
      </el-col>
    </el-row>
    <el-row class="tm-bg">
      <!-- 左侧组件 -->
      <el-col :span="8">
        <ul class="viewFieldView" id="view1">
          <div style="padding-bottom:20px;" class="wf-panel-tab">
            <a class="tabitem current" style="width:350px;">控件库</a>
          </div>
          <draggable v-model="leftArray" :options="dragOptions" @start="onStart" @end="temEnd">
            <transition-group type="transition" :name="'flip-list'">
              <li class="filed-item" v-for="(element,index) in leftArray" :key="index">
                <div class="handle">
                  <span style="float:left">{{element.label}}</span>
                  <span style="float:right">
                    <base-icon style="font-size:18px;" :icon="element.icon" /></span>
                </div>
              </li>
            </transition-group>
          </draggable>
        </ul>
      </el-col>
      <!-- 中间拖拽展示 -->
      <el-col :span="8" class="form" style=" overflow: hidden;">
        <div class="tm-formCanvas">
          <div class="builderView">
            <draggable style="min-height:520px;" :list="myArray" @add='onAdd' @end='onEnd' :options="formDragOptions">
              <div class="tm-filed-item" :index=index v-for="(element,index) in myArray" :key="index">
                <!-- m-input -->
                <div class="tm-content" v-show="element.type=='m-input'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span style="float:left" class="tm-label1">{{element.label}}</span>
                    <div style="float:left" v-show="!element.readonly">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                    <div style="float:left" v-show="element.readonly">
                      <span style="margin-left:15px;">{{element.value}}</span>
                    </div>
                  </div>
                </div>
                <!-- m-address -->
                <div class="tm-content" v-show="element.type=='m-address'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>

                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float:right;margin-right:10px;">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>

                    <!-- <span style="margin-left:15px;">云南省/昆明市</span>
                                                                            <span v-show="element.hideDistrict">/盘龙区</span> -->

                  </div>
                </div>
                <!-- m-datetime -->
                <div class="tm-content" v-show="element.type=='m-datetime'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float:right;margin-right:10px;">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>

                  </div>
                </div>
                <!-- m-datetime-range -->
                <div class="tm-content" v-show="element.type=='m-datetime-range'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.beginTimeLabel}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float:right;margin-right:10px;">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>

                  <div class="handle">
                    <span class="tm-label1">{{element.endTimeLabel}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float:right;margin-right:10px;">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>

                  </div>
                </div>

                <!-- m-textarea -->
                <div class="tm-content" v-show="element.type=='m-textarea'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span style="float:left" class="tm-label1">{{element.label}}</span>
                    <div style="float:left" v-show="!element.readonly">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                    <div style="float:left" v-if="element.readonly">
                      <span style="margin-left:15px;">{{element.value.text}}</span>
                    </div>
                  </div>
                </div>
                <!-- m-switch -->
                <div class="tm-content" v-show="element.type=='m-switch'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float:right;margin-right:10px;">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                    </div>

                  </div>
                </div>
                <!-- m-selector -->
                <!-- <div class="tm-content" v-show="element.type=='m-selector'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>

                    </div>
                  </div>
                </div> -->
                <!-- m-radio -->
                <div class="tm-content" v-show="element.type=='m-radio'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>

                    </div>
                  </div>
                </div>
                <!-- m-picker -->
                <!-- <div class="tm-content" v-show="element.type=='m-picker'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>

                    </div>
                  </div>
                </div> -->
                <!-- m-checkbox -->
                <div class="tm-content" v-show="element.type=='m-checkbox'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>
                </div>
                <!-- m-scan -->
                <div class="tm-content" v-show="element.type=='m-scan'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <base-icon icon="saoma" />
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>
                </div>
                <!-- m-upload-file -->
                <div class="tm-content" v-show="element.type=='m-upload-file'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <base-icon icon="cusfile" />
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>
                </div>
                <!-- m-text -->
                <div class="tm-content" style="background:rgba(0,0,0,0)" v-show="element.type=='m-text'">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.text}}</span>
                    <span class="tm-float-right">
                      <!-- <i class="el-icon-arrow-right"></i> -->
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <!-- <span class="tm-placeholder">{{element.text}}</span> -->
                    </div>
                  </div>
                </div>
                <!-- m-upload-img -->
                <div class="tm-content" v-show="element.type=='m-upload-img'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>
                  <div style="height:60px;margin-left:70px;line-height:60px">
                    <div style="float:left;width:70px;font-size:20px; background:rgb(228, 228, 228);text-align:center">
                      <base-icon icon="count" />
                    </div>

                  </div>
                </div>

                <!-- m-select-person -->
                <div class="tm-content" v-show="element.type=='m-select-person'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                      <span class="tm-required" v-show="element.required">(必填)</span>
                    </div>
                  </div>
                </div>
                <!-- m-select-area -->
                <div class="tm-content" v-show="element.type=='m-select-area'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <!-- <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                    </div> -->
                    <span class="tm-required" v-show="element.required">(必填)</span>

                  </div>
                </div>
                <!-- m-gps-point -->
                <div class="tm-content" v-show="element.type=='m-gps-point'" :class="{'tm-readonly':element.readonly}">
                  <div class="js-remove" @click="nodeRemove(element,index)">X</div>
                  <div class="handle">
                    <span class="tm-label1">{{element.label}}</span>
                    <span class="tm-float-right">
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <!-- <div style="float: right;margin-right: 10px">
                      <span class="tm-placeholder">{{element.placeholder}}</span>
                    </div> -->
                    <span class="tm-required" v-show="element.required">(必填)</span>

                  </div>
                </div>
              </div>
            </draggable>
          </div>

        </div>

      </el-col>
      <!-- 右侧属性列表 -->
      <el-col :span="8">
        <div style="" class="wf-panel wf-settingpanel">
          <div style="" class="wf-panel-tab">
            <a class="tabitem " @click="controlSet">控件设置</a>
            <a class="tabitem current" @click="formSet">表单设置</a>

          </div>
          <div class="wf-form wf-formsettings" v-show="controEnable">
            <!-- m-input -->
            <form v-if="checkObj.type=='m-input'">
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
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">Input输入最小长度</label>
                  <span class="tm-label-span">默认0</span>
                </div>
                <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.minLength">
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">Input输入最大长度</label>
                  <span class="tm-label-span">默认100</span>
                </div>
                <input style="width:180px;" type="number" class="tm-input" v-model="checkObj.maxlength">
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否开启录音功能</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.isEnableRecord">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
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
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-address -->
            <form v-if="checkObj.type=='m-address'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否隐藏区</label>
                  <span class="tm-label-span">例：云南省/昆明市
                    <span v-show="!checkObj.hideDistrict">/盘龙区</span>
                  </span>

                </div>
                <el-switch class="tm-switch" v-model="checkObj.hideDistrict">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div>
            </form>
            <!-- m-datetime -->
            <form v-if="checkObj.type=='m-datetime'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">时间类型</label>
                  <span class="tm-label-span"></span>
                </div>
                <div style="margin-top:10px;">
                  <el-radio style="color:#fff" v-model="checkObj.format" label="YYYY-MM-DD HH:mm:ss">年-月-日 时:分:秒
                  </el-radio>
                </div>
                <div style="margin-top:5px;">
                  <el-radio style="color:#fff" v-model="checkObj.format" label="YYYY-MM-DD">年-月-日</el-radio>
                </div>
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">可选择的最小年份</label>
                  <span class="tm-label-span"></span>
                </div>
                <input oninput="if(value.length>4)value=value.slice(0,4)" type='number' class="tm-input" v-model="checkObj.minYear">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">可选择的最大年份</label>
                  <span class="tm-label-span"></span>
                </div>
                <input oninput="if(value.length>4)value=value.slice(0,4)" type='number' class="tm-input" v-model="checkObj.maxYear">
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-datetime-range-->
            <form v-if="checkObj.type=='m-datetime-range'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题1</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.beginTimeLabel">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题2</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.endTimeLabel">
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">时间类型</label>
                  <span class="tm-label-span"></span>
                </div>
                <div style="margin-top:10px;">
                  <el-radio style="color:#fff" v-model="checkObj.format" label="YYYY-MM-DD HH:mm:ss">年-月-日 时:分:秒
                  </el-radio>
                </div>
                <div style="margin-top:5px;">
                  <el-radio style="color:#fff" v-model="checkObj.format" label="YYYY-MM-DD HH:mm">年-月-日 时:分</el-radio>
                </div>
                <div style="margin-top:5px;">
                  <el-radio style="color:#fff" v-model="checkObj.format" label="YYYY-MM-DD">年-月-日</el-radio>
                </div>

              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">时间间隔</label>
                  <span class="tm-label-span"></span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.value" />
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">可选择的最小年份</label>
                  <span class="tm-label-span"></span>
                </div>
                <input oninput="if(value.length>4)value=value.slice(0,4)" type='number' class="tm-input" v-model="checkObj.minYear">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">可选择的最大年份</label>
                  <span class="tm-label-span"></span>
                </div>
                <input oninput="if(value.length>4)value=value.slice(0,4)" type='number' class="tm-input" v-model="checkObj.maxYear">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">开始时间是今天</label>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.startDateIsToday"  >
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">结束时间是今天</label>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.endDateIsToday"  >
                </el-switch>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-textarea -->
            <form v-if="checkObj.type=='m-textarea'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />

              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder">
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">行数</label>
                  <label class="tm-label-span">默认3</label>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.rows">
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">列数</label>
                  <label class="tm-label-span">默认30</label>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.cols">
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">允许的最大长度</label>
                  <label class="tm-label-span">默认0</label>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.maxLength">
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>

              <div class="tm-form-item" v-if="checkObj.readonly">
                <div>
                  <label class="tm-label">默认值</label>
                  <span class="tm-label-span">默认为空</span>
                </div>
                <input class="tm-input" v-model="checkObj.value.text">

              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-switch -->
            <form v-if="checkObj.type=='m-switch'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>

              <div class="tm-form-item">
                <div>
                  <label class="tm-label">默认值</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.value"></el-switch>
              </div>

              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-selector -->
            <!-- <form v-show="checkObj.type=='m-selector'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">文本提示</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">选项</label>
                  <span class="tm-label-span">最多200项，每项最多20字</span>
                </div>
                <div v-for="(item,index) in checkObj.options" class="tm-checked">
                  <input maxlength="20" class="tm-input-select" :value=item.value index/>

                  <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;border-radius: 50%" @click="deleteSelector(index)">
                    <i class="el-icon-minus"></i>
                  </span>
                  <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;margin-left: 5px" @click="addSelector(index)">
                    <i class="el-icon-plus"></i>
                  </span>

                </div>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否可用</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.disabled"></el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否可选</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly"></el-switch>
              </div>
            </form> -->
            <!-- m-radio-->
            <form v-if="checkObj.type=='m-radio'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">提示文字</label>
                  <span class="tm-label-span">最多20个字</span>
                </div>
                <input maxlength="20" class="tm-input" v-model="checkObj.placeholder" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">选项</label>
                  <span class="tm-label-span">最多200项，每项最多20字</span>
                </div>
                <div v-for="(item,index) in checkObj.options" class="tm-checked">
                  <input maxlength="20" class="tm-input-select" v-model=item.name index/>

                  <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;border-radius: 50%" @click="deleteSelector(index)">
                    <i class="el-icon-minus"></i>
                  </span>
                  <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;margin-left: 5px" @click="addSelector(index)">
                    <i class="el-icon-plus"></i>
                  </span>

                </div>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>

            <!--m-picker -->
            <!-- <form v-show="checkObj.type=='m-picker'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">选项</label>
                  <span class="tm-label-span">最多n项</span>
                </div>
              </div>
            </form> -->
            <!-- m-checkbox -->
            <form v-if="checkObj.type=='m-checkbox'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">单选还是多选</label>
                </div>
                <el-radio-group v-model="checkObj.checkType">
                  <el-radio style="color: #e6f1fe" label="checkbox">多选</el-radio>
                  <el-radio style="color: #e6f1fe" label="radio">单选</el-radio>
                </el-radio-group>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">最多可选几项</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.max" />
              </div>

              <div class="tm-form-item">
                <div>
                  <label class="tm-label">选项</label>
                </div>
                <div v-for="(item,index) in checkObj.options" class="tm-checked">
                  <input maxlength="20" class="tm-input-select" v-model=item.name index/>

                  <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;border-radius: 50%" @click="deleteSelector(index)">
                    <i class="el-icon-minus"></i>
                  </span>
                  <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;margin-left: 5px" @click="addSelector(index)">
                    <i class="el-icon-plus"></i>
                  </span>

                </div>
              </div>

              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly"  >
                </el-switch>
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!-- m-scan -->
            <form v-if="checkObj.type=='m-scan'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span"></span>
                </div>
                <input class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div>
            </form>
            <!-- m-text -->
            <form v-if="checkObj.type=='m-text'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span"></span>
                </div>
                <input class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!--m-upload-img -->
            <form v-if="checkObj.type=='m-upload-img'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">选择图片</span>
                </div>
                <input class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">图片宽度</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.targetWidth" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">图片高度</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.targetHeight" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">最多传几张</label>
                  <span class="tm-label-span">默认0 为不限制,最大值10</span>
                </div>
                <el-input-number v-model="checkObj.max" :min="checkObj.min" :max="10"></el-input-number>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">最少传几张</label>
                  <span class="tm-label-span">默认0 为不限制,最大值10</span>
                </div>
                <el-input-number v-model="checkObj.min" :min="0" :max="checkObj.max"></el-input-number>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow"  >
                </el-switch>
              </div> -->
            </form>
            <!--m-upload-file-->
            <form v-if="checkObj.type=='m-upload-file'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span"></span>
                </div>
                <input class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">最多传几个</label>
                  <span class="tm-label-span">默认0 为不限制 ,最大值10</span>
                </div>
                <el-input-number v-model="checkObj.max" :min="checkObj.min" :max="10"></el-input-number>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">最少传几个</label>
                  <span class="tm-label-span">默认0 为不限制,最大值10</span>
                </div>
                <el-input-number v-model="checkObj.min" :min="0" :max="checkObj.max"></el-input-number>
              </div>

              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">图片宽度</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.targetWidth" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">图片高度</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.targetHeight" />
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow"  >
                </el-switch>
              </div> -->
            </form>
            <!-- m-select-person-->
            <form v-if="checkObj.type=='m-select-person'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">单选还是多选</label>
                </div>
                <el-radio-group v-model="checkObj.selectType">
                  <el-radio style="color: #e6f1fe" label="select">单选</el-radio>
                  <el-radio style="color: #e6f1fe" label="mselect">多选</el-radio>
                </el-radio-group>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">最多可选几项</label>
                  <span class="tm-label-span"></span>
                </div>
                <input type="number" class="tm-input" v-model="checkObj.max" />
              </div> -->

              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">选项</label>
                </div>
                <div v-for="(item,index) in checkObj.options" class="tm-checked">
                  <input maxlength="20" class="tm-input-select" :value=item.value index/>
                  <span v-if="checkObj.options.length > 1" style="width:15px;height: 15px;background-color: #333333;border-radius: 50%" @click="deleteSelector(index)">
                    <i class="el-icon-minus"></i>
                  </span>
                  <span style="width:15px;height: 15px;background-color: #333333;border-radius: 50%;margin-left: 5px" @click="addSelector(index)">
                    <i class="el-icon-plus"></i>
                  </span>
                </div>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否允许删除选择的item</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.disDelAble">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!--m-select-area-->
            <form v-if="checkObj.type=='m-select-area'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">单选还是多选</label>
                </div>
                <el-radio-group v-model="checkObj.selectType">
                  <el-radio style="color: #e6f1fe" label="select">单选</el-radio>
                  <el-radio style="color: #e6f1fe" label="mselect">多选</el-radio>
                </el-radio-group>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
            <!--m-gps-point -->
            <form v-if="checkObj.type=='m-gps-point'">
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">标题</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="checkObj.label" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否自动刷新</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.isAutoGetGPS">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否必填</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.required">
                </el-switch>
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">是否只读</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.readonly">
                </el-switch>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">操作角色</label>
                  <span class="tm-label-span"></span>
                </div>
                <el-select style="margin-top:10px;" v-model="checkObj.role" placeholder="请选择角色" multiple collapse-tags>
                  <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.enname" :value="item.id"></el-option>
                </el-select>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">移动端列表展示</label>
                  <span class="tm-label-span">app中审批列表展示信息</span>
                </div>
                <el-switch class="tm-switch" v-model="checkObj.listShow">
                </el-switch>
              </div>
            </form>
          </div>

          <!--表单设置-->
          <div class="wf-form wf-formsettings" v-show="formEnable">
            <form>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">审批名称</label>
                  <span class="tm-label-span">最多10个字</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="formInfo.template_name" />
              </div>
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">审批编码</label>
                  <span class="tm-label-span">请输入审批名称拼音简写</span>
                </div>
                <input maxlength="10" class="tm-input" v-model="formInfo.template_code" />
              </div>
              <div class="tm-form-item" v-if="isApprove">
                <div>
                  <label class="tm-label">审批分组</label>
                  <span class="tm-label-span"></span>
                </div>
                <select class="tm-select" v-model="formInfo.template_group">
                  <option :value="item.value" v-for="(item,index) in bdfz" :key="index">{{item.label}}</option>

                </select>
              </div>
              <div class="tm-form-item" v-if="isApprove">
                <div>
                  <label class="tm-label">描述</label>
                  <span class="tm-label-span"></span>
                </div>
                <textarea class="tm-input" style="height:30px" rows="2" v-model="formInfo.remarks" placeholder="输入描述信息"></textarea>
              </div>
              <!-- <div class="tm-form-item">
                <div>
                  <label class="tm-label">审批说明</label>
                  <span class="tm-label-span">最多100个字</span>
                </div>
                <textarea maxlength="100" class="tm-input"></textarea>
              </div> -->
              <div class="tm-form-item">
                <div>
                  <label class="tm-label">图标</label>
                  <span class="tm-label-span"></span>
                </div>
                <div class="wf-field wf-setting-icon">
                  <div class="fieldblock">
                    <div class="wf-iconselect" style="display: block">
                      <ul id="approveIcon" style="display: block;float: left;padding-left:0px;">
                        <li v-for="(item,index) in iconArr" :key="index" class="iconitem selected">
                          <img :src="'http://'+ServerimageUrl+item.img" @click="iconSelect(index)">
                          <span v-show="item.showing" :index=index class="el-checkbox__input
                                       is-checked" style="top:-26px;left:21px">
                            <span class="el-checkbox__inner"></span>
                            <input type="checkbox" class="el-checkbox__original" value="workHours">
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";

import * as formType from "assets/js/appFormType.js";
//   import ElSwitch      from "node_modules/element-ui/packages/switch/src/component.vue";
//   import ElInput       from "node_modules/element-ui/packages/input/src/input.vue";
import { dateFormat } from "assets/js/date";
import { getDicData } from "assets/js/commonManage.js";
export default {
  data() {
    return {
      drag: false,
      leftArray: formType.formType,
      editable: false,
      myArray: [],
      checkObj: {},
      controEnable: false,
      formEnable: true,
      iconArr: [],
      isChecked: false,
      ServerimageUrl: "", //后台地址 ,
      formInfo: {
        id: null,
        template_name: null,
        template_code: null,
        create_by: null,
        update_by: null,
        create_date: null,
        update_date: null,
        form_type: 1,
        icon_path: null,
        template_group: "1",
        remarks:''
        // is_use: "0",
        // is_custom_tem: "1"
      },
      count: 1,
      bdfz: "",
      isApprove: false,
      roleOptions: []
    };
  },
  created() {
    this.bdfz = getDicData("bdfz");
    console.log("分组", this.bdfz);
    this.ServerimageUrl = this.$webconfig.serverIp;
    console.log(this.ServerimageUrl);
    this.getIcon(); //获取图标
    this.getRole();
    console.log("参数传递", this.$route.query);
    this.enJudgment();
    // if (this.$route.query && this.$route.query.form_items) {
    //   //判断是否有form_items数据，有则是编辑表单

    //   this.formInfo = Object.assign({}, this.$route.query);
    //   console.log(this.$route.query);
    //   this.myArray = JSON.parse(this.formInfo.form_items);
    //   console.log(1111, this.iconArr);

    //   /**
    //    * 完成表单的信息，创建人，创建时间等需要传递。
    //    */
    // } else {
    //   //判断是否有form_items数据，无则是新增表单
    //   console.log("新增");
    //   let windData = JSON.parse(this.$getStore("userData"));
    //   console.log(windData);
    //   this.formInfo.create_by = windData.id;
    // }
  },
  methods: {
    /**
     * 入口判断
     */
    enJudgment() {
      if (this.$route.query) {
        if (this.$route.query.isApprove) {
          //是否是审批模式
          this.isApproveInfo(this.$route.query.isApprove);
        } else {
          this.isTemplate();
        }
      } else {
        this.isTemplate();
      }
    },
    //设置在编辑模式下初始化key的初始值
    setCount(str) {
      let nums = [];
      for (let item of str) {
        nums.push(item.key.match(/\d+/)[0]);
      }
      this.count = Math.max.apply(Math, nums) + 1;
      console.log(this.count);
    },
    /**
     * 审批进入
     * @param {Number} value 审批模式 1 新增 2 编辑
     */
    isApproveInfo(value) {
      console.log(2222, value);
      this.isApprove = true;
      switch (parseInt(value)) {
        case 1: //新增
          if (this.$route.query && this.$route.query.form_items) {
            let approveData = this.$route.query;
            //审批带模板新增
            this.formInfo = {
              form_items: approveData.form_items,
              template_code: approveData.template_code,
              template_name: approveData.template_name,
              icon_path: approveData.icon_path,
              template_group: approveData.template_group | 1,
              remarks:approveData.remarks,
            };
            this.myArray = JSON.parse(this.formInfo.form_items);
          } else {
            //审批不带模板新增
            console.log("tessssss");
            this.formInfo = {
              form_items: "",
              template_code: "",
              template_name: "",
              icon_path: "",
              template_group: "1",
              remarks:''
            };
            let windData = JSON.parse(this.$getStore("userData"));
            console.log(windData);
            this.formInfo.create_by = windData.id;
          }
          break;
        case 2: //编辑
          let approveData = this.$route.query;
          console.log(approveData);
          this.formInfo = {
            id: approveData.id,
            form_items: approveData.form_items,
            template_code: approveData.template_code,
            template_name: approveData.template_name,
            icon_path: approveData.icon_path,
            template_group: approveData.template_group,
            remarks:approveData.remarks
          };
          this.myArray = JSON.parse(this.formInfo.form_items);
          this.setCount(this.myArray);
          break;
        default:
          break;
      }
    },
    /**
     * 自定义模板进入
     */
    isTemplate() {
      if (this.$route.query && this.$route.query.form_items) {
        //判断是否有form_items数据，有则是编辑表单

        this.formInfo = Object.assign({}, this.$route.query);
        console.log(this.$route.query);
        this.myArray = JSON.parse(this.formInfo.form_items);
        this.setCount(this.myArray);
        /**
         * 完成表单的信息，创建人，创建时间等需要传递。
         */
      } else {
        //判断是否有form_items数据，无则是新增表单
        console.log("新增");
        let windData = JSON.parse(this.$getStore("userData"));
        console.log(windData);
        this.formInfo.create_by = windData.id;
      }
    },
    async getRole() {
      const Res = await this.$http.get("/sys/RoleController/getRoleNames");
      if (Res && Res.data.success) {
        console.log(Res);
        this.roleOptions = Res.data.result;
      }
    },

    /**
     * 移除选中节点
     * @param {Object} element
     * @param {Number} index
     */
    nodeRemove(element, index) {
      console.log("element", element);
      this.myArray = this.myArray.filter((item, i) => {
        if (index !== i) {
          //过滤条件，把index不等于i的返回
          return item;
        }
      });
      console.log(3333, this.myArray);
    },
    onStart(event) {
      this.drag = true;
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
    },
    onAdd(event) {
      console.log("event", event);
    },
    temEnd(event) {
      this.myArray = JSON.parse(JSON.stringify(this.myArray));
      this.myArray[event.newIndex].key =
        this.myArray[event.newIndex].key + this.count;
      this.count++;

      //            if(this.myArray.length > 1){
      //              myArray.forEach(item=>{
      //
      //              })
      //              for(let i = 0;i<this.myArray.length;i++){
      //
      //                let flag = false;
      //                for(let j = 0;j< this.myArray.length;j++){
      //                  if(this.myArray[i].type === this.myArray[j].type){
      //                    console.log(this.myArray[i].type === this.myArray[j].type);
      //                   count++;
      //                   console.log(count);
      //                    flag = true;
      //                    this.myArray[j].name = this.myArray[i].name + count
      //                  }
      //
      //                }
      //              }
      //            }
      /*
        拖动的时候判断myArray里面是否有type为m-datetime-range，如果有则不生成，保证时间范围这个控件的唯一性
         */
      let res = [];
      let len = this.myArray.length;
      console.log("33333333");
      /**
       * 在数组里面判断重复的对象。
       */
      for (let i = 0; i < len; i++) {
        let flag = true;
        for (let j = i; j < len - 1; j++) {
          console.log("666666666", this.myArray[i].type);
          console.log("88888888", this.myArray[j + 1].type);
          if (
            this.myArray[i].type === this.myArray[j + 1].type &&
            this.myArray[j + 1].type === "m-datetime-range"
          ) {
            console.log("4444444");
            flag = false;
          }
          if (
            this.myArray[i].type === this.myArray[j + 1].type &&
            this.myArray[j + 1].type === "m-textarea"
          ) {
            flag = false;
          }
        }
        if (flag) {
          res.push(this.myArray[i]);
        }
      }

      this.myArray = res;
      console.log("this.myArray", this.myArray);
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
        key: index,
        value: "选项" + (vm.checkObj.options.length + 1)
      };
      console.log("addIndex", index);
      vm.checkObj.options.splice(index + 1, 0, val);
    },
    /**
     * 控制设置按钮
     */
    controlSet() {
      $(".tabitem").toggleClass("current");
      this.formEnable = false;
      this.controEnable = true;
    },
    /**
     * 表单设置按钮
     */
    formSet() {
      $(".tabitem").toggleClass("current");
      this.formEnable = true;
      this.controEnable = false;
    },
    /**
     * 表单保存按钮
     */
    async formSave() {
      console.log(typeof this.myArray);
      let vm = this;
      //        GetArgs(decodeURIComponent(window.location.href), "par");
      //       function GetArgs(params, paramName){
      //          let argsIndex = params.indexOf("?");
      //          let arg = params.substring(argsIndex + 1);
      //          let args = arg.split("&");
      //          let valArg = "";
      //          for (let i = 0; i < args.length; i++) {
      //            str = args[i];
      //            let arg = str.split("=");
      //
      //            if (arg.length <= 1) continue;
      //            if (arg[0] === paramName) {
      //              valArg = arg[1];
      //            }
      //          }
      //        return valArg
      //        }
      //
      //        let obj = JSON.parse(GetArgs(decodeURIComponent(window.location.href), "par"));//获取url里的参数
      //        console.log(obj);
      if (vm.formInfo.template_name === "") {
        vm.$message({
          message: "审批名称不允许为空",
          type: "warning"
        });
        return;
      }
      if (vm.formInfo.template_code === "") {
        vm.$message({
          message: "审批编码不允许为空",
          type: "warning"
        });
        return;
      }
      if (vm.myArray.length === 0) {
        vm.$message({
          message: "空审批不允许保存",
          type: "warning"
        });
      } else {
        let custom = {};
        let Array = {
          form_items: JSON.stringify(vm.myArray)
        };
        console.log("Array:", Array);

        //修改表单
        if (vm.$route.query && vm.$route.query.form_items) {
          vm.formInfo.update_date = dateFormat(
            new Date(),
            "yyyy-MM-dd hh:mm:ss"
          );
          let windData = JSON.parse(vm.$getStore("userData"));
          console.log(windData);
          this.formInfo.update_by = windData.id;
          custom = Object.assign({}, this.formInfo);
          custom.form_items = JSON.stringify(vm.myArray);
        } else {
          vm.formInfo.create_date = dateFormat(
            new Date(),
            "yyyy-MM-dd hh:mm:ss"
          );
          Object.assign(custom, vm.formInfo, Array); //对象合并
          console.log("custom", custom);
        }
        if (this.isApprove) {
          let data = {
            formId: custom.id,
            userId: custom.create_by,
            data: custom.form_items,
            templateCode: custom.template_code,
            formName: custom.template_name,
            icon: custom.icon_path,
            templateGroup: custom.template_group,
            remarks:custom.remarks,
            formType: 1
          };
          console.log(data);

          const Res = await this.$http.post(
            "/bpmn/BpmnController/saveFormTemplate",
            data
          );
          console.log(Res);
          if (Res && Res.data && Res.data.success) {
            this.$confirm("保存成功", "提示", {
              confirmButtonText: "返回模板管理",
              cancelButtonText: "取消",
              type: "success"
            })
              .then(() => {
                this.$router.push({ path: "deploymentList" });
              })
              .catch(() => {
                console.log("取消");
              });
          } else {
            this.$message.error(Res.data.msg);
          }
        } else {
          /**
           * 创建表单的当前时间
           */
          const Res = await this.$http.post(
            "/oa/CustFormController/saveCustForm",
            custom
          );
          console.log(Res);
          if (Res && Res.data && Res.data.success) {
            this.$confirm("保存成功", "提示", {
              confirmButtonText: "返回模板管理",
              cancelButtonText: "取消",
              type: "success"
            })
              .then(() => {
                this.$router.push({ path: "customForm" });
              })
              .catch(() => {
                console.log("取消");
              });
          } else {
            this.$message.error(Res.data.msg);
          }
        }
      }
    },
    /**
     * 页面返回按钮
     */
    back() {
      let vm = this;
      vm.$router.back();
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
     * 读取服务端图标
     */
    getIcon() {
      let vm = this;
      vm.$http
        .post("/oa/CustFormController/getCusFormIcon")
        .then(function(res) {
          console.log("res", res);
          let obj = {};
          if (res && res.data && res.data.success) {
            let iconData = res.data.result;
            for (let i = 0; i < iconData.length; i++) {
              obj.img = iconData[i].img;
              obj.showing = iconData[i].showing;
              vm.iconArr.push(obj);
              obj = {};
            }
          }
          console.log("毁掉", vm.iconArr);
          if (vm.$route.query && vm.$route.query.form_items) {
            vm.iconArr = vm.iconArr.map(item => {
              console.log("test");
              if (vm.formInfo.icon_path === item.img) {
                console.log("333");

                item.showing = true;
              }
              return item;
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
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
      console.log(e);
      console.log($(this).attr("index"));
      self.checkObj = self.myArray[$(this).attr("index")] || {};
      console.log("object", self.checkObj);
      e.stopPropagation();
      let filed_item = $(".builderView").find(".tm-filed-item");

      filed_item.removeClass("active");
      $(this).addClass("active");
      //console.log($(this).data("id"))
    });
  },
  components: {
    //   ElInput,
    //   ElSwitch,
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

 
<style lang="scss">
.tm-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../../../../assets/images/bg.png") no-repeat top center;
  /* background: red; */
  /* background-image: url(/static/img/loginBg11.936629c.jpg); */
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  background-size: 100% 100%;
  .tm-readonly {
    background-color: #e4e8f1;
  }

  .el-icon-minus {
    color: #f9f9f9;
  }

  .el-icon-plus {
    color: #f9f9f9;
  }

  .tm-switch {
    margin-top: 10px;
  }

  .tm-form-item {
    margin-top: 20px;
    margin-bottom: 20px;
    .el-input--suffix .el-input__inner {
      padding-right: 35px;
    }
    .el-input__inner {
      height: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 0px;
    }
  }

  .tm-label-span {
    padding-left: 5px;
    font-size: 12px;
    color: #ccc;
  }

  .tm-input {
    width: 90%;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 20px;
    border-radius: 1px;
    padding: 5px 10px;
  }

  .tm-input-select {
    width: 50%;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 20px;
    border-radius: 1px;
    padding: 5px 10px;
  }

  .tm-checked span {
    cursor: pointer;
  }

  .tm-select {
    width: 200px;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.6);
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.1);
    height: 30px;
    border-radius: 1px;
    padding: 5px 10px;
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
    position: absolute;
    left: 35%;
    top: -54px;
    /*margin-left: 400px;*/
    height: 766px;
    width: 421px;
    /*margin-left: -251px;*/
    background: url("../../../../assets/images/phone.png") no-repeat top center;
    -webkit-background-size: 100% 100%;
    list-style: none;
  }

  .filed-item {
    /* background: #ffffff;*/
    /* border: 1px solid #c8c8c8; */
    border: 1px dashed rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
    /*  border-left: 1px solid #fff;
    border-right: 1px solid #fff;;*/
    margin: 10px 0;
    padding: 10px 10px;
    position: relative;
    cursor: move;
  }

  .tm-content {
    padding: 15px 10px;
  }

  .tm-filed-item {
    background: #ffffff;
    /* border: 1px solid #c8c8c8;  */
    border: 1px solid #dde1e8;
    /* background: rgb(246, 166, 21); */
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    margin: 10px 0;

    position: relative;
    cursor: move;
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
    background: url(../../../../assets/images/phone.png) no-repeat top center;
    /* padding: 20px 10px;
    border-radius: 10px; */
  }

  .builderView {
    position: absolute;
    overflow-x: hidden;
    overflow-y: auto;
    left: 38px;
    top: 84px;
    right: 38px;
    bottom: 0;
    max-height: 548px;
    background: #f0eff4;
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
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 100px 0 0 80px;
  }

  .viewFieldView li {
    /* width: 30%; */
    width: 148px;
    /* height: 42px; */
    float: left;
    margin-right: 4%;
    /* background: rgba(1, 1, 1, .7); */
    color: #fff;
    padding: 10px 8px 10px 8px;
    font-size: 12px;
  }

  .builderView {
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
    font-size: 16px;
    color: #f6faff;
  }

  .tm-label1 {
    font-size: 16px;
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

  .wf-panel {
    position: absolute;
  }

  .wf-settingpanel {
    right: 0;
    top: 96px;
    bottom: 0;
    max-height: 500px;
    margin-right: 50px;
  }

  .wf-panel-tab {
    height: 32px;
  }

  .wf-panel-tab .tabitem.current {
    color: #2db7f5;
    border-bottom: 2px solid #2db7f5;
  }

  .wf-panel-tab .tabitem {
    display: inline-block;
    width: 175px;
    height: 35px;
    line-height: 35px;
    font-size: 17px;
    text-align: left;
    border-radius: 2px;
    border-bottom: 2px solid #ccc;
    color: #ccc;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  .wf-settingpanel .wf-form {
    position: absolute;
    top: 40px;
    bottom: 0;
    overflow-y: auto;
    left: 0;
    right: 0;
    // padding: 19px 0;
  }

  .wf-settingpanel .wf-field[class*="wf-setting-"] {
    color: #fff;
  }

  .wf-field {
    display: block;
    margin: 5px 0 30px;
  }
  .el-button--primary.is-plain {
    color: #409eff;
    background: #432f54;
    border-color: #409eff;
  }
  .el-input-number {
    margin-top: 10px;
  }
  .el-input-number__increase {
    background: rgba(0, 0, 0, 0);
  }
  .el-input-number__decrease {
    background: rgba(0, 0, 0, 0);
  }
  .wf-field .fieldblock {
    display: block;
    margin: 5px 0;
    line-height: normal;
  }

  .wf-iconselect {
    overflow: auto;
    height: 191px;
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

    border-color: #f0f8ff;

    // border-color: rgb(1, 144, 254);
  }

  .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid rgb(191, 203, 217);
    border-radius: 4px;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    &::after {
      height: 14px;
      left: 5px;
      top: -1px;
      width: 7px;
    }
  }
}
</style>
