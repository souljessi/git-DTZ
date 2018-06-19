/**
 * 数组工具类，类中方法均为静态方法
 */
class ArrayUtils {
    /**
     * 将数组拆分成N个数组
     * @param arr Array 原数组
     * @param len number 拆分的每个数组包含多少个元素
     * @returns {Array}
     */
    static splitArray(arr, len) {
        var a_len = arr.length;
        var result = [];
        for (var i = 0; i < a_len; i += len) {
            result.push(arr.slice(i, i + len));
        }
        return result;
    }

    /**
     * 比较两个数组是否完全相同
     * @param a1
     * @param a2
     * @returns {boolean}
     */
    static a2a(a1, a2) {
        if (!(think.isArray(a1) && think.isArray(a2))) {
            return false;
        }
        if (a1.length != a2.length) {
            return false;
        }

        a1.sort();
        a2.sort();
        for (var i = 0; i < a1.length; i++) {
            if (typeof a1[i] !== typeof a2[i]) {
                return false;
            }
            if (think.isObject(a1[i]) && think.isObject(a2[i])) {
                var retVal = o2o(a1[i], a2[i]);
                if (!retVal) {
                    return false;
                }
            } else if (think.isArray(a1[i]) && think.isArray(a2[i])) { // recursion
                if (!a2a(a1[i], a2[i])) {
                    return false;
                }
            } else if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * 数组去重
     * @param arr
     * @returns {any[]}
     */
    static unique(arr) {
        return Array.from(new Set(arr));
    }

    /**
     * 比较两个数组，去重后，返回不相同的部分
     * @param arr1
     * @param arr2
     * @returns {Array}
     */
    static array_diff(arr1, arr2) {
        // var arr1 = ["i", "b", "c", "d", "e", "f","x",""]; //数组A
        // var arr2 = ["a", "b", "c", "d", "e", "f", "g"];//数组B
        var temp = []; // 临时数组1
        var temparray = [];// 临时数组2
        for (var i = 0; i < arr2.length; i++) {
            temp[arr2[i]] = true;// 巧妙地方：把数组B的值当成临时数组1的键并赋值为真
        }
        for (var i = 0; i < arr1.length; i++) {
            if (!temp[arr1[i]]) {
                temparray.push(arr1[i]);// 巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
            }
        }
        ;
        return temparray;
    };

    /**
     * 找出数组中最大值
     * @param arr
     * @returns {number}
     */
    static findArrayMax(arr) {
        return Math.max.apply(null, arr);

    }

    /**
     * 找出数组中最小值
     * @param arr
     * @returns {number}
     */
    static findArrayMin(arr) {
        return Math.min.apply(null, arr);
    }

    /**
     *找出两个数组的交集
     */
    static intersection(arr1, arr2) {
        return arr1.filter(v => arr2.includes(v));
    }

    /**
     * 找出两个数组的差集
     */
    static difference(arr1, arr2) {
        return arr1.concat(arr2).filter(v => !arr1.includes(v) || !arr2.includes(v));
    }

    /**
     *　找出两个数组的并集
     */
    static unionSet(arr1, arr2) {
        return Array.from(new Set([...arr1, ...arr2]));
    }


}

module.exports = ArrayUtils;
