// const accessToken = window.localStorage.token;

var allProducts = [];
var productDiv;

function createViewProducts(product) {
  productDiv.appendChild(createRow(product));
  document.getElementById(product.product_id).addEventListener("click", () => {
    addToWishList(product.product_id);
  });
}

(function loadData() {
  productDiv = document.getElementById("products");
  document.getElementById("search-product").addEventListener("input", () => {
    const searchInput = document.getElementById("search-product").value;
    console.log(searchInput);
    searchProduct(searchInput);
  });

  fetch("https://api.gifts.hotdeals.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      query: `
             {
                Products {
                    product_id
                    product_name
                    sub_category
                    main_category
                    link
                }
            }
            `,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      allProducts = result.data["Products"];
      allProducts.forEach((product) => {
        createViewProducts(product);
      });
    });
})();

function createRow(product) {
  const productItem = createDivTag("div", "product-row", "");
  const productName = createDivTag(
    "div",
    "product-detail",
    product.product_name
  );
  const productMainCategory = createDivTag(
    "div",
    "product-detail",
    product.main_category
  );
  const productSubCategory = createDivTag(
    "div",
    "product-detail",
    product.sub_category
  );
  const addToWishListButton = createDivTag(
    "button",
    "add-product-button",
    "Add",
    product.product_id
  );
  productItem.appendChild(productName);
  productItem.appendChild(productMainCategory);
  productItem.appendChild(productSubCategory);
  productItem.appendChild(addToWishListButton);

  return productItem;
}

function createDivTag(tag, className, content, id) {
  const divTag = document.createElement(tag);
  divTag.classList.add(className);
  divTag.innerText = content;
  if (id) divTag.setAttribute("id", id);
  return divTag;
}

function addToWishList(itemId) {
  fetch("https://api.gifts.hotdeals.dev/wishes", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      //   Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      productName: itemId,
    }),
  }).then((response) => console.log(response));
}

function searchProduct(searchInput) {
  productDiv.innerHTML = "";
  const filteredProducts = allProducts.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.main_category.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.sub_category.toLowerCase().includes(searchInput.toLowerCase())
  );
  productDiv.replaceChildren();
  filteredProducts.forEach((product) => createViewProducts(product));
  console.log(filteredProducts.length);
}
