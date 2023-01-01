import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let socket = null;
const accessToken = window.localStorage.token;
const url = "https://api.gifts.hotdeals.dev";


// let socket2 = null;
// const url2 = "http://gift-wishing.westeurope.azurecontainer.io/";



(async function() {
    socket = io(url, {
    transports: ["polling"],
    auth: {
      token: accessToken
    },
  });

  // socket2 = io(url2, { 
  //   extraHeaders: { 
  //     Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2FjYThmYjgzMzIyODk0MTA3NzAxMTkiLCJlbWFpbCI6ImVtYWlsQHRlc3QxLmNvbSIsImlhdCI6MTY3MjI1OTkyMX0.hrLOjK6OQnp9ZeZovIHa0TTYX43jdC_lxlgMJ9BQeK0"       
  //   } 
  // });
  
  // const user_connected_data = {friendsList: [{username: 'username1', userId: "userId1"}, {username: 'username2', userId: "userId2"}]}
  // socket2.emit("user_connected", user_connected_data)

  const response = axios.get("/wishes", {
    headers: {
      authorization:
        `Bearer ${accessToken}`,
    },
  });
  const result = await response;
  // console.log(result.data);
  window.localStorage.setItem("wishes", JSON.stringify(result.data));
  // console.log('wishes', window.localStorage.wishes);
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


// socket2.on('friends_status', data => {
//   console.log("friends_status", data);
// })

// socket2.on("update_user_status", (data1, data2) =>{
//   console.log("update_user_status", data1, data2);
// })