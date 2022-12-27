import dotenv from 'dotenv'

dotenv.config()

const { SFTP_HOST, SFTP_USER, SFTP_PASSWORD } =
    process.env

export const sftpConnection = {
    host: SFTP_HOST,
    port: 3000,
    username: SFTP_USER,
    password: SFTP_PASSWORD,
}