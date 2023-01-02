(async function addProfilePicture() {
	const user = window.localStorage.getItem("user");
	if(user){
		const userId = JSON.parse(user).user_id;
		const route = "/pictures";
		const append = "/"+userId;
		const queryUrl = route+append;
		console.log("queryUrl: ", queryUrl);
		try {
			const response = await axios.get(queryUrl);
			const src = response.data.url;
			console.log("We got a response : ", src);
			if(src){
				// H2 Element
				const h2 = document.createElement('h2');
				h2.textContent = 'Current Profile Picture:';

				// Image
				const img = document.createElement('img');
				
				img.className = 'profile-picture';
				img.id = 'profile-picture-id';
				img.src = src;

				// Delete button
				const button = document.createElement('button');
				button.textContent = 'Delete Picture';
				
				button.onclick = () => {
					axios.delete('/pictures/'+userId)
						.then((response) => {
							window.location.reload();
							console.log(response);
						})
						.catch((error) => {
							console.error(error);
						});
				};

				// -----------------------------------------
						// Append elements to div
				// -----------------------------------------
				const profilePictureDiv = document.getElementById('profile-picture-div');
				profilePictureDiv.appendChild(h2);
				profilePictureDiv.appendChild(img);
				profilePictureDiv.appendChild(button);
			}
		} catch (err) {
			console.error("Error in sidebar: ", err);
		}
	}
})();

const form = document.getElementById('account-form');

form.addEventListener('submit', (event) => {
	const user = window.localStorage.getItem("user");
	let userId = "";
	if(user){
		userId = JSON.parse(user).user_id;
	}
  event.preventDefault();
  const fileInput = document.getElementById('profile-picture');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('', file);

  axios.post('/pictures/'+userId, formData)
    .then((response) => {
      if(response.data.url){
				window.location.reload();
			}
      console.log(response);
    })
    .catch((error) => {
      // Do something with the error
      console.error(error);
    });
});
