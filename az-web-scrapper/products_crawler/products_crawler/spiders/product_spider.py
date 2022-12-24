import scrapy
from scrapy.item import Item, Field

product_component_name = 'div.pr-1k8dg1g'
sub_category_component_class_name = "div.i54RWUrpDG"
entry_url = "https://www.pricerunner.com"


class PriceRunnerSpider(scrapy.Spider):
    name = "products"
    start_urls = []
    custom_settings = {"ITEM_PIPELINES": {
        'price_runner_spidy.price_runner_spidy.pipelines.PriceRunnerSpidyPipeline': 300,
    }}

    def parse(self, response):
        product_components = response.css(product_component_name)
        for product_component in product_components:
            product_item = ProductItem()
            if not product_component.css("a"):
                break
            product_item["main_category"] = response.css("a.EWsqM2HIwb").css("span::text").extract()[-1]
            product_item["sub_category"] = response.css("h1.pr-lilhn6::text").extract()[0]
            product_item["product_name"] = product_component.css("h3::text").extract()[0]
            try:
                product_item["product_description"] = product_component.css("p.pr-13b83wt::text").extract()[0]
            except IndexError:
                product_item["product_description"] = ""
            product_item["product_id"] = entry_url + product_component.css("a").attrib["href"]
            product_item["link"] = entry_url + product_component.css("a").attrib["href"]
            product_item["price"] = float((product_component.css("span.pr-be5x0o::text").extract()[0])[1:].replace(",", ""))
            try:
                product_item["overall_rating"] = product_component.css("p.pr-1ob9nd8::text").extract()[0]
            except IndexError:
                product_item["overall_rating"] = 0
            product_item["product_sub_title"] = ""

            yield product_item


class ProductItem(Item):
    product_id = Field()
    main_category = Field()
    sub_category = Field()
    product_name = Field()
    product_description = Field()
    link = Field()
    price = Field()
    overall_rating = Field()
    product_sub_title = Field()
