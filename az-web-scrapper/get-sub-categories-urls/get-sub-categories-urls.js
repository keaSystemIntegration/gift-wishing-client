const axios = require('axios');
const load = require('cheerio').load;

const categoriesCatalogUrl = "https://www.pricerunner.com/public/navigation/menu/uk/items"
const baseUrl = "https://www.pricerunner.com"

const getHtmlBody = async (url) => {
    const { data } = await axios.get(url);
    return load(data)
}


async function  getSubCategoriesUrls (url)  {
    const $ = await getHtmlBody(url)
    const result = [];
    $("a.pr-1edcde9").each((i, el) => {
        result.push(baseUrl + $(el).attr().href)
    })
    return result;
}

 async function getAllPotentialUrls(urls) {
    const result = [];
    for (const url of urls) {
        result.push(await getSubCategoriesUrls(url))
    }
    return result.flatMap(url => url)
}

module.exports = { getSubCategoriesUrls, getAllPotentialUrls }
// console.log(await test());