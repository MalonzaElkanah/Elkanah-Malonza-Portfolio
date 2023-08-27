from django.contrib.auth import login

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    LoginSerializer,
)


import logging


logger = logging.getLogger(__name__)


class LoginAPIView(APIView):
    # model = User
    # serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)

        return Response({"token": token.key}, status=200)
