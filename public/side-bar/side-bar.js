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

  $(".content").load(`/${link}`);

  $("#navigation-bar")
    .find("button.option")
    .each(function () {
      $(this).addClass("active");
      if ($(this).attr("data-id") == link) {
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }
    });
});
