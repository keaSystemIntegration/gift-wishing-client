// fetch user wishlist and display it on page
(function loadWishes() {
  const wishes = JSON.parse(window.localStorage.wishes);
  // console.log(wishes);

  createViewWishlist(wishes);
})();

function createViewWishlist(wishes) {
  const userEmail = JSON.parse(window.localStorage.user)?.email;
  const wishlistProducts = wishes?.filter(wish => wish.user_email === userEmail) || [];
  // console.log('wishlistProducts', wishlistProducts);
  if (wishlistProducts.length > 0) {
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
        // console.log(result?.data?.Product?.product_name)
        ;
        const productName = result?.data?.Product?.product_name;
        // console.log(wishlistProduct);
        // console.log(productName);

        $("#wishlist__products").append(`
          <div class="wishlist__product" id="${wishlistProduct.wish_id}">
            <span class="wishlist__product_name">
              ${productName}
            </span>
            <span
              class="wishlist__product_remove-btn"
              data-product-name="${wishlistProduct.product_name}"
              data-product-id="${wishlistProduct.wish_id}"
              data-view-name="${productName}"
            >
              <button>remove</button>
            </span>
          </div`
        ); 
      })
    });
  } else {
    $("#wishlist__products").append(`
      <div class="no-products-template">No products</div>
    `);
  }
}

// // display remove popup
$(document).on("click", ".wishlist__product_remove-btn", function () {
  const productName = $(this).data("product-name");
  const viewName = $(this).data("view-name");
  const productId = $(this).data("product-id");
  Swal.fire({
    title: `Remove ${viewName}?`,
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
