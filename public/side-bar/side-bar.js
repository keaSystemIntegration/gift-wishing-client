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

// const response = await axios.get('/getUser');
// $("#greeting").append(response.data || 'Guest');
