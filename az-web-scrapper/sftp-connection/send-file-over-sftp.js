const SftpClient = require('ssh2-sftp-client');
const sftpConnection = require('./sftp-connection.js')

function uploadFile (){
    const sftp = new SftpClient()
    sftp.connect(sftpConnection).then(() => {
            sftp.put("D:/home/products.db", "upload/products.db")
        }
    )
}
module.exports = {uploadFile};


