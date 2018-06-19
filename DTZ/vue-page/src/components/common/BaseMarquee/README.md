# Marquee基础组件API

## 导入

``` js
import BaseMarquee from "common/BaseMarquee/BaseMarquee.vue";
import BaseMarqueeItem from "common/BaseMarquee/BaseMarqueeItem.vue";

...
  components: {
    BaseMarquee,
    BaseMarqueeItem
  }
  ...
```

## 使用

``` html
 <base-marquee>
      <base-marquee-item v-for="(item,index) in list" :key="index">
        {{item}}
      </base-marquee-item>
    </base-marquee>
```

## 属性

### marquee

* props:

| 属性        | 描述           | 类型  | 默认值  |
| ------------- |:-------------:|:-----:| -------:|
| interval      | 切换时间间隙 | Number |   2000  |
| duration      | 切换动画时间      |   Number | 300  |
| direction | 切换方向，可选['up', 'down']      |   String | 'up' |
| item-height      | 条目高度，当默认状态为隐藏时你需要设置值，否则组件渲染时会获取不到正确高度      |   Number | ' '  |

* slots:

```js
default:
      zh-CN: 内容插槽

```

### marquee-item

* slots:

```js
default:
      zh-CN: 内容插槽

```
