/**
 * 字符串工具类，类中方法均为静态方法
 */
class StringUtils {
    /**
     * 匹配某个字符到字符串末尾
     */
    static findStrToEnd(str) {
        return str.substr(str.indexOf('.'))
    }
}

module.exports = StringUtils;