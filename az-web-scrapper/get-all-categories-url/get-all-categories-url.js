import axios from "axios";

const categoriesUrl = "https://www.pricerunner.com/public/navigation/menu/uk/items"
const baseUrl = "https://www.pricerunner.com"

export const getCategoriesUrls = async () => {
    const { data } = await axios.get(categoriesUrl);
    return await data.topMenuItems.map(item => baseUrl + item.path);
}
