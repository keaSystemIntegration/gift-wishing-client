import { getCategoriesUrls } from '../get-all-categories-url/get-all-categories-url.js';

export default async function (context) {
    const categoriesUrls = await getCategoriesUrls();
    return categoriesUrls;
};