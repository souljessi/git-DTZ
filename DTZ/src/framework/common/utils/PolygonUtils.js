export default (polygon = {
  /**
   * 判断点是否存在多边形内
   *
   * @param {Object} point 点坐标 格式{ lng: 116.4, lat: 39.914 };
   * @param {Array} polygon 多边形数组  格式 [{ lng: 116.395, lat: 39.91 },....]
   * @returns
   */

  isPointInPolygon: (point, polygon) => {
 
    // //检查类型
    // if (!(point instanceof BMap.Point) || !(polygon instanceof BMap.Polygon)) {
    //   return false;
    // }

    //首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
    // var polygonBounds = polygon.getBounds();
    // if (!this.isPointInRect(point, polygonBounds)) {
    //   return false;
    // }

    // var pts = polygon.getPath(); //获取多边形点
    const equals = (x, y) => {
      if (x === y) {
        return true;
      }
      if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
      }

      if (x.constructor !== y.constructor) {
        return false;
      }

      for (var p in x) {
        if (x.hasOwnProperty(p)) {
          if (!y.hasOwnProperty(p)) {
            return false;
          }

          if (x[p] === y[p]) {
            continue;
          }

          if (typeof x[p] !== "object") {
            return false;
          }

          if (!Object.equals(x[p], y[p])) {
            return false;
          }
        }
      }

      for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
          return false;
        }
      }
      return true;
    };
    var pts = polygon; //获取多边形点

    //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
    //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
    //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

    var N = pts.length;
    var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    var intersectCount = 0; //cross points count of x
    var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
    var p1, p2; //neighbour bound vertices
    var p = point; //测试点

    p1 = pts[0]; //left vertex
    for (var i = 1; i <= N; ++i) {
      //check all rays
      if (equals(p, p1)) {
        return boundOrVertex; //p is an vertex
      }

      p2 = pts[i % N]; //right vertex
      if (
        p.lat < Math.min(p1.lat, p2.lat) ||
        p.lat > Math.max(p1.lat, p2.lat)
      ) {
        //ray is outside of our interests
        p1 = p2;
        continue; //next ray left point
      }
      if (
        p.lat > Math.min(p1.lat, p2.lat) &&
        p.lat < Math.max(p1.lat, p2.lat)
      ) {
        console.log(111111);
        //ray is crossing over by the algorithm (common part of)
        if (p.lng <= Math.max(p1.lng, p2.lng)) {
          console.log(1111);
          //x is before of ray
          if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {
            //overlies on a horizontal ray
            return boundOrVertex;
          }

          if (p1.lng == p2.lng) {
            //ray is vertical
            if (p1.lng == p.lng) {
              //overlies on a vertical ray
              return boundOrVertex;
            } else {
              //before ray
              ++intersectCount;
            }
          } else {
            //cross point on the left side
            var xinters =
              (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng; //cross point of lng
            if (Math.abs(p.lng - xinters) < precision) {
              //overlies on a ray
              return boundOrVertex;
            }

            if (p.lng < xinters) {
              //before ray

              ++intersectCount;
            }
          }
        }
      } else {
        //special case when ray is crossing through the vertex
        if (p.lat == p2.lat && p.lng <= p2.lng) {
          //p crossing over p2
          var p3 = pts[(i + 1) % N]; //next vertex
          if (
            p.lat >= Math.min(p1.lat, p3.lat) &&
            p.lat <= Math.max(p1.lat, p3.lat)
          ) {
            //p.lat lies between p1.lat & p3.lat
            ++intersectCount;
          } else {
            intersectCount += 2;
          }
        }
      }
      p1 = p2; //next ray left point
    }
    console.log("intersectCount:", intersectCount);
    if (intersectCount % 2 == 0) {
      //偶数在多边形外
      return false;
    } else {
      //奇数在多边形内
      return true;
    }
  }
});

// // 列子
// let polygon = [
//   { lng: 103.669598, lat: 25.034911 },
//   { lng: 103.673272, lat: 25.035427 },
//   { lng: 103.676704, lat: 25.035942 },
//   { lng: 103.675823, lat: 25.041336 },
//   { lng: 103.675204, lat: 25.042097 },
//   { lng: 103.673236, lat: 25.042326 },
//   { lng: 103.673021, lat: 25.042351 },
//   { lng: 103.673155, lat: 25.042555 },
//   { lng: 103.670901, lat: 25.044037 },
//   { lng: 103.671035, lat: 25.042056 },
//   { lng: 103.669571, lat: 25.04488 },
//   { lng: 103.66932, lat: 25.045371 },
//   { lng: 103.669338, lat: 25.046385 },
//   { lng: 103.668906, lat: 25.047269 },
//   { lng: 103.667757, lat: 25.047711 },
//   { lng: 103.668305, lat: 25.044004 },
//   { lng: 103.668583, lat: 25.042154 },
//   { lng: 103.668718, lat: 25.041221 },
//   { lng: 103.668835, lat: 25.04028 },
//   { lng: 103.669212, lat: 25.037506 }
// ];
// let point = { lng: 103.673633, lat: 25.036382 };
// let type = isPointInPolygon(point, polygon);
// console.log("是否在多边形内:", type);
