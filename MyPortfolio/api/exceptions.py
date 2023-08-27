from rest_framework.exceptions import APIException


class ServiceUnavailable(APIException):
    status_code = 503
    default_detail = "Service temporarily unavailable, try again later."
    default_code = "service_unavailable"


class CustomException(APIException):
    status_code = 503
    detail = "Service temporarily unavailable, try again later."
    default_detail = "Service temporarily unavailable, try again later."
    default_code = "service_unavailable"

    def __init__(self, message, code=400):
        self.status_code = code
        self.default_detail = message
        self.detail = message
