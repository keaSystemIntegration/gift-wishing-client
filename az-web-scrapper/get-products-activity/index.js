
const getAllproducts = require('../get-product/get-products.js').getAllproducts;

module.exports = async function (context) {
    const productsResult = await getAllproducts(context.bindings.name)
    context.log("products results contains: ", productsResult.length);
    return productsResult;
}