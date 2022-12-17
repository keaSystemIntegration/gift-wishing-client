// console.log('hell');
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let socket = null;
let socket2 = null;

(async function() {
    socket = io("https://api.gifts.hotdeals.dev", {
    transports: ["polling"],
    auth: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzA4ODYxOTkuMTUwNTE1LCJleHAiOjE2NzE0OTEwMDAuMTUwNTE1LCJzdWIiOiJjcmlzQGdtYWlsLmNvbSIsInVzZXJfaWQiOiJlYjFkODhlNWY5MjA0OWFjYjEyOTVmNGYwYzg3MzlhMCJ9.EuACwT2y0MEibJAhLnaLU8r4EtLyRgogOnyBjCI1h9o",
    },
  });
  // console.log("Socket: ", socket);

  // socket2 = io("http://localhost", {
  //   extraHeaders: {
  //     Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzliNzE1NzE3OTZiZGM3MzczYjAwOGYiLCJlbWFpbCI6ImNyaXNAZ21haWwuY29tIiwiaWF0IjoxNjcxMTM5MTcyfQ.bfbWR5YoBa7Oofb1mhBoApkMHZYlUz-wqVI-DeeXdYc"      
  //   }
  // });

  // console.log('socket 2', socket2);
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