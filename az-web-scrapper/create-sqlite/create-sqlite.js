

const sqlite3 = require('sqlite3').verbose();



function createDbIfNotExists(db) {
    db.exec(`CREATE TABLE IF NOT EXISTS Products (
        product_id TEXT PRIMARY KEY NOT NULL,
        product_name TEXT NOT NULL,
        product_sub_title TEXT NOT NULL,
        product_description TEXT NOT NULL,
        main_category TEXT NOT NULL,
        sub_category TEXT NOT NULL,
        price REAL NOT NULL,
        link TEXT NOT NULL,
        overall_rating REAL NOT NULL
         )
    ;`);
}

function insertProducts(products) {
    const db = new sqlite3.Database('D:/home/products.db');
    createDbIfNotExists(db);
    const stmt = db.prepare("INSERT  OR IGNORE INTO Products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    products.forEach((product) => {
        stmt.run(
            product.product_id,
            product.product_name,
            product.product_sub_title,
            product.product_description,
            product.main_category,
            product.sub_category,
            product.price,
            product.link,
            product.overall_rating
        );
    });
    stmt.finalize();
}

module.exports = { insertProducts }