<template>
    <div class="video-cloud">
        <div class="circle ">
            <div class="ring">
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
                <a class="menuItem">
                    <base-icon class="icon" icon='newjt' />
                </a>
            </div>
            <a class="center">
                <base-icon icon='suo' />
            </a>
        </div>
        <div class="video-tool">
            <div class="speed">
                <div class="speed-item1">
                    <span>步长</span>
                    <span>
                        <base-icon icon='videojian' /></span>
                </div>
                <div class="speed-item2">
                    <el-slider v-model="speed"></el-slider>
                </div>
                <div class="speed-item3">
                    <base-icon icon='videojia' /></span>
                </div>
            </div>
            <div class="speed">
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videojian' />
                    </a>
                </div>
                <div class="speed-item2" style="height:30px; line-height:30px;">缩放</div>
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videojia' />
                    </a>
                </div>

            </div>
            <div class="speed">
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videoljj' />
                    </a>
                </div>
                <div class="speed-item2" style="height:30px; line-height:30px;">光圈</div>
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videojl' />
                    </a>
                </div>

            </div>
                 <div class="speed">
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videosuox' />
                    </a>
                </div>
                <div class="speed-item2" style="height:30px; line-height:30px;">聚焦</div>
                <div class="speed-item2">
                    <a class="speed-title">
                        <base-icon icon='videofanda' />
                    </a>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "video-cloud",
  data() {
    return {
      speed: 50
    };
  },
  mounted() {
    var items = document.querySelectorAll(".menuItem");

    for (var i = 0, l = items.length; i < l; i++) {
      //   console.log(1 / l * i * 360);
      items[i].style.transform = `rotate(${1 / l * i * 360}deg)`;
      items[i].style.left =
        (
          50 -
          35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";

      items[i].style.top =
        (
          50 +
          35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)
        ).toFixed(4) + "%";
    }
  },
  methods: {}
};
</script>
 
<style lang="scss" >
$color: #17335d;
$ziColor: #d4236d;
.video-cloud {
    margin-top: 100px;
  a {
    font-size: 14px;
    text-decoration: none;
    outline: 0;
  }
  .base {
    height: 220px;
    position: relative;
    width: 220px;
  }
  .circle {
    @extend .base;
    margin: 10px auto 10px auto;

    .ring {
      @extend .base;
      background-color: $color;
      border-radius: 50%;
      -moz-box-shadow: 0px 0px 13px #333333;
      -webkit-box-shadow: 0px 0px 13px #333333;
      box-shadow: 0px 0px 13px #333333;
    }
  }

  .center {
    font-size: 30px;
    background-color: #1c293f;
    border-radius: 50%;
    border: 5px solid #ffffff;
    bottom: 0;
    border-color: #d4236d;
    // box-sizing: border-box;
    background: radial-gradient(80px circle, #19243a, #243352);
    // background-origin: padding-box, border-box;
    // background-image: linear-gradient(45deg, #5c5fa5, #893f60);
    // border-color: radial-gradient(200px circle, yellow, red);
    color: white;
    height: 80px;
    left: 0;
    line-height: 80px;
    margin: auto;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    width: 80px;
    -webkit-transition: all 0.4s ease-out;
    -moz-transition: all 0.4s ease-out;
    transition: all 0.4s ease-out;
  }
  .menuItem {
    border-radius: 50%;
    color: #fff;
    background: rgba(233, 233, 233, 0.15);
    display: block;
    height: 30px;
    line-height: 30px;
    margin-left: -15px;
    margin-top: -15px;
    position: absolute;
    text-align: center;
    width: 30px;
    .icon {
      font-size: 18px;
      transform: rotate(-90deg);
    }
    &:hover {
      cursor: pointer;
      color: $ziColor;
      background: rgba(233, 233, 233, 0.5);
    }
  }

  .video-tool {
    padding: 20px;
    margin: 10px auto 10px auto;
    .speed {
      color: $color;
      margin-top: 20px;
      display: flex;
      text-align: center;
      .speed-item1 {
        flex: 0.3;
      }
      .speed-item2 {
        flex: 1;
        .el-slider__runway {
          margin: 6px 0;
        }
        .el-slider__bar {
          background-color: $color;
        }
        .el-slider__button {
          border: 2px solid $color;
        }
        .speed-title {
          //   padding: 5px;
          display: block;
          //   float: left;
          //   display: flex;
          //   flex: 1;
          margin-left: 33%;
          text-align: center;
          width: 30px;
          font-size: 18px;
          color: #fff;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          background: $color;
          &:hover {
            cursor: pointer;
            color: $ziColor;
          }
        }
      }
      .speed-item3 {
        // text-align: left;
        flex: 0.2;
      }
    }
  }
}
</style>