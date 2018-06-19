const TcpSocket = require('./TcpSocket');
const ts = new TcpSocket(think.config('video'));
import Coordtransform from '../../utils/Coordtransform';
// const nameSpace = think.config('nameSpace');
ts.on('catalogs', (data) => {
    const list = data.list;
    for (let value of list) {
        let lat = value.Lat;
        let lng = value.Lng;
        let type = value.type;
        if (Number(type) !== 2 && lat !== 0) {
            const points = Coordtransform.wgs84tobd09(lng, lat);
            value.Lng = points[0];
            value.Lat = points[1];
        }
    }
    think.Redis.hset('video:data', 'catalog', JSON.stringify(data));
});
export default ts;