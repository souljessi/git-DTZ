import Redis from 'think-redis';

class RedisInit {
    constructor(options) {
        this.options = options || think.config('redisConfig');

        this.redis = new Redis(this.options).redis;


        this.redis.on('error', (err) => {
            think.logger.error(err);
            this.connect = false;
        });
        this.redis.on('connect', () => {
            think.logger.info('redis is connect');
        });
        this.redis.on('reconnecting', () => {
            think.logger.warn('redis is reconnecting');
        });
        return this.redis;
        // return new Redis(this.options).redis;


    }

    // constructor(options) {
    //     this.options = options || think.config('redisConfig');
    //     return new redis(this.options).redis;
    //
    // }

    // isReady() {
    //     if (this.redis.status === 'ready') {
    //         return true;
    //     }
    //     return false;
    // }


}

export default RedisInit
