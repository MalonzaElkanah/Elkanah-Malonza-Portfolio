import logging
import requests


logging.basicConfig()


def get_location_data(ipAddress):
    """
    FreeGeoIP provides an easy-to-use and simple API that translates IP addresses to
    actual physical addresses. You can try a simple API request by entering the following
    in your browser:
        http://freegeoip.net/json/50.78.253.58

    This should produce the following response:
        {"ip":"50.78.253.58","country_code":"US","country_name":"United States",
        "region_code":"MA","region_name":"Massachusetts","city":"Boston",
        "zip_code":"02116","time_zone":"America/New_York","latitude":42.3496,
        "longitude":-71.0746,"metro_code":506}
    """

    try:
        response = requests.get(
            f"http://freegeoip.net/json/{str(ipAddress)}", timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        logging.error(e)
        return False
    except requests.ConnectTimeout:
        logging.error(
            "\033[31m\nConnection to the freegeoip.net server timed out!\033[00m"
        )
        return False
