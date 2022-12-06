(async function getUser() {
    const response = await axios.get('/getUser');
    $("#greeting").append(response.data || 'Guest');
})();
