require('dotenv').config(); //loads environment variables from a .env file into process.env
const mysql = require("mysql");
let instance = null;


const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getUsers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAccounts(user) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM accounts WHERE user_id='" + user + "'";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAccount(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM accounts WHERE id=" + id;

                connection.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;

        } catch (error) {
            console.log(error);
        }
    }


    async createAccount(newAccount) {
        try {
            const date = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO accounts (user_id, name, username, " 
                    + "password_iv, password_content, details, last_updated, logo_upload, logo_url) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                connection.query(query, [newAccount.user_id, newAccount.name, newAccount.username, 
                    newAccount.password_iv, newAccount.password_content, newAccount.details, date, 
                    newAccount.logo_upload, newAccount.logo_url] , (error, result) => {
                    if(error) reject (new Error(error.message));
                    resolve(result.insertId); // insertId is keyword for the last inserted ID
                });
            });
            // console.log("responseId:" + insertId);
            return insertId; 
        } catch (error) {
            console.log(error);
        }
    }

    async createUser(newUser) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (uid, username, email) "
                    + "VALUES (?, ?, ?)";

                connection.query(query, [newUser.uid, newUser.username, newUser.email], (error, result) => {
                    if(error) reject (new Error(error.message));
                    resolve(result); 
                });
            });
            return response; 
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAccount(id) {
        let account_id = Number(id);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM accounts WHERE accounts.id = ?";

                connection.query(query, account_id, (error, result) => {
                    if(error) reject (new Error(error.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async updateAccount(updatedAccount) {
        try {
            if (updatedAccount.isPasswordChanged) {

                const response = await new Promise((resolve, reject) => {
                    const query = "UPDATE accounts SET " +
                        "name = ?, username = ?, password_iv = ?, password_content = ?, details = ?," +
                        "last_updated = ?, logo_upload = ?, logo_url = ? " +
                        "WHERE accounts.id = ?";
    
                    connection.query(query, [updatedAccount.name, updatedAccount.username, updatedAccount.password_iv, 
                        updatedAccount.password_content, updatedAccount.details, updatedAccount.last_updated, 
                        updatedAccount.logo_upload, updatedAccount.logo_url, updatedAccount.id], (error, result) => {
                        if(error) reject (new Error(error.message));
                        resolve(result);
                    });
                });
                return response;

            } else {
                const response = await new Promise((resolve, reject) => {
                    const query = "UPDATE accounts SET " +
                     "name = ?, username = ?, details = ?, last_updated = ?, " +
                     "logo_upload = ?, logo_url = ? " +
                     "WHERE accounts.id = ?";
    
                    connection.query(query, [updatedAccount.name, updatedAccount.username, 
                    updatedAccount.details, updatedAccount.last_updated, updatedAccount.logo_upload, 
                    updatedAccount.logo_url, updatedAccount.id], (error, result) => {
                        if(error) reject (new Error(error.message));
                        resolve(result);
                    });
                });
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    }


}

module.exports = DbService;