/**
 * 对象工具类，类中方法均为静态方法
 */
class ObjectUtils {
    /**
     * 判断参数是否为一个对象
     */
    static isObject(obj) {
        return toString.call(obj) === '[object Object]'
    }

    /**
     * obj_values(obj);
     * 获取对象中的所有的值，并返回数组
     * @param obj
     * @returns {Array}
     */
    static objValues(obj) {
        const objkey = Object.keys(obj);
        const objarr = [];
        objkey.forEach(key => {
            objarr.push(obj[key]);
        });
        return objarr;
    };

    /**
     * 判断对象是否相等
     * @param a
     * @param b
     * @returns {boolean}
     */
    static isObjectValueEqual(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    };
}

module.exports = ObjectUtils;