/**
 * Created by Jessi on 2018/5/11.
 */
/**
 * Debounce class
 * 运行耗时的操作。 该操作可以同时被调用几次，
 * 但在通过这个类调用，它只会在结束之前运行一次。
 */
class Debounce {
    constructor() {
        this.queues = {};
    }

    /**
     * debounce
     * @param {String} key
     * @param {Function} fn
     */
    debounce(key, fn) {
        if (!(key in this.queues)) {
            this.queues[key] = [];
            return Promise.resolve(fn()).then(data => {
                process.nextTick(() => {
                    this.queues[key].forEach(deferred => deferred.resolve(data));
                    delete this.queues[key];
                });
                return data;
            }).catch(err => {
                process.nextTick(() => {
                    this.queues[key].forEach(deferred => deferred.reject(err));
                    delete this.queues[key];
                });
                return Promise.reject(err);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.queues[key].push({
                    resolve,
                    reject
                });
            });
        }
    }
}

module.exports = Debounce;