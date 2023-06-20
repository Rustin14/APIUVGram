const nodemailer = require('nodemailer');
const { NODE_ENV, NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS,
    TEST_NODEMAILER_HOST, TEST_NODEMAILER_PORT, TEST_NODEMAILER_USER, TEST_NODEMAILER_PASS
} = process.env;

const createClient = () => {
    if (NODE_ENV == "TEST") {
        return nodemailer.createTransport({
            host: TEST_NODEMAILER_HOST,
            port: TEST_NODEMAILER_PORT,
            auth: {
                user: TEST_NODEMAILER_USER,
                pass: TEST_NODEMAILER_PASS,
            },
        });
    } else {
        return nodemailer.createTransport({
            host: NODEMAILER_HOST,
            port: NODEMAILER_PORT,
            auth: {
                user: NODEMAILER_USER,
                pass: NODEMAILER_PASS,
            },
        });
    }
}

const mailer = createClient();

module.exports = { mailer }