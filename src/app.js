const express = require('express');
const http = require('http');
const app = express();

let server = http.createServer(app);
const io = require('socket.io')(server);
const cookie = require("cookie");

const dbService = require('./database');
const admin = require('firebase-admin');
const fs = require("fs");

const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require('./crypto');

// Firebase Admin
// const serviceAccountKey = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDS)),
    databaseURL: "https://your-passwords-9900c-default-rtdb.europe-west1.firebasedatabase.app"
});

// CSRF Protection 
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfMiddleware = csrf({ cookie: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(csrfMiddleware);

const header = fs.readFileSync(__dirname + "/public/header/header.html", "utf-8");
const sideBar = fs.readFileSync(__dirname + "/public/side-bar/side-bar.html", "utf-8");
const mainPage = fs.readFileSync(__dirname + "/public/main-page/main-page.html", "utf-8");
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html", "utf-8");
const create = fs.readFileSync(__dirname + "/public/create-modal/create-modal.html", "utf-8");
const deleteAccount = fs.readFileSync(__dirname + "/public/delete-modal/delete-modal.html", "utf-8");
const edit = fs.readFileSync(__dirname + "/public/edit-modal/edit-modal.html", "utf-8");
const notification = fs.readFileSync(__dirname + "/public/notification-modal/notification-modal.html", "utf-8");
const login = fs.readFileSync(__dirname + "/public/login/login.html", "utf-8");
const liveChat = fs.readFileSync(__dirname + "/public/live-chat/live-chat.html", "utf-8");

// Prerequisite for every http request (cookie setup to prevent CSRF)
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

// Authentication
app.post('/login', (req, res) => {
    const idToken = req.body.token.toString();

    // 1 hour
    const expiresIn = 60 * 60 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
            // const options = { maxAge: expiresIn, httpOnly: true }; // with expiration time
            const options = { httpOnly: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        );
});

app.post('/register', checkCookieMiddleware, (req, res) => {    // This happens right when you're logged in, post registration
    const uid = req.decodedClaims.uid;
    const email = req.decodedClaims.email;
    const username = req.decodedClaims.name;

    const newUser = {
        uid: uid,
        username: username,
        email: email
    };

    const db = dbService.getDbServiceInstance();

    // Purpose is to link firebase users to the users in the mysql db (they'll both share a uid)
    const result = db.createUser(newUser);
    
    result
        .then(res => console.log(res))
        .catch(err => {
            console.log(err);
        });
    
})

app.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/login');
});

// Authorization
function checkCookieMiddleware(req, res, next) {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((decodedClaims) => {
            req.decodedClaims = decodedClaims;
            // console.log(decodedClaims.name);
            // Our request
           next();
        })
        .catch((error) => {
            res.redirect('/login');
            console.log("Unauthorized Request!");
        });
}

// UI Calls
app.get('/', checkCookieMiddleware, (req, res) => {
    res.send(header + sideBar + mainPage + create + deleteAccount + edit + notification +  liveChat  + footer);
}); 

app.get('/login', (req, res) => {
    res.send(header + login + footer);
});

// API Calls
app.get('/getUser', checkCookieMiddleware, (req, res) => {
    res.send(req.decodedClaims.name);
});

app.get('/getUsers', checkCookieMiddleware, (req, res) => {
    const db = dbService.getDbServiceInstance();
    
    const result = db.getUsers();
    result.then(data => {
        res.json({users: data});
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/account/:id', checkCookieMiddleware, (req, res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAccount(req.params.id);
    result.then(data => {
        data = data.map(account => {
            const encryptedPasword = {
                iv: account.password_iv,
                content: account.password_content
            };
            const decryptedPassword = decrypt(encryptedPasword);

            return {
                id: account.id,
                user_id: account.user_id,
                name: account.name,
                username: account.username,
                password: decryptedPassword,
                details: account.details,
                last_updated: account.last_updated,
                logo_upload: account.logo_upload,
                logo_url: account.logo_url
            };
        });
        res.send({account: data});
    })
    .catch(err => {
        console.log(err);
    });;
});

app.get('/accounts', checkCookieMiddleware, (req, res) => {
    const db = dbService.getDbServiceInstance();
    const user = req.decodedClaims.uid; 
    const response = db.getAccounts(user);
    response.then(data => {

        data = data.map(account => {
            const encryptedPasword = {
                iv: account.password_iv,
                content: account.password_content
            };
            const decryptedPassword = decrypt(encryptedPasword);

            return {
                id: account.id,
                user_id: account.user_id,
                name: account.name,
                username: account.username,
                password: decryptedPassword,
                details: account.details,
                last_updated: account.last_updated,
                logo_upload: account.logo_upload,
                logo_url: account.logo_url
            };
        });
        res.send({accounts: data});
    })
    .catch(err => {
        console.log(err);
    });;
});

//create account
app.post('/account', checkCookieMiddleware, async (req, res) => {
    const cryptedPassword = encrypt(req.body.password);
    // console.log(decrypt(cryptoPassword));

    const newAccount = {
        user_id: req.decodedClaims.uid,
        name: req.body.name,
        username: req.body.username,
        password_iv: cryptedPassword.iv,
        password_content: cryptedPassword.content,
        details: req.body.details || '',
        logo_upload: '',
        logo_url: req.body.logo_url,
    };

    const db = dbService.getDbServiceInstance();

    const result = db.createAccount(newAccount);
    
    result.then(id => {
        res.send({id}); 
    })
    .catch(err => {
        console.log(err);
    });
});


app.patch('/account',  checkCookieMiddleware, (req, res) => {
    let encryptedPassword = '';
    if (req.body.isPasswordChanged) {
        encryptedPassword = encrypt(req.body.password)
    }
    
    const updatedAccount = {
        id: req.body.id,
        user_id: 1,
        name: req.body.name,
        username: req.body.username,
        password_iv: encryptedPassword.iv,
        password_content: encryptedPassword.content,
        details: req.body.details || '',
        logo_upload: '',
        logo_url: req.body.logo_url,
        last_updated: req.body.last_updated,
        isPasswordChanged: req.body.isPasswordChanged
    };

    const db = dbService.getDbServiceInstance();

    const result = db.updateAccount(updatedAccount);
    result.then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err);
    });

});

//delete account
app.delete('/account/:id', checkCookieMiddleware, (req, res) => {
    const id = req.params.id;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteAccount(id);
    result.then(data => {
        res.json({data});
    });
}); 


//live chat

io.on('connection', socket => {
    const cookies = socket.handshake.headers.cookie; 
    const sessionCookie = cookie.parse(cookies).session;
    let username = '';

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((decodedClaims) => {
            username = decodedClaims.name;
        })
        .catch((error) => {
            // res.redirect('/login');
            console.log("Unauthorized Request!");
        })

    socket.on('sendMessage', msg =>  {
        socket.broadcast.emit('sendToAll', {msg, username});
    });

    socket.on("disconnect", () => {
        // console.log("socket disconnected")
    });
});



server.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("App listening on localhost :", process.env.PORT);
});
