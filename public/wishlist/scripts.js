// fetch user wishlist and display it on page
const accessToken = window.localStorage.token;
(async function() {
  const wishes = JSON.parse(window.localStorage.wishes);
  // console.log(wishes);
  const userEmail = JSON.parse(window.localStorage.user)?.email;
  const wishlistProducts = wishes?.filter(wish => wish.user_email === userEmail) || [];
  if (wishlistProducts.length > 0) {
    $("#wishlist__products").append(function () {
      return wishlistProducts.map(
        (product, index) => `
      <div class="wishlist__product" id="${product.wish_id}">
        <span class="wishlist__product_name">
          ${++index}. ${product.product_name}
        </span>
        <span
          class="wishlist__product_remove-btn"
          data-product-name="${product.product_name}"
          data-product-id="${product.wish_id}"
        >
          <button>remove</button>
        </span>
      </div>
      `);
    });
  } else {
    $("#wishlist__products").append(`
      <div class="no-products-template">No products</div>
    `);
  }
})();

// display remove popup
$(document).on("click", ".wishlist__product_remove-btn", function () {
  const productName = $(this).data("product-name");
  const productId = $(this).data("product-id");
  Swal.fire({
    title: `Remove ${productName}?`,
    icon: "warning",
    html: `Are you sure you want to remove the product from your wish list?`,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <div 
        id="remove-product" 
        data-product-name="${productName}" 
        data-product-id="${productId}"
      >
        Yes
      </div>`,
    cancelButtonText: "Cancel",
  });
});

// remove a product from wishes database
$(document).on("click", "#remove-product", async function () {
  const productName = $(this).data("product-name");
  const productId = $(this).data("product-id");
  // console.log(productName, productId);

  const response = axios.delete("/wishes", {
    headers: {
      authorization:
        `Bearer ${accessToken}`,
    },
    data: {
      productName: productName,
    },
  });
  const { status } = (await response) || 0;

  if (status === 204) {
    $(`#${productId}`).remove();
    if ($("#wishlist__products").children().length === 0) {
      $("#wishlist__products").append(`
        <div class="no-products-template">No products</div>
      `);
    }
  }
});