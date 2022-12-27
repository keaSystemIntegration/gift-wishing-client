$(".input-field").focusout(function () {
  if ($(this).val() != "") {
    $(this).addClass("has-content");
  } else {
    $(this).removeClass("has-content");
  }
});

$("label").on("click", function () {
  $(this).prev().focus();
});

let loginForm = $("#login-form");
let registerForm = $("#register-form");
let toggle = $("#btn");

let loginButton = $(".toggle-btn.login");
let registerButton = $(".toggle-btn.register");

function register() {
  loginForm.css("left", "-450px");
  registerForm.css("left", "0");
  toggle.css({
    left: "110px",
    background: "linear-gradient(to right, #ffcb5b, #fcb243)",
  });
  loginButton.css("color", "white");
  registerButton.css("color", "black");
}

function login() {
  loginForm.css("left", "0");
  registerForm.css("left", "450px");
  toggle.css({
    left: "0",
    background: "linear-gradient(to right, #fcb243, #ffcb5b)",
  });
  loginButton.css("color", "black");
  registerButton.css("color", "white");
}

$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD7-tfxQ9oJ1NDjdQ1VbQINGQp9BKq_AuY",
    authDomain: "your-passwords-9900c.firebaseapp.com",
    databaseURL:
      "https://your-passwords-9900c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "your-passwords-9900c",
    storageBucket: "your-passwords-9900c.appspot.com",
    messagingSenderId: "629253822029",
    appId: "1:629253822029:web:e30825465d68baeec5ae04",
  };

  firebase.initializeApp(firebaseConfig);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    axios
      .post(
        "https://api.gifts.hotdeals.dev/auth/login",
        { email, password },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data.token);
        window.location.assign("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  $("#register-form").on("submit", function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;

    axios
      .post(
        "https://api.gifts.hotdeals.dev/auth/signup",
        { email, password, name },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        login();
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
