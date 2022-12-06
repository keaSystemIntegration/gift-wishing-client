function displayNotificationModal(notification) {
    $("#notification-box").html(notification);
    $('#notification-box').css( {
        "opacity": "1",
        "z-index": "3",
        "visibility": "visible",  
        "animation": "slide-down-notification .5s cubic-bezier(.22,.62,.7,.9)",   
        "transition": "opacity .3s"
    });
}

function hideNotification() {
    $('#notification-box').css( {
        "visibility": "hidden", 
        "opacity": "0", 
        "animation": "slide-up-notification .5s cubic-bezier(.22,.62,.7,.9)",  
        "transition": " visibility .3s, opacity .3s"
    });
}

