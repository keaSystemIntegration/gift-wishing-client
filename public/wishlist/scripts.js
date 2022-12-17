// fetch user wishlist and display it on page
(async function() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzliNzE1NzE3OTZiZGM3MzczYjAwOGYiLCJlbWFpbCI6ImNyaXNAZ21haWwuY29tIiwiaWF0IjoxNjcxMTM5MTcyfQ.bfbWR5YoBa7Oofb1mhBoApkMHZYlUz-wqVI-DeeXdYc';
  const resp = axios.get('http://127.0.0.1/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    }
  });
  const res = await resp;
  console.log('server res', res);

  
  const response = axios.get('https://api.gifts.hotdeals.dev/wishes', {
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzA4ODYxOTkuMTUwNTE1LCJleHAiOjE2NzE0OTEwMDAuMTUwNTE1LCJzdWIiOiJjcmlzQGdtYWlsLmNvbSIsInVzZXJfaWQiOiJlYjFkODhlNWY5MjA0OWFjYjEyOTVmNGYwYzg3MzlhMCJ9.EuACwT2y0MEibJAhLnaLU8r4EtLyRgogOnyBjCI1h9o"
    }
  });
  const result = await response;
  const wishlistProducts = result?.data || [];
  // console.log(wishlistProducts);
  if (wishlistProducts.length > 0) {
    $('#wishlist__products').html(function() {
      return wishlistProducts.map((product, index) => `
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
    $('#wishlist__products').append(`
      <div class="no-products-template">No products</div>
    `);
  }
})();

// display remove popup
$(document).on("click", '.wishlist__product_remove-btn', function() {
  const productName = $(this).data('product-name');
  const productId = $(this).data('product-id');
  Swal.fire({
    title: `Remove ${productName}?`,
    icon: 'warning',
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
    cancelButtonText:
      'Cancel',
  })
});

// remove a product from wishes database
$(document).on("click", '#remove-product', async function() {
  const productName = $(this).data('product-name');
  const productId = $(this).data('product-id');
  // console.log(productName, productId);

  const response = axios.delete('https://api.gifts.hotdeals.dev/wishes', {
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzA3NjE3NjQuMDY2OTkzLCJleHAiOjE2NzEzNjY1NjUuMDY2OTkzLCJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIxODJlNTJhOTRhYWY0ZGZmODg3ZTdiOGU1NjA5NDcwZCJ9.MVGhDNGhPSQanuqh6y1EcLEnVnHIqPweSY86PEZTnPk"
    },
    data: {
      productName : productName
    }
  });
  const { status } = await response || 0;
  
  if (status === 204) {
    $(`#${productId}`).remove();
    if ( $('#wishlist__products').children().length === 0) {
      $('#wishlist__products').append(`
        <div class="no-products-template">No products</div>
      `);
    }  
  }
});