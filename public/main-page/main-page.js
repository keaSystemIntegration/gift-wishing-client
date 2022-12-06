(async function getProjects() {
    const response = await axios.get("/accounts");
    const result = response.data;
    
    
    result.accounts.map((account) => {
        let convertedDate = new moment(account.last_updated).format('MMMM Do YYYY, h:mm:ss a');

        let output = `
            <div id="${account.id}" class="account-box">
                <div class="account-title"> 
                    <img class="account-icon" src="${account.logo_url}" alt="account-icon"/>
                    
                    <span class="field">${account.name}</span>
                </div>
                
                <div class="account-username">
                    <input type="text" class="field" disabled value="${account.username}" />
                    <button class="button-small copy" onClick="copyText(${account.id}, 'account-username')" >
                        <i class="far fa-2x fa-copy"></i>
                        <div class="tooltip">Copied!</div>
                    </button>
                </div>

                <div class="account-password"> 
                    <input type="password" disabled class="field" value="${account.password}">
                    <button class="button-small copy" onClick="copyText(${account.id}, 'account-password')" >
                        <i class="far fa-2x fa-copy"></i>
                        <div class="tooltip">Copied!</div>
                    </button>
                    <button class="button-small watch" onClick="revealPassword(${account.id}, ${true})" >
                        <i class="far fa-2x fa-eye" ></i>
                    </button>
                    
                </div>

                <div class="last-updated"> 
                    <span class="field">${convertedDate}</span>
                </div>

                <div class="button-group">
                    <button data-id="${account.id}" class="edit" onclick="displayEditModal('${account.password}')">
                        Edit
                    </button>
                    <button data-id="${account.id}" class="delete">
                        Delete
                    </button>
                </div>
            </div>
        `;
        $("#account-list").append(output);
    });
})();

function revealPassword(accountId, show) {
    if (show) {
        $("#" + accountId + " .account-password input").attr('type', 'text');
        $("#" + accountId + " .account-password .watch i").attr('class', 'far fa-2x fa-eye-slash');
        $("#" + accountId + " .account-password .watch").attr('onclick', 
            'revealPassword(' + accountId +','+ false +')');
    } else {
        $("#" + accountId + " .account-password input").attr('type', 'password');
        $("#" + accountId + " .account-password .watch i").attr('class', 'far fa-2x fa-eye');
        $("#" + accountId + " .account-password .watch").attr('onclick', 
            'revealPassword(' + accountId +','+ true +')');
    }
    // console.log(show)
}

function copyText(accountId, field) {
    console.log(field)
    const element = $("#" + accountId + " ." + field + " input");
    const tooltip = $("#" + accountId + " ." + field + " button .tooltip");

    const temp = $("<input>");
    console.log(temp);
    $("body").append(temp);

    temp.val(element.val()).select();
    if (document.execCommand("copy")) {
        tooltip.css({"opacity": "1"});

        setTimeout(function() {
            tooltip.css({"opacity": "0"});
        }, 1000);
    } else {
        alert("Something went wrong! Refresh the page!");
    }
    temp.remove();
} 