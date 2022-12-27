import { uploadFile } from "../sftp-connection/send-file-over-sftp.js";
export default async function (context) {
    uploadFile();
    return true;
};