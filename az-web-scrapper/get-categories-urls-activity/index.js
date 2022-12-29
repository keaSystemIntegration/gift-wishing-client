const getCategoriesUrls = require('../get-all-categories-url/get-all-categories-url.js').getCategoriesUrls;

module.exports = async function (context) {
    const categoriesUrls = await getCategoriesUrls();
    context.log("categories urls contains: ", categoriesUrls.length);

    return categoriesUrls;
};