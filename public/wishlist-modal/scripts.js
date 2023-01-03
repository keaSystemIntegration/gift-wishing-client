$(document).on("click", ".friend__item", function () {
  // filter wishes based on the friend email
  const friend = $(this);
  const friendEmail = friend.attr('id');
  const wishes = JSON.parse(window.localStorage.wishes);
  const wishlistProducts = wishes.filter(wish => wish.user_email === friendEmail);

  $('#wishlist-modal').css('display', 'block');

  $('.modal-header__title').append(`
    <h2 class="modal-header__title_name">${friendEmail} Wish List</h2>
  `);
  // console.log(wishlistProducts);
  wishlistProducts.length > 0 ?
    wishlistProducts.forEach( (wishlistProduct) => {
      // console.log(wishlistProduct);
      fetch("https://api.gifts.hotdeals.dev/graphql",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
          {
            Product (product_id: "${wishlistProduct.product_name}") {
              product_name
            }
          }
          `
        })
      })
      .then(response => response.json())
      .then(result => {
        const productName = result?.data?.Product?.product_name;

        $(".friend-wishlist").append(`
          <div class="friend-wishlist__product" id="friend-product-${wishlistProduct.wish_id}">
            <span class="wishlist__product_name">
              ${productName}
            </span>
          </div>
        `); 
      });
    }) :
    $(".friend-wishlist").append(`
      <div class="friend-wishlist__product">No product</div>
    `);
})

$(document).on("click", ".close-modal", function () {
  $('#wishlist-modal').css('display', 'none');
  $('.modal-header__title_name').remove();
  $('.friend-wishlist__product').remove();
});

$(window).click(function(e) {
  if (e.target.id === 'wishlist-modal' ) {
    $('#wishlist-modal').css('display', 'none');
    $('.modal-header__title_name').remove();
    $('.friend-wishlist__product').remove();
  } 
});