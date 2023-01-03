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
  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    axios
      .post(
        "auth/login",
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
        window.localStorage.setItem("token", res.data.token);
        const claims = JSON.parse(
          atob(res.data.token.split(".")[1], "base64").toString()
        );
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            email: claims.sub,
            user_id: claims.user_id,
          })
        );
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
        "/auth/signup",
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


fetch('https://api.gifts.hotdeals.dev/rss')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
		const items = data.querySelectorAll("item");
		const rssFeed = document.getElementById('rss-feed');
  
    items.forEach(el => {
			const element = document.createElement('p');
			const cdataRegex = /<!\[CDATA\[(.*?)\]\]>/;
			const cdata = cdataRegex.exec(el.querySelector("title").innerHTML)[1];
			element.innerHTML = `A user just added ${cdata} to their wish list!`;
			rssFeed.appendChild(element);
    });
	})
