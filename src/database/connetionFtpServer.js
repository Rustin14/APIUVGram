const ftp = require("basic-ftp");
const { NODE_ENV, FTP_CLIENT_HOST, FTP_CLIENT_USER, FTP_CLIENT_PASSWORD, FTP_CLIENT_PORT,
    TEST_FTP_CLIENT_HOST, TEST_FTP_CLIENT_USER, TEST_FTP_CLIENT_PASSWORD, TEST_FTP_CLIENT_PORT
} = process.env;

let FTP_PORT_CONNECTION = (NODE_ENV == "TEST") ? TEST_FTP_CLIENT_PORT : FTP_CLIENT_PORT;

const fileServerClient = new ftp.Client();


const connectToFtpServer = async () => {
    if (NODE_ENV === "TEST") {
        fileServerClient.ftp.verbose = false;
        FTP_PORT_CONNECTION = TEST_FTP_CLIENT_PORT;
        await fileServerClient.access({
            host: TEST_FTP_CLIENT_HOST,
            user: TEST_FTP_CLIENT_USER,
            password: TEST_FTP_CLIENT_PASSWORD,
            port: TEST_FTP_CLIENT_PORT,
            secure: false
        });
    } else {
        fileServerClient.ftp.verbose = false
        FTP_PORT_CONNECTION = FTP_CLIENT_PORT;
        await fileServerClient.access({
            host: FTP_CLIENT_HOST,
            user: FTP_CLIENT_USER,
            password: FTP_CLIENT_PASSWORD,
            port: FTP_CLIENT_PORT,
            secure: false
        });
        return fileServerClient;
    }
}

module.exports = { connectToFtpServer, FTP_PORT_CONNECTION, fileServerClient }