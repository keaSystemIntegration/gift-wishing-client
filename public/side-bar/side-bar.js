(async function axiosConfig() {
  axios.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem("token");
      const user = window.localStorage.getItem("user");
      if (user) {
        $("#greeting").text(JSON.parse(user).email || "Guest");
      }

      if (token) {
        console.log("INTERCEPTOR TOKEN", token);
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log("You need to log in");
        window.location.assign("/login");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
})();

function logout() {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.location.reload();
}

$("button.option").click(function () {
  var link = $(this).attr("data-id");

  if (!$(this).hasClass("active")) {
    $(".content").empty();
    $(".content").load(`/${link}`);
  }

  $("#navigation-bar")
    .find("button.option")
    .each(function () {
      if ($(this).attr("data-id") == link) {
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }
    });
});

(async function () {
	const user = window.localStorage.getItem("user");
	if (user) {
		const userId = JSON.parse(user).user_id;
		const route = "/pictures";
		const append = "/"+userId;
		const queryUrl = route+append;
		console.log("queryUrl: ", queryUrl);
		try {
			const response = await axios.get(queryUrl);
			const src = response.data.url;
			console.log("We got a response : ", src);
			document.getElementById("profile-picture-id").src = src;
		} catch (err) {
			console.error("Error in sidebar: ", err);
		}
	}
})();

const setProfilePicture = (userId) => {
	const rootUrl = "https://api.gifts.hotdeals.dev";
	const route = "/pictures";
	const append = "/"+userId;
	const queryUrl = route+append;
	console.log("queryUrl: ", queryUrl);
	axios.get(queryUrl)
		.then((response) => {
			const src = response.data.url;
			console.log("We got a response : ", src);
			document.getElementById("profile-picture-id").src = src;
		})
		.catch((error) => {
			console.log(error);
		});
}

