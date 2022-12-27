import axios from "axios";
import {load} from "cheerio";

const categoriesCatalogUrl = "https://www.pricerunner.com/public/navigation/menu/uk/items"
const baseUrl = "https://www.pricerunner.com"

const getHtmlBody = async (url) => {
    const { data } = await axios.get(url);
    return load(data)
}


export async function  getSubCategoriesUrls (url)  {
    const $ = await getHtmlBody(url)
    const result = [];
    $("a.pr-1edcde9").each((i, el) => {
        result.push(baseUrl + $(el).attr().href)
    })
    return result;
}

// const urls = [
//    'https://www.pricerunner.com/t/34/Home-Interior',
//     'https://www.pricerunner.com/t/1424/Garden-Patio',
//     'https://www.pricerunner.com/t/35/Kids-Family',
//     'https://www.pricerunner.com/t/1493/Toys-Hobbies'
// ]

export async function getAllPotentialUrls(urls) {
    const result = [];
    for (const url of urls) {
        result.push(await getSubCategoriesUrls(url))
    }
    return result.flatMap(url => url)
}

// console.log(await test());