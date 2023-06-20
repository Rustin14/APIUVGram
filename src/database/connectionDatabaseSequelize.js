const { Sequelize } = require('sequelize');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT,
    TEST_DB_USER, TEST_DB_HOST, TEST_DB_DATABASE, TEST_DB_PASSWORD, TEST_DB_PORT,
    NODE_ENV } = process.env;

const createSequelizeClient = () => {
    if (NODE_ENV == "TEST") {
        return new Sequelize(TEST_DB_DATABASE, TEST_DB_USER, TEST_DB_PASSWORD, {
            host: TEST_DB_HOST,
            port: TEST_DB_PORT,
            dialect: 'postgres',
            logging: false
        })
    }
    return new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
        logging: false
    });
};

const sequelize = createSequelizeClient();

module.exports = { sequelize };