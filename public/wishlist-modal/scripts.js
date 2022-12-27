$(document).on("click", ".friend__item", function () {
  // filter wishes based on the friend email
  const friend = $(this);
  const friendEmail = friend.attr('id');
  const wishes = JSON.parse(window.localStorage.wishes);
  const wishlistProducts = wishes.filter(wish => wish.user_email === friendEmail);

  $('#wishlist-modal').css('display', 'block');

  $('.modal-header__title').append(`
    <span class="modal-header__title_name">${friendEmail} Wish List</span>
  `);
  console.log(wishlistProducts);
  wishlistProducts.length > 0 ? 
    $('.friend-wishlist').append(function() {
      return wishlistProducts.map((product, index) => `
        <div class="friend-wishlist__product" id="friend-product-${product.wish_id}">
          <span class="wishlist__product_name">
            ${++index}. ${product.product_name}
          </span>
        </div>
      `);
    }) : 
    $('.friend-wishlist').append(`<div class="friend-wishlist__product">No product</div>`)
});

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