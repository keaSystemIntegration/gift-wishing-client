const socket = io();
const msgText = $('#msg');
const btnSend = $('#btn-send');
const chatBox = $('.chat-content');
const displayMsg = $('.message');

let username = '';
axios.get('/getUser')
.then(result => {
    username = result.data;
});

msgText.focus();

$(btnSend).on('click', function(event) {
    event.preventDefault();

    const msg = msgText.val();
    display(msg, 'your-message', username);
    socket.emit('sendMessage', msg);
    msgText.val('');
    msgText.focus();
    chatBox.scrollTop(chatBox.prop('scrollHeight')); // shows the last msg every time an message is sent
});

socket.on('sendToAll', data => {
    display(data.msg, 'other-message', data.username);
    chatBox.scrollTop(chatBox.prop('scrollHeight'));
});

const display = (msg, className, user) => {
    const msgDiv = $('<div></div>');
    msgDiv.addClass(className + ' message-row');

    const time = new Date().toLocaleTimeString();
    const innerText = `
        <div class="message-title">
        🐱<span>${user}</span>
        </div>

        <div class="message-text">
            ${msg}
        </div> 
        
        <div class="message-time">
            ${time}
        </div>
    `;

    msgDiv.html(innerText);
    displayMsg.append(msgDiv);
};

function closeChat() { 

    $("#live-chat-box").css({"opacity": "0", "z-index": "-3", "transition": "opacity .15s, z-index .05s .15s"});

    $("#live-chat-btn").css({"opacity": "1", "z-index": "3"});
}

function openChat() {
    $("#live-chat-box").css({"opacity": "1", "z-index": "3", "transition": "opacity .1s, z-index .05s"});

    $("#live-chat-btn").css({"opacity": "0", "z-index": "-3", "transition": "opacity .1s"});

    $(".chat-header #name").text(username);
}