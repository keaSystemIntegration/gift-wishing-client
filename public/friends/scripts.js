// console.log('hell');
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";


(async function() {
    const socket = io("https://api.gifts.hotdeals.dev", {
    transports: ["polling"],
    auth: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzA3NjE3NjQuMDY2OTkzLCJleHAiOjE2NzEzNjY1NjUuMDY2OTkzLCJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIxODJlNTJhOTRhYWY0ZGZmODg3ZTdiOGU1NjA5NDcwZCJ9.MVGhDNGhPSQanuqh6y1EcLEnVnHIqPweSY86PEZTnPk",
    },
  });
  // console.log("Socket: ", socket);

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
          <div class="friend__item">
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

})();

