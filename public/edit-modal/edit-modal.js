$(".input-field").focusout(function(){
    if($(this).val() != ""){
        $(this).addClass("has-content");
    }else{
        $(this).removeClass("has-content");
    }
});
 
$("label").on('click', function() {
    $(this).prev().focus();
});


let accountId = '';
let lastUpdated = '';

$(document).on("click", '.edit', function(){
    accountId = $(this).attr('data-id');
    
    const result = axios.get('/account/' + accountId);
    result.then(response => {
        const accountName = $("#edit-name-of-account");
        accountName.val(response.data.account[0].name);
        accountName.addClass("has-content");

        const username = $("#edit-username");
        username.val(response.data.account[0].username);
        username.addClass("has-content");


        const password = $("#edit-password");
        password.val(response.data.account[0].password);
        password.addClass("has-content");

        const logo_url = $("#edit-logo-url");
        logo_url.val(response.data.account[0].logo_url);
        logo_url.addClass("has-content");


        const details = $("#edit-details");
        details.val(response.data.account[0].details);
        
        // Because this one is optional
        if(details.val() != "") {
            details.addClass("has-content");
        } else {
            details.removeClass("has-content");
        }

        lastUpdated = response.data.account[0].last_updated;
    });
});

function hideEditModal() {
    $(".modal-backdrop").eq(2).css({"opacity": "0", "z-index": "-3", "transition": "opacity .2s, z-index .05s .2s"});
}

let oldPassword = "";
function displayEditModal(password) {
    oldPassword = password;
    // console.log(oldPassword);

    $(".modal-backdrop").eq(2).css({"opacity": "1", "z-index": "3", "transition": "opacity .4s .05s, z-index .05s"});
}

function submitEditHandler() {
    isPasswordChanged = false;
    event.preventDefault();
    console.log(oldPassword + '\n' + $('#edit-password').val())
    if (oldPassword !== $('#edit-password').val()) {
        lastUpdated = new Date();
        oldPassword = $('#edit-password').val();
        isPasswordChanged = true;
    } 
    convertedDate = new moment(lastUpdated).format('YYYY-MM-DD HH:mm:ss');
    // console.log(oldPassword)
    
    const updatedAccount = {
        
        id: accountId,
        name: $('#edit-name-of-account').val(),
        username: $('#edit-username').val(),
        password: $('#edit-password').val(),
        details: $('#edit-details').val() || '',
        logo_upload: '',
        logo_url: $('#edit-logo-url').val(),
        last_updated: convertedDate,
        isPasswordChanged: isPasswordChanged
    };

    const request = axios.patch('/account', updatedAccount);
    request.then(() => {

        //edit the fields in the UI
        $("#" + accountId + " .account-title .account-icon").attr( "src", updatedAccount.logo_url );
        $("#" + accountId + " .account-title .field").text( updatedAccount.name );
        $("#" + accountId + " .account-username .field").val( updatedAccount.username );
        $("#" + accountId + " .account-password .field").val( updatedAccount.password );

        let convertedDate = new moment(updatedAccount.last_updated).format('MMMM Do YYYY, h:mm:ss a');
        $("#" + accountId + " .last-updated .field").text( convertedDate );

        //updates the reference of the displayEditModal
        $("#" + accountId + " .button-group .edit").attr("onclick", "displayEditModal('" + updatedAccount.password + "')");

        // location.reload();
        hideEditModal();
        displayNotificationModal("The account has been successfully edited!");
        setTimeout(() => {
            hideNotification();
        }, 2000);
    });

    
}