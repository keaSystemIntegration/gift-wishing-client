(async function axiosConfig() {
  axios.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem("token");

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

// const response = await axios.get('/getUser');
// $("#greeting").append(response.data || 'Guest');
