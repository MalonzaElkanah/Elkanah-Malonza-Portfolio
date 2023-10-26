from admin.models import ActivityLog
from MyPortfolio.settings import (
    ACTIVATE_LOGS,
    LOG_AUTHENTICATED_USERS_ONLY,
    IP_ADDRESS_HEADERS,
)


def get_ip_address(request):
    for header in IP_ADDRESS_HEADERS:
        addr = request.META.get(header)
        if addr:
            return addr.split(",")[0].strip()


def get_os_browser(request):
    """
    - User-Agent
        'HTTP_USER_AGENT':
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0'
    """
    pass


class UserLoggerMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before the view (and later middleware) are called.
        response = self.get_response(request)

        # Code to be executed for each request/response after the view is called.

        # Confirm logging is enabled
        if not ACTIVATE_LOGS:
            return response

        if LOG_AUTHENTICATED_USERS_ONLY and not request.user.is_authenticated:
            return response

        if not request.path.startswith("/api/"):
            return response

        # Add log for the user
        # user = request.user.id
        self.writelog(request, response)

        return response

    def writelog(self, request, response):
        user = None
        if request.user.is_authenticated:
            user = request.user
        ActivityLog.objects.create(
            user=user,
            request_url=request.build_absolute_uri(),
            request_method=request.method,
            response_code=response.status_code,
            ip_address=get_ip_address(request),
        )
        # print(f"REQUEST: {request.headers}")
