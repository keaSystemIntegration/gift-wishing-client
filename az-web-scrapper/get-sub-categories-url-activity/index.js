import { getCategoriesUrls } from "../get-all-categories-url/get-all-categories-url.js";
import  {getAllPotentialUrls, getSubCategoriesUrls}  from "../get-sub-categories-urls/get-sub-categories-urls.js"

export default async function (context) {
    return getAllPotentialUrls(context.bindings.name);
};