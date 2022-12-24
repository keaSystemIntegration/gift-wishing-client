from typing import List
import scrapy
import requests
from scrapy import Item

category_url_class = "a.pr-1edcde9"
entry_url = "https://www.pricerunner.com"

class CategoryItem(Item):
    url = scrapy.Field()


def menu_item_list():
    response = requests.get("https://www.pricerunner.com/public/navigation/menu/uk/items")
    result = []
    top_menu_item = response.json()["topMenuItems"]
    for menu_item in top_menu_item:
        result.append(entry_url + menu_item["path"])
    return result


class CategoriesSpider(scrapy.Spider):
    name = "category"
    start_urls = menu_item_list()
    result: List[CategoryItem] = []

    def parse(self, response):
        urls = []
        sub_categories = response.css(category_url_class)
        for sub_category in sub_categories:
            if "?attr_" not in sub_category.attrib["href"]:
                break
            self.result.append(entry_url + sub_category.attrib["href"])
            yield {"url": entry_url + sub_category.attrib["href"]}
            # the url result needs to be used by product_spider


