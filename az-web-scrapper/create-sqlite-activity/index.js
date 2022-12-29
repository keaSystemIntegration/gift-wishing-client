const insertProducts = require('../create-sqlite/create-sqlite.js').insertProducts;

module.exports = async function (context) {
    insertProducts(context.bindings.name);
    return true
};