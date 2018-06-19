import webDev from '@/webconfig.dev';
import webProd from '@/webconfig.prod';
let webconfig = process.env.NODE_ENV === 'production' ? webProd : webDev
export default webconfig
