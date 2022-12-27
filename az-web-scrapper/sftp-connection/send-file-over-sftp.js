import SftpClient from 'ssh2-sftp-client'
import { sftpConnection } from './sftp-connection.js'


export function uploadFile (){
    const sftp = new SftpClient()
    sftp.connect(sftpConnection).then(() => {
            sftp.put("products.db", "upload/products.db")
        }
    )
}

