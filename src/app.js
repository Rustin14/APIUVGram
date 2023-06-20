require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const { redisClient, REDIS_PORT_CONNECTED_TO } = require("./database/connectionRedis");
const { sequelize } = require("./database/connectionDatabaseSequelize");
const { mailer } = require("./database/connetionEmail");
const { handleJSON } = require("./middleware/jsonValidation");
const { connectToFtpServer, FTP_PORT_CONNECTION } = require("./database/connetionFtpServer");
const fileUpload = require("express-fileupload");

app.set("port", process.env.SV_PORT);
app.set("host", process.env.SV_HOST);
// middlewares
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.disable("etag");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(handleJSON);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));

// routers
app.use(require("./routers/userAccount"));
app.use(require("./routers/authentication"));
app.use(require("./routers/user"));
app.use(require("./routers/data"));
app.use(require("./routers/urlVerification"));
app.use(require("./routers/post"));
app.use(require("./routers/comment"));
app.use(require("./routers/resource"));

const connetionToServers = async () => {
    await sequelize.authenticate().then(async () => {
        await sequelize.sync({ force: false });
        logger.info(`PostgreSQL Client initialized on port ${sequelize.config.port}`)
    }).then(async () => {
        await redisClient.connect().then(() => {
            logger.info(`Redis Client initialized on port ${REDIS_PORT_CONNECTED_TO}`);
        });
    }).then(async () => {
        await mailer.verify().then(() => {
            logger.info(`Nodemailer initialized on port ${mailer.options.port}`);
        });
    }).then(async () => {
        await connectToFtpServer().then(() => {
            logger.info(`FTPClient initialized on port ${FTP_PORT_CONNECTION}`);
        });
    }).catch(error => {
        logger.fatal(error);
    });
}

module.exports = { app, connetionToServers };