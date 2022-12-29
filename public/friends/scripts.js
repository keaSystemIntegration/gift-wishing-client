import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let socket = null;
const accessToken = window.localStorage.token;
const url = "https://api.gifts.hotdeals.dev";

(async function() {
    socket = io(url, {
    transports: ["polling"],
    auth: {
      token: accessToken
    },
  });

  const response = axios.get("/wishes", {
    headers: {
      authorization:
        `Bearer ${accessToken}`,
    },
  });
  const result = await response;
  // console.log(result.data);
  window.localStorage.setItem("wishes", JSON.stringify(result.data));
  // console.log(window.localStorage);
})();

socket.emit("status");

socket.on("statusUpdate", (data) => {
  const friends = data || [];
  // console.log(friends);
  if (friends.length > 0) {
    $('#friends__list').html(function() {
      return friends.map((friend, index) => {
        let status = null;
        switch(friend.status) {
          case 'online':
            status = 'online';
            break;
          case 'offline':
            status = 'offline';
          default:
            status = 'not-registered';
        }

        
        return `
        <div class="friend__item" id="${friend.email}">
          <span class="friend__item_status friend__item_status-${status}" title="${status}"></span>
          <span class="friend__item_index">${++index}.</span>
          <span class="friend__item_email">${friend.email}</span>
        </div>
        `});
    });
  } else {
    $('#friends--list').append(`
      <div class="friends--list-empty">No friends yet</div>
    `);
  }
});

socket.on("refresh", () => {
  socket.emit("status");
});