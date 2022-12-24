import logging
from typing import List
from twisted.internet import reactor, defer
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging
from scrapy.utils.project import get_project_settings
from categories_crawler.categories_crawler.spiders.categories_spider import CategoriesSpider, CategoryItem


logging.getLogger('scrapy').propagate = False
def main(name: str) -> List[CategoryItem]:
    crawl()
    reactor.run()
    print("Reactor stopped")
    print(CategoriesSpider.result)
    return CategoriesSpider.result


@defer.inlineCallbacks
def crawl():
    configure_logging()
    settings = get_project_settings()
    runner = CrawlerRunner(settings)
    yield runner.crawl(CategoriesSpider)
    reactor.stop()