const dotenv = require('dotenv');
const firebase = require('firebase');
const axios = require('axios');

dotenv.config();

const {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
} = process.env;

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
}

const fireDb = firebase.initializeApp(firebaseConfig);

fireDb.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

function signIn(email, password) {
    fireDb
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
        return user.getIdToken().then((idToken) => {
            return axios.post("/sessionLogin", idToken, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                }
            });
        });
    })
    .then(() => {
      return firebase.auth().signOut();
    })
    .then(() => {
      window.location.assign("/");
    });
}

function signUp(email, password) {
    fireDb
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
    return user.getIdToken().then((idToken) => {
        return axios.post("/sessionLogin", idToken, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            }
            });
        });
    })
    .then(() => {
    return firebase.auth().signOut();
    })
    .then(() => {
    window.location.assign("/");
    });
}

// signIn('john2@gmail.com', 'pass1234');


module.exports = {
    fireDb,
    signIn,
    signUp
}
