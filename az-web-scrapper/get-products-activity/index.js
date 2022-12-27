import { getAllproducts } from '../get-product/get-products.js';

export default async function (context) {
    const result = getAllproducts(context.bindings.name)
    return result;
};