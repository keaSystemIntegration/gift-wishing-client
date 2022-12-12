(async function() {
  const response = axios.get('https://api.gifts.hotdeals.dev/wishes', {
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzA3NjE3NjQuMDY2OTkzLCJleHAiOjE2NzEzNjY1NjUuMDY2OTkzLCJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInVzZXJfaWQiOiIxODJlNTJhOTRhYWY0ZGZmODg3ZTdiOGU1NjA5NDcwZCJ9.MVGhDNGhPSQanuqh6y1EcLEnVnHIqPweSY86PEZTnPk"
    }
  });
  const result = await response;
  const wishlistProducts = result?.data || [];
  // console.log(wishlistProducts);
  if (wishlistProducts.length > 0) {
    $('#wishlist__products').html(function() {
      return wishlistProducts.map((product, index) => `
      <div class="wishlist__products_name">
        ${++index}. ${product.product_name}
      </div>`);
    });
    
  } else {
    $('#wishlist__products').append(`
      <div class="no-products-template">No products. Link to add products</div>
    `);
  }
})();

