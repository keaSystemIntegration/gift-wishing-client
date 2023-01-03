const inviteForm = document.getElementById('friend-invite-form');
inviteForm.addEventListener('submit', sendInvite);

async function sendInvite(event) {
  event.preventDefault();

  const emailField = event.target.elements.email;
  const email = emailField.value;

  try {
    const response = await axios.post('/friend/invite', {
      email: email
    });
    console.log(response);
    emailField.value = '';
  } catch (error) {
    console.error(error);
  }
}

const acceptForm = document.getElementById('friend-accept-form');
acceptForm.addEventListener('submit', acceptInvite);

async function acceptInvite(event) {
  event.preventDefault();

  const tokenField = event.target.elements.token;
  const token = tokenField.value;

  try {
    const response = await axios.post('/auth/accept-invite', {
      token: token
    });
    console.log(response);
    tokenField.value = '';
  } catch (error) {
    console.error(error);
  }
}