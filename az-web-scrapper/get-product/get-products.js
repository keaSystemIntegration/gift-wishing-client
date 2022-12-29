const axios = require('axios');
const load = require('cheerio').load;

const baseUrl = "https://www.pricerunner.com"

const getProductsHtml = async (url) => {
    const {data} = await axios.get(url);
    return data
}



const getProducts = async (url) => {
    const result = [];
    const $ =load(await  getProductsHtml(url))
    $("div.k6oEmfY83J").each((i, el) => {
        const product = {}
        product.main_category = $("a.EWsqM2HIwb").text()
        product.sub_category = $("h1.KeWWdsnAoz").text()
        product.product_name = $(el).find("h3.pr-7iigu3").text() 
        product.product_description = $(el).find("p.pr-13b83wt").text()
        const link = $(el).find("a").attr()? $(el).find("a").attr().href : ""
        product.product_id = baseUrl + link
        product.link = baseUrl + link
        product.price = parseInt($(el).find("span.pr-be5x0o").text().substring(1))
        product.overall_rating = $(el).find("p.pr-1ob9nd8").text()??0
        product.product_sub_title = ""
        if(product.product_name.length>0)
            result.push(product)
    })
    return result
}


async function getAllproducts(urls) {
    const result = [];
    for (const url of urls) {
        if (url.includes("attr_"))
            result.push(await getProducts(url))
    }
    return result.flatMap(url => url)
}

module.exports = { getProducts, getAllproducts }