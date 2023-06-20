const axios = require('axios');
const { app, connetionToServers } = require("./app");
const { sequelize } = require("./database/connectionDatabaseSequelize");
const { redisClient } = require("./database/connectionRedis");
const { fileServerClient } = require('./database/connetionFtpServer');
const { logger } = require("./helpers/logger");

const server = app.listen({
    port: app.get("port"),
    host: app.get("host")
}, async () => {
    if (process.env.NODE_ENV == "TEST") {
        logger.info("************** starting TEST environment **************");
        logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
    } else {
        logger.info("************** starting PROD environment **************");
        await connetionToServers();
        logger.info(`NodeJS Express Server initialized on port ${app.get("port")}`);
        logger.info("*******************************************************");
    }
});

async function delayServerConnections() {
    await connetionToServers();
    logger.info("************** ************** **************");
};

const clearDatabase = async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await sequelize.query("ALTER SEQUENCE user_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE educationalprogram_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE faculty_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE region_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE comment_id_seq RESTART WITH 1");
    await sequelize.query("ALTER SEQUENCE post_id_seq RESTART WITH 1");
    await redisClient.flushAll("ASYNC");
    await fileServerClient.removeDir("/");
    await clearMessagesMailHog();
}

const clearMessagesMailHog = async () => {
    await axios.delete(`http://${process.env.TEST_NODEMAILER_HOST}:${process.env.TEST_NODEMAILER_PORT_APIV2}/api/v1/messages`);
}

module.exports = { server, delayServerConnections, clearMessagesMailHog, clearDatabase }