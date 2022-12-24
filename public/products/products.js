
const table = document.getElementById("products-table")
fetch("https://api.gifts.hotdeals.dev/graphql",
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            query: `
             {
                Products {
                    product_name
                    main_category
                    sub_category
                }
            }
            `
        })
    }
    ).then(response => response.json()).then(result => {
        console.log(result.data)
        result.data.Products.forEach(data=>{
            table.appendChild(createRow(data))
        })
})

function createRow(data) {
    console.log(data)
    const tableRow = document.createElement("tr")
    Object.entries(data).map((obj) => {
        const tableData = document.createElement("td")
        tableData.innerText = obj[1].toString()
        tableRow.appendChild(tableData)
    })
    return tableRow
}
