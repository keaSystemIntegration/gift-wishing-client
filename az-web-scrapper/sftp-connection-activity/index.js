const uploadFile = require("../sftp-connection/send-file-over-sftp.js").uploadFile;

module.exports = async function (context) {
    uploadFile();
    return true;
};