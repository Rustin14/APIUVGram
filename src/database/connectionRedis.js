const redis = require('redis');
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER,
    TEST_REDIS_HOST, TEST_REDIS_PASSWORD, TEST_REDIS_PORT, TEST_REDIS_USER, NODE_ENV } = process.env;

let REDIS_PORT_CONNECTED_TO = 0;

const createRedisClient = () => {
    if (NODE_ENV == "TEST") {
        REDIS_PORT_CONNECTED_TO = TEST_REDIS_PORT;
        return redis.createClient({
            socket: {
                host: TEST_REDIS_HOST,
                port: TEST_REDIS_PORT
            },
            username: TEST_REDIS_USER,
            password: TEST_REDIS_PASSWORD
        });
    }
    REDIS_PORT_CONNECTED_TO = REDIS_PORT;
    return redis.createClient({
        socket: {
            host: REDIS_HOST,
            port: REDIS_PORT
        },
        username: REDIS_USER,
        password: REDIS_PASSWORD
    });
}

const redisClient = createRedisClient();

module.exports = { redisClient, REDIS_PORT_CONNECTED_TO }