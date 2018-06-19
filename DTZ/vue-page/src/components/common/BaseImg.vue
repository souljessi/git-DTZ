<template>
  <div style="width:100%;height:100%">
    <div v-for="(item3,index3) in src" :key='index3' v-lazy="item3" v-if='index3<2' class="base-img" :style="style(index3)" @click="eImgClick(index3)">
      <div class="num" v-if='index3==1 &&src.length>2'>+{{src.length-2}}</div>
    </div>
    <!-- <img class="base-img" v-lazy="src" @click="eImgClick($event)" /> -->
    <transition name="ts">
      <div v-show="showImg" class="base-imgbox">
        <div class="base-imgbox-fanc">
          <div class="base-imgbox-wrapper">
            <div class="img-header">
              <div class="img-header-close" @click="hideImg">
                <base-icon icon="close" />
              </div>
            </div>
            <div class="img-post">
              <div class="prev" @click="prev">
                <base-icon icon='back' />
              </div>
              <img class="images" v-lazy="src[index]" />
              <div class="ciro">
                <base-icon @click.native="setIndex(index2)" v-for="(item,index2) in src" :key='index2' :class="['ciro-icon',index==index2?'active':'']" icon='yuan' />
              </div>
              <div class="next" @click="next">
                <base-icon icon='back' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * @default 图片放大组件
 *
 * @props src 图片路径
 */
export default {
  name: "base-img",
  data() {
    return {
      index: 0,
      showImg: false
    };
  },
  created() {
    console.log("图片信息:", this.src);
  },
  computed: {},
  props: {
    src: {
      // 图片路径
      type: Array,
      required: () => []
    }
  },
  methods: {
    style(val) {
      return {
        backgroundImage: `url(${this.src[val]})`,
        backgroundRepeat: "no-repeat",
        // backgroundPosition:'center top',
        backgroundSize: "cover"
      };
    },
    setIndex(val) {
      this.index = val;
    },
    prev() {
      this.index--;
      if (this.index < 0) {
        this.index = this.src.length - 1;
      }
      console.log(this.index);
    },
    next() {
      this.index++;
      if (this.index >= this.src.length) {
        this.index = 0;
      }
      console.log(this.index);
    },
    eImgClick(val) {
      this.index = val;
      console.log(this.src);
      this.showImg = true;
    },
    hideImg() {
      this.showImg = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.ts-enter-active,
.ts-leave-active {
  transition: all 0.5s;
}

.ts-enter,
.ts-leave-active {
  transform: translate(100%, 0);
}

.base-img {
  float: left;
  width: 50%;
  height: 100%;
  .num {
    color: #fff;
    background: rgba(0, 0, 0, 0.43);
    display: flex;
    font-size: 50px;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
.base-imgbox {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  padding: 2px;
  background: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  .base-imgbox-fanc {
    display: flex;
    height: 100%;
    text-align: center;
    align-items: center;
    .base-imgbox-wrapper {
      display: inline-block;
      position: relative;
      margin: 0 auto;
      .img-header {
        font-size: 30px;
        height: 40px;
        line-height: 40px;
        position: relative;
        color: #fff;
        /* text-align: right; */
        .img-header-close {
          float: right;
          cursor: pointer;
        }
      }
      .img-post {
        position: relative;
        .images {
          max-width: 85vw;
          vertical-align: middle;
          max-height: calc(100vh - 180px);
          min-height: 200px;
          margin: 0 auto;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .prev {
          position: absolute;
          top: 45%;
          font-size: 40px;
          color: #dddd;
          left: -60px;
          &:hover {
            color: #fff;
            cursor: pointer;
          }
        }
        .next {
          position: absolute;
          top: 45%;
          font-size: 40px;
          color: #dddd;
          right: -60px;
          transform: rotate(180deg);
          &:hover {
            color: #fff;
            cursor: pointer;
          }
        }
        .ciro {
          position: absolute;
          left: 0%;
          width: 100%;
          bottom: -30px;
          .ciro-icon {
            font-size: 14px;
            color: #dddd;
            &:hover {
              color: #409eff;
              cursor: pointer;
            }
          }
          .active {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
