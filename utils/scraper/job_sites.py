from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions

from bs4 import BeautifulSoup
from urllib.parse import urlparse

import requests
import logging
import time


logging.basicConfig()


class HTMLCrawler:
    def __init__(self, site):
        self.site = site
        self.driver = None

        if site.site_type == "dynamic":
            options = FirefoxOptions()
            options.add_argument("--headless")
            self.driver = webdriver.Firefox()

    def get_page(self, url, selector=None):
        if self.site.site_type == "dynamic":
            self.driver.get(url)

            try:
                if selector is not None:
                    WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                else:
                    WebDriverWait(self.driver, 10)
            finally:
                page_source = self.driver.page_source
        else:
            try:
                req = requests.get(url, timeout=5)
                page_source = req.text
            except requests.exceptions.RequestException as e:
                logging.error(e)

                return None

        return BeautifulSoup(page_source, "html.parser")

    def get_text(self, page_obj, selector):
        """
        Utility function used to get a content string from a
        Beautiful Soup object and a selector. Returns an empty
        string if no object is found for the given selector
        """
        selected_elems = page_obj.select(selector)
        if selected_elems is not None and len(selected_elems) > 0:
            return "\n".join([elem.get_text() for elem in selected_elems])

        return ""

    def get_text_list(self, page_obj, selector):
        """
        Utility function used to get a list of content string
        from a Beautiful Soup object and a selector. Returns an
        empty list if no object is found for the given selector
        """
        selected_elems = page_obj.select(selector)
        if selected_elems is not None and len(selected_elems) > 0:
            return [elem.get_text() for elem in selected_elems]

        return []

    def parse(self, url=None, selector=None):
        """
        Extract content from a given page URL
        """
        if not url:
            url = self.site.job_list_link

        if not selector:
            selector = self.site.job_link_element

        bs = self.get_page(url)
        if bs is not None:
            return self.get_text(bs, selector)

        return None

    def crawl(self):
        """
        Get pages from website link
        """
        job_data = []

        bs = self.get_page(self.site.job_list_link, selector=self.site.job_link_element)

        # target_pages = bs.findAll('a', href=re.compile(self.site.job_link_element))
        target_pages = bs.select(self.site.job_link_element)

        for target_page in target_pages:
            target_page = target_page.attrs["href"]

            if not target_page.startswith("http"):
                domain = urlparse(self.site.job_list_link).netloc
                target_page = f"https://{domain}{target_page}"

            # self.parse(url=targetPage)
            print(f"Target Page: {target_page}")

            bs = self.get_page(target_page, selector=self.site.name_element)

            if bs:
                data = {
                    "name": self.get_text(bs, self.site.name_element),
                    "experience": self.get_text(bs, self.site.experience_element),
                    "description": self.get_text(bs, self.site.description_element),
                    "organization": self.get_text(bs, self.site.organization_element),
                    "address": self.get_text(bs, self.site.address_element),
                    "deadline": self.get_text(bs, self.site.deadline_element),
                    "link": target_page,
                    "job_site": self.site,
                    "qualifications": self.get_text_list(
                        bs, self.site.qualification_element
                    ),
                    "attributes": self.get_text_list(bs, self.site.attribute_element),
                }

                job_data.append(data)

            time.sleep(3)

        from pprint import pprint

        pprint(f"Data Scrapped: {job_data}")

        return job_data

    def teardown(self):
        if self.site.site_type == "dynamic" and self.driver is not None:
            self.driver.close()


class JSONCrawler:
    def __init__(self, endpoint):
        self.site = endpoint

    def get_json(self, url):
        try:
            req = requests.get(url, timeout=5)
            req.raise_for_status()

            return req.json()
        except requests.exceptions.RequestException as e:
            logging.error(e)

            return None

    def get_text_value(self, json, key):
        """
        Utility function used to get a content string from a
        JSON object and a key. Returns an empty
        string if no object is found for the given key
        """
        if type(json) == dict:
            value = json.get(key)

        if value is not None:
            if type(value) == list:
                return ", ".join([str(elem) for elem in value])

            elif type(value) == dict:
                return ", ".join([str(elem) for elem in value.values()])

            return value

        return ""

    def get_object(self, json, key):
        """
        Utility function used to get a obj of (list, dict, str)
        from a JSON object and a key. Returns an
        empty object is found for the given key
        """
        if type(json) == dict:
            value = json.get(key)
            if value is not None:
                return value

        return ""

    def parse(self, url=None, key=None):
        """
        Extract content from a given endpoint URL
        """
        if not url:
            url = self.site.job_list_link

        if not key:
            key = self.site.job_link_element

        json = self.get_json(url)
        if json is not None:
            return self.get_text_value(json, key)

        return None

    def crawl(self):
        """
        Get pages from website link
        """
        job_data = []

        json = self.get_json(self.site.url)

        if json is not None:
            if type(json) == dict:
                json_list = self.get_object(json, self.site.job_link_element)
                if type(json_list) == list:
                    json = json_list
                else:
                    json = [json]

            for item in json:
                data = {
                    "name": self.get_text_value(item, self.site.name_element),
                    "experience": self.get_text_value(
                        item, self.site.experience_element
                    ),
                    "description": self.get_text_value(
                        item, self.site.description_element
                    ),
                    "organization": self.get_text_value(
                        item, self.site.organization_element
                    ),
                    "address": self.get_text_value(item, self.site.address_element),
                    "deadline": self.get_text_value(item, self.site.deadline_element),
                    "link": self.site.url,
                    "job_site": self.site,
                    "qualifications": self.get_object(
                        item, self.site.qualification_element
                    ),
                    "attributes": self.get_object(item, self.site.attribute_element),
                }

                job_data.append(data)

        return job_data

    def teardown(self):
        pass
