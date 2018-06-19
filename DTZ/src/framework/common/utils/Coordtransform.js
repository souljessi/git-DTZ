// const  cdf=require('coordtransform');
import cdf from 'coordtransform';

/**
 * 坐标转换工具类
 * 国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
 */
class Coordtransform {
    /**
     * 百度经纬度坐标转国测局坐标
     */
    static bd09togcj02(lng, lat) {
        return cdf.bd09togcj02(lng, lat);
    }

    /**
     * 国测局坐标转百度经纬度坐标
     */
    static gcj02tobd09(lng, lat) {
        return cdf.gcj02tobd09(lng, lat);
    }

    /**
     * wgs84转国测局坐标
     */
    static wgs84togcj02(lng, lat) {
        return cdf.wgs84togcj02(lng, lat);
    }

    /**
     * 国测局坐标转wgs84坐标
     */
    static gcj02towgs84(lng, lat) {
        return cdf.gcj02towgs84(lng, lat);
    }

    /**
     * 百度转wgs84
     */
    static bd09towgs84(lng, lat) {
        let mid = cdf.bd09togcj02(lng, lat);
        return cdf.gcj02towgs84(mid[0], mid[1]);
    }

    /**
     * wgs84转百度
     */
    static wgs84tobd09(lng, lat) {
        let mid = cdf.wgs84togcj02(lng, lat);
        return cdf.gcj02tobd09(mid[0], mid[1]);
    }

}

export default Coordtransform;
