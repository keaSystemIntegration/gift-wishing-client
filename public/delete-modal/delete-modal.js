$(document).on("click", '.delete', function(){
    // event.preventDefault();
    let id = $(this).attr('data-id');
    // console.log(id);
    $('#delRef').attr('data-id', id);
    displayDeleteAccount();
}); // maybe moved into main-page.js cause the delete class is there

// call the backend
function deleteAccount(id) { 
    $('#' + id).remove();
    const response = axios.delete('/account/' + id);
    response.then(() => {
        hideDeleteModal();
    
        displayNotificationModal("The account has been successfully deleted");
        setTimeout(() => {
            hideNotification();
        }, 2000);
    });
}

function hideDeleteModal() {
    $(".modal-backdrop").eq(1).css({"opacity": "0", "z-index": "-3", "transition": "opacity .2s, z-index .05s .2s"});
}

function displayDeleteAccount() {
    $(".modal-backdrop").eq(1).css({"opacity": "1", "z-index": "3", "transition": "opacity .4s .05s, z-index .05s"});
}
