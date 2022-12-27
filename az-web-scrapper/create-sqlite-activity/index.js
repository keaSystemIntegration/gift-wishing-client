import {insertProducts} from '../create-sqlite/create-sqlite.js';

export default async function (context) {
    insertProducts(context.bindings.name);
    return true
};