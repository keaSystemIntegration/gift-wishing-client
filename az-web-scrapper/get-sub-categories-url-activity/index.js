const getAllPotentialUrls = require('../get-sub-categories-urls/get-sub-categories-urls.js').getAllPotentialUrls;

module.exports = async function (context) {
    return getAllPotentialUrls(context.bindings.name);
};